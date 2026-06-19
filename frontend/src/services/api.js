import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens (Phase 3)
api.interceptors.request.use(
  (config) => {
    // Future: Add auth token here
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Generate personalized cadences for a prospect
 * @param {Object} data - { prospectName, companyName, cadenceTypes }
 * @returns {Promise} - Generated cadences
 */
export const generateCadences = async (data) => {
  try {
    const response = await api.post('/cadence/generate', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all training examples
 * @returns {Promise} - Training examples
 */
export const getTrainingExamples = async () => {
  try {
    const response = await api.get('/training/examples');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Add a new training example
 * @param {Object} example - Training example data
 * @returns {Promise} - Created example
 */
export const addTrainingExample = async (example) => {
  try {
    const response = await api.post('/training/examples', example);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update a training example
 * @param {string} id - Example ID
 * @param {Object} example - Updated example data
 * @returns {Promise} - Updated example
 */
export const updateTrainingExample = async (id, example) => {
  try {
    const response = await api.put(`/training/examples/${id}`, example);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a training example
 * @param {string} id - Example ID
 * @returns {Promise}
 */
export const deleteTrainingExample = async (id) => {
  try {
    const response = await api.delete(`/training/examples/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;

// Made with Bob
