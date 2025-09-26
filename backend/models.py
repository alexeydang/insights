from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime
from enum import Enum

class SessionStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing" 
    COMPLETED = "completed"
    FAILED = "failed"

class InnovatorAdvice(BaseModel):
    innovator: str
    title: str
    confidence: str
    advice_text: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)

class AdvisorySession(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    session_id: str
    user_question: str
    probing_questions: List[str] = []
    probing_options: List[List[str]] = []
    probing_answers: Dict[str, str] = {}
    advice: List[InnovatorAdvice] = []
    status: SessionStatus = SessionStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    
    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

# Request/Response models
class CreateSessionRequest(BaseModel):
    user_question: str = Field(..., min_length=1, max_length=500)

class CreateSessionResponse(BaseModel):
    session_id: str
    probing_questions: List[str]
    probing_options: List[List[str]]
    created_at: datetime

class SubmitProbingAnswersRequest(BaseModel):
    answers: Dict[str, str]

class SubmitProbingAnswersResponse(BaseModel):
    session_id: str
    processing: bool = True
    estimated_completion: datetime

class GetAdviceResponse(BaseModel):
    session_id: str
    user_question: str
    probing_answers: Dict[str, str]
    advice: List[InnovatorAdvice]
    status: str