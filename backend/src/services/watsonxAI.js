import axios from 'axios';
import config from '../config/config.js';

/**
 * Watsonx.ai Service
 * Handles communication with IBM Watsonx.ai API for Claude models
 */
class WatsonxAIService {
  constructor() {
    this.apiKey = config.watsonx.apiKey;
    this.endpoint = config.watsonx.endpoint;
    this.projectId = config.watsonx.projectId;
    this.modelId = config.watsonx.modelId;
    
    // Construct the full API URL for text generation
    this.apiUrl = `${this.endpoint}/ml/v1/text/generation?version=2023-05-29`;
  }

  /**
   * Generate completion using Watsonx.ai Claude model
   * @param {Array} messages - Array of message objects with role and content
   * @param {Object} options - Additional options (temperature, max_tokens, etc.)
   * @returns {Promise<string>} - Generated text
   */
  async generateCompletion(messages, options = {}) {
    try {
      // Convert messages to Claude prompt format
      const prompt = this.formatMessagesForClaude(messages);
      
      const response = await axios.post(
        this.apiUrl,
        {
          model_id: this.modelId,
          input: prompt,
          parameters: {
            max_new_tokens: options.maxTokens || 4000,
            temperature: options.temperature || 0.7,
            top_p: options.topP || 0.95,
            top_k: options.topK || 50,
            repetition_penalty: options.repetitionPenalty || 1.0,
          },
          project_id: this.projectId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/json',
          },
          timeout: 120000, // 120 second timeout for Claude
        }
      );

      if (response.data && response.data.results && response.data.results.length > 0) {
        return response.data.results[0].generated_text.trim();
      } else {
        throw new Error('No completion generated');
      }
    } catch (error) {
      console.error('Watsonx.ai API Error:', error.response?.data || error.message);
      
      if (error.response) {
        // Watsonx.ai returned an error
        const errorMessage = error.response.data?.error || error.response.data?.message || 'Watsonx.ai API error';
        throw new Error(`Watsonx.ai Error: ${errorMessage}`);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('No response from Watsonx.ai. Please check your network connection and endpoint configuration.');
      } else {
        // Something else happened
        throw new Error(`Error: ${error.message}`);
      }
    }
  }

  /**
   * Format messages array into Claude prompt format
   * @param {Array} messages - Array of message objects
   * @returns {string} - Formatted prompt
   */
  formatMessagesForClaude(messages) {
    let prompt = '';
    
    for (const message of messages) {
      if (message.role === 'system') {
        prompt += `${message.content}\n\n`;
      } else if (message.role === 'user') {
        prompt += `Human: ${message.content}\n\n`;
      } else if (message.role === 'assistant') {
        prompt += `Assistant: ${message.content}\n\n`;
      }
    }
    
    // Add final Assistant prompt to trigger response
    if (!prompt.endsWith('Assistant: ')) {
      prompt += 'Assistant: ';
    }
    
    return prompt;
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
   * Test the Watsonx.ai connection
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
export default new WatsonxAIService();

// Made with Bob