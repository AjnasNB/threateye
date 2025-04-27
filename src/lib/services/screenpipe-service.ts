import axios from 'axios';

interface ScreenshotData {
  imageData: string; // Base64 encoded image
  timestamp: string;
  sourceDevice: string;
}

interface AudioData {
  transcript: string;
  timestamp: string;
  sourceDevice: string;
}

interface ScreenPipeResponse {
  id: number;
  timestamp: string;
  detections: Array<{
    type: 'image' | 'audio' | 'text';
    level: 'high' | 'medium' | 'low';
    content: string;
    confidence: number;
  }>;
}

/**
 * Service to interact with the ScreenPipe API via our backend
 */
export const ScreenPipeService = {
  /**
   * Submit screenshot data for analysis
   * @param data The screenshot data to analyze
   * @returns Promise with the analysis results
   */
  analyzeScreenshot: async (data: ScreenshotData): Promise<ScreenPipeResponse> => {
    try {
      const response = await axios.post<ScreenPipeResponse>('/api/screenpipe', {
        screenshot: data.imageData,
        timestamp: data.timestamp,
        sourceDevice: data.sourceDevice
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing screenshot with ScreenPipe:', error);
      throw error;
    }
  },

  /**
   * Submit audio transcript data for analysis
   * @param data The audio transcript data to analyze
   * @returns Promise with the analysis results
   */
  analyzeAudio: async (data: AudioData): Promise<ScreenPipeResponse> => {
    try {
      const response = await axios.post<ScreenPipeResponse>('/api/screenpipe', {
        audioTranscript: data.transcript,
        timestamp: data.timestamp,
        sourceDevice: data.sourceDevice
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing audio with ScreenPipe:', error);
      throw error;
    }
  },

  /**
   * Test the ScreenPipe API connection
   * @returns Promise with status message
   */
  testConnection: async (): Promise<{ status: string }> => {
    try {
      const response = await axios.get<{ status: string }>('/api/screenpipe');
      return response.data;
    } catch (error) {
      console.error('Error testing ScreenPipe connection:', error);
      throw error;
    }
  }
};

export default ScreenPipeService; 