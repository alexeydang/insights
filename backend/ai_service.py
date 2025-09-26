import os
import asyncio
import logging
from typing import List, Dict, Tuple
from datetime import datetime
from emergentintegrations.llm.chat import LlmChat, UserMessage
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class AIAdvisoryService:
    def __init__(self):
        self.api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not self.api_key:
            raise ValueError("EMERGENT_LLM_KEY not found in environment variables")
    
    def _create_chat(self, session_id: str, system_message: str) -> LlmChat:
        """Create a new LlmChat instance"""
        return LlmChat(
            api_key=self.api_key,
            session_id=session_id,
            system_message=system_message
        ).with_model("openai", "gpt-4o")
    
    async def generate_probing_questions(self, user_question: str, session_id: str) -> Tuple[List[str], List[List[str]]]:
        """Generate contextual probing questions based on user's initial question"""
        try:
            system_message = """
            You are an AI assistant that generates strategic probing questions to better understand business challenges.
            
            Your task: Generate exactly 3 relevant follow-up questions with multiple choice options to gather context about the user's situation.
            
            Format your response as JSON:
            {
              "questions": ["question1", "question2", "question3"],
              "options": [
                ["option1a", "option1b", "option1c", "option1d"],
                ["option2a", "option2b", "option2c", "option2d"],
                ["option3a", "option3b", "option3c", "option3d"]
              ]
            }
            
            Focus on:
            1. Business stage/maturity
            2. Primary goals/objectives  
            3. Resources/constraints
            
            Make questions specific to their challenge and provide 4 realistic options each.
            """
            
            chat = self._create_chat(session_id + "_probing", system_message)
            
            user_message = UserMessage(
                text=f"User's challenge: {user_question}\n\nGenerate 3 strategic probing questions with 4 multiple choice options each."
            )
            
            response = await chat.send_message(user_message)
            
            # Parse JSON response
            import json
            try:
                data = json.loads(response)
                return data["questions"], data["options"]
            except (json.JSONDecodeError, KeyError) as e:
                logger.error(f"Failed to parse probing questions response: {e}")
                # Fallback to default questions
                return self._get_default_probing_questions()
                
        except Exception as e:
            logger.error(f"Error generating probing questions: {e}")
            return self._get_default_probing_questions()
    
    def _get_default_probing_questions(self) -> Tuple[List[str], List[List[str]]]:
        """Fallback probing questions"""
        questions = [
            "What stage is your business or project currently in?",
            "What's your primary goal with this challenge?", 
            "What resources or constraints are you working with?"
        ]
        
        options = [
            [
                "Just an idea - haven't started yet",
                "Early stage - validating concept", 
                "Growing business - scaling challenges",
                "Established - looking to innovate"
            ],
            [
                "Increase revenue and profitability",
                "Improve operational efficiency",
                "Enter new markets or segments", 
                "Build a stronger team or culture",
                "Develop better products or services"
            ],
            [
                "Limited budget, need creative solutions",
                "Sufficient funding, need strategic direction",
                "Small team, need to prioritize",
                "Large organization, need to move fast",
                "Time-sensitive opportunity"
            ]
        ]
        
        return questions, options
    
    async def generate_innovator_advice(self, user_question: str, probing_answers: Dict[str, str], session_id: str) -> List[Dict[str, str]]:
        """Generate advice from all three innovators"""
        innovators = [
            {
                "name": "Jeff Bezos",
                "title": "Amazon Founder",
                "confidence": "94.7%",
                "persona_prompt": """
                You are Jeff Bezos, founder of Amazon. Respond with your characteristic customer-obsessed, long-term thinking approach.
                
                Key principles to incorporate:
                - Start with the customer and work backwards
                - Think long-term (10+ years)
                - Invent and simplify
                - Are right, a lot
                - Learn and be curious
                - Hire and develop the best
                - Insist on the highest standards
                - Think big
                - Bias for action
                - Be frugal
                - Earn trust
                - Dive deep
                - Have backbone; disagree and commit
                - Deliver results
                
                Your advice should be practical, data-driven, and focused on building systems that scale. 
                Use examples from Amazon's journey when relevant.
                
                Keep your response to 3-4 substantial paragraphs with actionable insights.
                """
            },
            {
                "name": "Steve Jobs", 
                "title": "Apple Co-founder",
                "confidence": "96.2%",
                "persona_prompt": """
                You are Steve Jobs, co-founder of Apple. Respond with your perfectionist, design-obsessed, user-experience focused approach.
                
                Key principles to incorporate:
                - Simplicity is the ultimate sophistication
                - Focus on the user experience above all
                - Design is not just how it looks, but how it works
                - Say no to 1000 things to say yes to one
                - Think different
                - Make it insanely great
                - Attention to every detail matters
                - Create products people don't know they need yet
                - Marketing is about values
                - Build products that are at the intersection of technology and liberal arts
                
                Your advice should be passionate, focused on excellence, and emphasize the importance of vision and execution.
                Use examples from Apple's product development when relevant.
                
                Keep your response to 3-4 substantial paragraphs with actionable insights.
                """
            },
            {
                "name": "Elon Musk",
                "title": "Tesla & SpaceX CEO", 
                "confidence": "92.8%",
                "persona_prompt": """
                You are Elon Musk, CEO of Tesla and SpaceX. Respond with your first-principles thinking, ambitious goal-setting approach.
                
                Key principles to incorporate:
                - Apply first principles thinking to everything
                - Set ambitious, seemingly impossible goals
                - Move fast and iterate rapidly
                - Question conventional wisdom and assumptions
                - Focus on solving humanity's biggest problems
                - Work incredibly hard and expect the same from others
                - Think in terms of systems and physics
                - Take calculated risks
                - Be willing to fail fast and learn
                - Vertical integration when it makes sense
                - Manufacturing is the hard part
                - Make the impossible inevitable
                
                Your advice should be bold, challenge assumptions, and push for 10x improvements rather than 10% gains.
                Use examples from Tesla, SpaceX, or other ventures when relevant.
                
                Keep your response to 3-4 substantial paragraphs with actionable insights.
                """
            }
        ]
        
        # Generate context from probing answers
        context = self._build_context(user_question, probing_answers)
        
        # Generate advice from each innovator concurrently
        tasks = []
        for innovator in innovators:
            task = self._generate_single_advice(innovator, context, session_id)
            tasks.append(task)
        
        advice_results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Process results
        advice_list = []
        for i, result in enumerate(advice_results):
            if isinstance(result, Exception):
                logger.error(f"Error generating advice for {innovators[i]['name']}: {result}")
                # Fallback advice
                advice_list.append({
                    "innovator": innovators[i]["name"],
                    "title": innovators[i]["title"],
                    "confidence": innovators[i]["confidence"],
                    "advice_text": f"I apologize, but I'm unable to provide specific advice at this time. However, I encourage you to focus on the fundamentals of your challenge and seek multiple perspectives.",
                    "generated_at": datetime.utcnow()
                })
            else:
                advice_list.append({
                    "innovator": innovators[i]["name"],
                    "title": innovators[i]["title"], 
                    "confidence": innovators[i]["confidence"],
                    "advice_text": result,
                    "generated_at": datetime.utcnow()
                })
        
        return advice_list
    
    def _build_context(self, user_question: str, probing_answers: Dict[str, str]) -> str:
        """Build context string from user question and probing answers"""
        context = f"User's Challenge: {user_question}\n\n"
        context += "Additional Context:\n"
        
        for key, answer in probing_answers.items():
            context += f"- {answer}\n"
        
        return context
    
    async def _generate_single_advice(self, innovator: Dict, context: str, session_id: str) -> str:
        """Generate advice from a single innovator"""
        try:
            chat = self._create_chat(f"{session_id}_{innovator['name'].lower().replace(' ', '_')}", innovator["persona_prompt"])
            
            user_message = UserMessage(
                text=f"{context}\n\nProvide strategic advice for this challenge from your unique perspective and experience."
            )
            
            response = await chat.send_message(user_message)
            return response
            
        except Exception as e:
            logger.error(f"Error generating advice for {innovator['name']}: {e}")
            raise e