# Innovation Board - Backend Integration Contracts

## API Contracts

### 1. POST /api/sessions
**Purpose**: Create a new advisory session
**Request Body**:
```json
{
  "user_question": "string (required, 1-500 chars)"
}
```
**Response**:
```json
{
  "session_id": "string (uuid)",
  "probing_questions": ["string", "string", "string"],
  "probing_options": [["option1", "option2"], ["option1", "option2"], ["option1", "option2"]],
  "created_at": "datetime"
}
```

### 2. POST /api/sessions/{session_id}/probing-answers
**Purpose**: Submit answers to probing questions
**Request Body**:
```json
{
  "answers": {
    "0": "Early stage - validating concept",
    "1": "Increase revenue and profitability", 
    "2": "Limited budget, need creative solutions"
  }
}
```
**Response**:
```json
{
  "session_id": "string",
  "processing": true,
  "estimated_completion": "datetime"
}
```

### 3. GET /api/sessions/{session_id}/advice
**Purpose**: Get AI-generated advice from innovators
**Response**:
```json
{
  "session_id": "string",
  "user_question": "string",
  "probing_answers": {},
  "advice": [
    {
      "innovator": "Jeff Bezos",
      "title": "Amazon Founder", 
      "confidence": "94.7%",
      "advice_text": "string (AI-generated)",
      "generated_at": "datetime"
    },
    {
      "innovator": "Steve Jobs",
      "title": "Apple Co-founder",
      "confidence": "96.2%", 
      "advice_text": "string (AI-generated)",
      "generated_at": "datetime"
    },
    {
      "innovator": "Elon Musk",
      "title": "Tesla & SpaceX CEO",
      "confidence": "92.8%",
      "advice_text": "string (AI-generated)", 
      "generated_at": "datetime"
    }
  ],
  "status": "completed"
}
```

## Mock Data Mapping

### Current Mock Data in `/app/frontend/src/utils/mock.js`:
- **probingQuestions**: Static 3 questions about business stage, goals, constraints
- **probingOptions**: Pre-defined multiple choice answers
- **advice**: Static responses from each innovator

### Backend Replacement Strategy:
- **probingQuestions**: Generate contextual questions based on user's initial query using AI
- **probingOptions**: AI-generated options relevant to the specific question
- **advice**: Dynamic AI responses using persona prompts for each innovator

## Backend Implementation Plan

### 1. Database Models (MongoDB)
```python
# Advisory Session Model
class AdvisorySession:
    session_id: str (ObjectId)
    user_question: str
    probing_questions: List[str]
    probing_options: List[List[str]]
    probing_answers: Dict[str, str]
    advice: List[InnovatorAdvice]
    status: str (pending/processing/completed)
    created_at: datetime
    completed_at: datetime

class InnovatorAdvice:
    innovator: str
    title: str
    confidence: str
    advice_text: str
    generated_at: datetime
```

### 2. AI Integration (Emergent LLM Key)
```python
# Install emergentintegrations library
# Use OpenAI GPT-4o for best persona emulation
# Three AI calls per session:
# 1. Generate probing questions based on user query
# 2. Generate advice from Jeff Bezos persona
# 3. Generate advice from Steve Jobs persona  
# 4. Generate advice from Elon Musk persona
```

### 3. Core Endpoints
- **Session Creation**: Parse user question, generate contextual probing questions
- **Probing Submission**: Store answers, trigger AI advice generation
- **Advice Retrieval**: Return completed AI-generated responses

### 4. AI Prompt Engineering
- **Probing Questions Prompt**: Generate 3 relevant follow-up questions
- **Persona Prompts**: Detailed character profiles for each innovator
- **Context Integration**: Combine user question + probing answers for personalized advice

## Frontend-Backend Integration

### 1. Replace Mock Data Usage
**Current**: `import { mockData } from '../utils/mock'`
**New**: API calls to backend endpoints

### 2. State Management Updates
```javascript
// BoardPage.jsx changes:
- Remove mockData import
- Add API service calls
- Handle loading states for async operations
- Add error handling for failed requests
- Store session_id for subsequent calls
```

### 3. Component Updates
```javascript
// New service layer: /app/frontend/src/services/api.js
- createSession(userQuestion)
- submitProbingAnswers(sessionId, answers)  
- getAdvice(sessionId)
```

### 4. Flow Integration
1. **Question Step**: Call createSession() → get probing questions
2. **Probing Step**: Use API-generated questions/options → submitProbingAnswers()
3. **Loading Step**: Poll getAdvice() until status = "completed"
4. **Advice Step**: Display AI-generated responses

## Error Handling Strategy
- **Network errors**: Retry with exponential backoff
- **AI generation failures**: Fallback to simplified responses
- **Session timeouts**: Clear state and restart flow
- **Validation errors**: Show user-friendly messages

## Performance Considerations
- **Async AI generation**: Process advice in background
- **Caching**: Store completed sessions for 24 hours
- **Rate limiting**: Prevent API abuse
- **Chunked responses**: Stream advice as it's generated (future enhancement)