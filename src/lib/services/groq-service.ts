import axios from 'axios';

interface GroqAnalysisRequest {
  content: string;
  model?: string;
}

interface GroqAnalysisResponse {
  id: string;
  choices: {
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
    index: number;
  }[];
  model: string;
  created: number;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Service to interact with the Groq API via our backend
 */
export const GroqService = {
  /**
   * Analyze content using Groq AI
   * @param content The text content to analyze
   * @param model Optional model to use
   * @returns Promise with the analysis results
   */
  analyzeContent: async (content: string, model?: string): Promise<GroqAnalysisResponse> => {
    try {
      const response = await axios.post<GroqAnalysisResponse>('/api/groq', {
        content,
        model
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing content with Groq:', error);
      throw error;
    }
  },

  /**
   * Test the Groq API connection
   * @returns Promise with status message
   */
  testConnection: async (): Promise<{ status: string }> => {
    try {
      const response = await axios.get<{ status: string }>('/api/groq');
      return response.data;
    } catch (error) {
      console.error('Error testing Groq connection:', error);
      throw error;
    }
  }
};

export default GroqService; 