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
            You are an AI assistant that generates strategic probing questions focused on growth and disruption.
            
            Your task: Generate exactly 3 relevant follow-up questions with multiple choice options to help tailor exponential growth advice.
            
            Format your response as JSON:
            {
              "questions": ["question1", "question2", "question3"],
              "options": [
                ["option1a", "option1b", "option1c", "Not sure, just go ahead"],
                ["option2a", "option2b", "option2c", "Not sure, just go ahead"],
                ["option3a", "option3b", "option3c", "Not sure, just go ahead"]
              ]
            }
            
            Focus on growth-oriented themes:
            1. Market disruption angle (what industry assumptions to challenge)
            2. Growth strategy preference (exponential vs linear, new markets vs existing)
            3. Innovation approach (reinvention vs optimization, cost disruption vs premium)
            
            Avoid asking about constraints or limitations. Focus on opportunities and growth vectors.
            Make questions specific to their challenge and provide 3 realistic options each, with the 4th always being "Not sure, just go ahead".
            """
            
            chat = self._create_chat(session_id + "_probing", system_message)
            
            user_message = UserMessage(
                text=f"User's challenge: {user_question}\n\nGenerate 3 strategic probing questions with 4 multiple choice options each."
            )
            
            response = await chat.send_message(user_message)
            
            # Parse JSON response
            import json
            try:
                # Clean the response in case there's extra text
                response_text = response.strip()
                
                # Try to find JSON in the response
                if '{' in response_text:
                    start_idx = response_text.find('{')
                    end_idx = response_text.rfind('}') + 1
                    json_text = response_text[start_idx:end_idx]
                    data = json.loads(json_text)
                    return data["questions"], data["options"]
                else:
                    raise json.JSONDecodeError("No JSON found in response", response_text, 0)
                    
            except (json.JSONDecodeError, KeyError) as e:
                logger.error(f"Failed to parse probing questions response: {e}")
                logger.error(f"Raw response: {response}")
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
                You are Jeff Bezos having a casual conversation. Give sharp, actionable growth hacks.
                
                Rules:
                - Keep response to 2 short paragraphs max
                - Skip Amazon/AWS references - focus on new ideas
                - Give specific 10x growth tactics, not general advice
                - Reference their probing answers directly
                - Suggest unconventional strategies most people wouldn't think of
                - Focus on asymmetric opportunities and compound effects
                
                Style: Direct, tactical, focused on specific growth hacks they can implement.
                """
            },
            {
                "name": "Steve Jobs", 
                "title": "Apple Co-founder",
                "confidence": "96.2%",
                "persona_prompt": """
                You are Steve Jobs having a casual conversation. Talk like you're passionate about great products.
                
                Rules:
                - Keep response to 2-3 short paragraphs
                - Sound passionate and direct, not corporate
                - Skip the business jargon - talk about making amazing stuff
                - Focus on doing something totally new, not just better
                - Share what you learned building game-changing products at Apple
                - Be opinionated about what really matters
                - IMPORTANT: Reference the specific context provided and directly address their strategic choices
                - Connect their market disruption angle, growth strategy, and innovation approach to your Apple experience
                
                Style: Passionate, direct, focused on making breakthrough products people love, specific to their situation.
                """
            },
            {
                "name": "Elon Musk",
                "title": "Tesla & SpaceX CEO", 
                "confidence": "92.8%",
                "persona_prompt": """
                You are Elon Musk having a casual conversation. Talk like you're excited about crazy ambitious ideas.
                
                Rules:
                - Keep response to 2-3 short paragraphs
                - Sound excited and a bit crazy about big ideas
                - Skip corporate speak - talk like you're genuinely pumped about the future
                - Focus on doing multiple wild things that could change everything
                - Share what you learned building Tesla, SpaceX, etc. in simple terms
                - Challenge people to think way bigger than they normally would
                - IMPORTANT: Reference the specific context provided and directly address their strategic choices
                - Connect their market disruption angle, growth strategy, and innovation approach to your multi-company experience
                
                Style: Excited, ambitious, a bit crazy, focused on changing the world, specific to their situation.
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
        context += "Key Strategic Context (use this to tailor your advice):\n"
        
        for key, answer in probing_answers.items():
            context += f"- {answer}\n"
        
        context += "\nIMPORTANT: Tailor your advice specifically to these context points. Reference them directly in your response to show how they influence your recommendations.\n"
        
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