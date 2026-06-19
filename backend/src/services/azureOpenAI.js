import axios from 'axios';
import config from '../config/config.js';

/**
 * Azure OpenAI Service
 * Handles communication with Azure OpenAI API
 */
class AzureOpenAIService {
  constructor() {
    this.apiKey = config.azureOpenAI.apiKey;
    this.endpoint = config.azureOpenAI.endpoint;
    this.deploymentName = config.azureOpenAI.deploymentName;
    this.apiVersion = config.azureOpenAI.apiVersion;
    
    // Construct the full API URL
    this.apiUrl = `${this.endpoint}openai/deployments/${this.deploymentName}/chat/completions?api-version=${this.apiVersion}`;
  }

  /**
   * Generate completion using Azure OpenAI
   * @param {Array} messages - Array of message objects with role and content
   * @param {Object} options - Additional options (temperature, max_tokens, etc.)
   * @returns {Promise<string>} - Generated text
   */
  async generateCompletion(messages, options = {}) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 4000,
          top_p: options.topP || 0.95,
          frequency_penalty: options.frequencyPenalty || 0,
          presence_penalty: options.presencePenalty || 0,
          ...options
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.apiKey,
          },
          timeout: 60000, // 60 second timeout
        }
      );

      if (response.data && response.data.choices && response.data.choices.length > 0) {
        return response.data.choices[0].message.content;
      } else {
        throw new Error('No completion generated');
      }
    } catch (error) {
      console.error('Azure OpenAI API Error:', error.response?.data || error.message);
      
      if (error.response) {
        // Azure OpenAI returned an error
        const errorMessage = error.response.data?.error?.message || 'Azure OpenAI API error';
        throw new Error(`Azure OpenAI Error: ${errorMessage}`);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('No response from Azure OpenAI. Please check your network connection and endpoint configuration.');
      } else {
        // Something else happened
        throw new Error(`Error: ${error.message}`);
      }
    }
  }

  /**
   * Generate cadences using structured prompt
   * @param {string} systemPrompt - System role prompt
   * @param {string} userPrompt - User prompt with prospect/company info
   * @returns {Promise<string>} - Generated cadences in JSON format
   */
  async generateCadences(systemPrompt, userPrompt) {
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userPrompt
      }
    ];

    return await this.generateCompletion(messages, {
      temperature: 0.7,
      maxTokens: 4000,
    });
  }

  /**
   * Test the Azure OpenAI connection
   * @returns {Promise<boolean>} - True if connection successful
   */
  async testConnection() {
    try {
      const messages = [
        {
          role: 'user',
          content: 'Hello, this is a test message. Please respond with "Connection successful".'
        }
      ];

      const response = await this.generateCompletion(messages, {
        maxTokens: 50,
        temperature: 0
      });

      return response.toLowerCase().includes('connection successful');
    } catch (error) {
      console.error('Connection test failed:', error.message);
      return false;
    }
  }
}

// Export singleton instance
export default new AzureOpenAIService();

// Made with Bob
