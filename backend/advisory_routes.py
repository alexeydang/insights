from fastapi import APIRouter, HTTPException, BackgroundTasks
from motor.motor_asyncio import AsyncIOMotorDatabase
import uuid
import logging
from datetime import datetime, timedelta
from typing import List
from models import (
    CreateSessionRequest, CreateSessionResponse,
    SubmitProbingAnswersRequest, SubmitProbingAnswersResponse,
    GetAdviceResponse, AdvisorySession, SessionStatus, InnovatorAdvice
)
from ai_service import AIAdvisoryService

router = APIRouter(prefix="/api", tags=["Advisory"])
logger = logging.getLogger(__name__)

# Global variables (will be set in main app)
db: AsyncIOMotorDatabase = None
ai_service: AIAdvisoryService = None

def set_dependencies(database: AsyncIOMotorDatabase, ai_svc: AIAdvisoryService):
    global db, ai_service
    db = database
    ai_service = ai_svc

@router.post("/sessions", response_model=CreateSessionResponse)
async def create_session(request: CreateSessionRequest):
    """Create a new advisory session with probing questions"""
    try:
        session_id = str(uuid.uuid4())
        
        # Generate probing questions using AI
        probing_questions, probing_options = await ai_service.generate_probing_questions(
            request.user_question, session_id
        )
        
        # Create session object
        session = AdvisorySession(
            session_id=session_id,
            user_question=request.user_question,
            probing_questions=probing_questions,
            probing_options=probing_options,
            status=SessionStatus.PENDING
        )
        
        # Save to database
        session_dict = session.dict(by_alias=True, exclude={"id"})
        result = await db.advisory_sessions.insert_one(session_dict)
        
        logger.info(f"Created advisory session {session_id}")
        
        return CreateSessionResponse(
            session_id=session_id,
            probing_questions=probing_questions,
            probing_options=probing_options,
            created_at=session.created_at
        )
        
    except Exception as e:
        logger.error(f"Error creating session: {e}")
        raise HTTPException(status_code=500, detail="Failed to create advisory session")

@router.post("/sessions/{session_id}/probing-answers", response_model=SubmitProbingAnswersResponse)
async def submit_probing_answers(session_id: str, request: SubmitProbingAnswersRequest, background_tasks: BackgroundTasks):
    """Submit probing question answers and trigger advice generation"""
    try:
        # Find session
        session_doc = await db.advisory_sessions.find_one({"session_id": session_id})
        if not session_doc:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session = AdvisorySession(**session_doc)
        
        if session.status != SessionStatus.PENDING:
            raise HTTPException(status_code=400, detail="Session is not in pending state")
        
        # Update session with answers and set to processing
        update_data = {
            "probing_answers": request.answers,
            "status": SessionStatus.PROCESSING.value
        }
        
        await db.advisory_sessions.update_one(
            {"session_id": session_id},
            {"$set": update_data}
        )
        
        # Trigger background advice generation
        background_tasks.add_task(generate_advice_background, session_id, session.user_question, request.answers)
        
        logger.info(f"Started advice generation for session {session_id}")
        
        return SubmitProbingAnswersResponse(
            session_id=session_id,
            processing=True,
            estimated_completion=datetime.utcnow() + timedelta(seconds=30)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error submitting probing answers: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit probing answers")

@router.get("/sessions/{session_id}/advice", response_model=GetAdviceResponse)
async def get_advice(session_id: str):
    """Get AI-generated advice for a session"""
    try:
        # Find session
        session_doc = await db.advisory_sessions.find_one({"session_id": session_id})
        if not session_doc:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session = AdvisorySession(**session_doc)
        
        if session.status == SessionStatus.PENDING:
            raise HTTPException(status_code=400, detail="Please submit probing answers first")
        elif session.status == SessionStatus.PROCESSING:
            raise HTTPException(status_code=202, detail="Advice is still being generated")
        elif session.status == SessionStatus.FAILED:
            raise HTTPException(status_code=500, detail="Advice generation failed")
        
        return GetAdviceResponse(
            session_id=session_id,
            user_question=session.user_question,
            probing_answers=session.probing_answers,
            advice=session.advice,
            status=session.status.value
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting advice: {e}")
        raise HTTPException(status_code=500, detail="Failed to get advice")

async def generate_advice_background(session_id: str, user_question: str, probing_answers: dict):
    """Background task to generate advice from innovators"""
    try:
        logger.info(f"Generating advice for session {session_id}")
        
        # Generate advice using AI service
        advice_data = await ai_service.generate_innovator_advice(
            user_question, probing_answers, session_id
        )
        
        # Convert to InnovatorAdvice objects
        advice_objects = [InnovatorAdvice(**advice) for advice in advice_data]
        
        # Update session with generated advice
        update_data = {
            "advice": [advice.dict() for advice in advice_objects],
            "status": SessionStatus.COMPLETED.value,
            "completed_at": datetime.utcnow()
        }
        
        await db.advisory_sessions.update_one(
            {"session_id": session_id},
            {"$set": update_data}
        )
        
        logger.info(f"Successfully generated advice for session {session_id}")
        
    except Exception as e:
        logger.error(f"Error in background advice generation for session {session_id}: {e}")
        
        # Mark session as failed
        await db.advisory_sessions.update_one(
            {"session_id": session_id},
            {"$set": {"status": SessionStatus.FAILED.value}}
        )