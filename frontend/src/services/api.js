import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// API service for Innovation Board
class InnovationBoardAPI {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API,
      timeout: 60000, // 60 seconds for AI processing
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
        return response;
      },
      (error) => {
        console.error('❌ API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Create a new advisory session with AI-generated probing questions
   * @param {string} userQuestion - The user's initial question/challenge
   * @returns {Promise<{session_id: string, probing_questions: string[], probing_options: string[][], created_at: string}>}
   */
  async createSession(userQuestion) {
    try {
      const response = await this.axiosInstance.post('/sessions', {
        user_question: userQuestion
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to create advisory session');
    }
  }

  /**
   * Submit answers to probing questions and trigger AI advice generation
   * @param {string} sessionId - The session ID
   * @param {Object} answers - Map of question index to selected answer
   * @returns {Promise<{session_id: string, processing: boolean, estimated_completion: string}>}
   */
  async submitProbingAnswers(sessionId, answers) {
    try {
      const response = await this.axiosInstance.post(`/sessions/${sessionId}/probing-answers`, {
        answers
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to submit probing answers');
    }
  }

  /**
   * Get AI-generated advice from innovators (polls until ready)
   * @param {string} sessionId - The session ID
   * @returns {Promise<{session_id: string, user_question: string, probing_answers: Object, advice: Array, status: string}>}
   */
  async getAdvice(sessionId) {
    try {
      const response = await this.axiosInstance.get(`/sessions/${sessionId}/advice`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 202) {
        // Still processing, return status info
        return {
          status: 'processing',
          message: 'Advice is still being generated'
        };
      }
      throw this.handleError(error, 'Failed to get advice');
    }
  }

  /**
   * Poll for advice with automatic retries
   * @param {string} sessionId - The session ID
   * @param {number} maxAttempts - Maximum polling attempts
   * @param {number} interval - Polling interval in milliseconds
   * @returns {Promise<Object>} - Advice response
   */
  async pollForAdvice(sessionId, maxAttempts = 30, interval = 2000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`🔄 Polling for advice (attempt ${attempt}/${maxAttempts})`);
        const result = await this.getAdvice(sessionId);
        
        if (result.status === 'completed') {
          console.log('✅ Advice generation completed!');
          return result;
        } else if (result.status === 'processing') {
          console.log('⏳ Still processing, waiting...');
          await new Promise(resolve => setTimeout(resolve, interval));
          continue;
        } else {
          throw new Error(`Unexpected status: ${result.status}`);
        }
      } catch (error) {
        if (attempt === maxAttempts) {
          throw new Error('Advice generation timed out. Please try again.');
        }
        console.log(`⚠️ Polling attempt ${attempt} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }
    
    throw new Error('Maximum polling attempts reached. Please try again.');
  }

  /**
   * Test backend connectivity
   * @returns {Promise<Object>} - Status response
   */
  async testConnection() {
    try {
      const response = await this.axiosInstance.get('/');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to connect to backend');
    }
  }

  /**
   * Handle API errors with user-friendly messages
   * @param {Error} error - The error object
   * @param {string} defaultMessage - Default error message
   * @returns {Error} - Formatted error
   */
  handleError(error, defaultMessage) {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 404) {
        return new Error('Session not found. Please start a new session.');
      } else if (status === 400) {
        return new Error(data.detail || 'Invalid request. Please check your input.');
      } else if (status === 500) {
        return new Error('Server error. Please try again later.');
      } else if (status === 202) {
        return new Error('Request is still processing.');
      } else {
        return new Error(data.detail || defaultMessage);
      }
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your connection.');
    } else {
      // Other error
      return new Error(error.message || defaultMessage);
    }
  }
}

// Create singleton instance
const api = new InnovationBoardAPI();

export default api;