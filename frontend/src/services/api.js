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

/**
 * Save a generated email
 * @param {Object} emailData - Email data to save
 * @returns {Promise} - Saved email
 */
export const saveGeneratedEmail = async (emailData) => {
  try {
    const response = await api.post('/training/generated-emails', emailData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all generated emails
 * @returns {Promise} - Generated emails
 */
export const getGeneratedEmails = async () => {
  try {
    const response = await api.get('/feedback/emails');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Submit email rating
 * @param {string} emailId - Email ID
 * @param {string} criterion - Rating criterion
 * @param {number} score - Rating score (1-5)
 * @returns {Promise} - Updated email
 */
export const submitEmailRating = async (emailId, criterion, score) => {
  try {
    const response = await api.put(`/feedback/emails/${emailId}/rating`, {
      criterion,
      score
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Add email comment
 * @param {string} emailId - Email ID
 * @param {string} comment - Comment text
 * @returns {Promise} - Created comment
 */
export const addEmailComment = async (emailId, comment) => {
  try {
    const response = await api.post(`/feedback/emails/${emailId}/comment`, {
      comment
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete generated email
 * @param {string} emailId - Email ID
 * @returns {Promise}
 */
export const deleteGeneratedEmail = async (emailId) => {
  try {
    const response = await api.delete(`/feedback/emails/${emailId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all cadences persisted in Postgres
 * @returns {Promise} - { cadences }
 */
export const getCadences = async () => {
  try {
    const response = await api.get('/cadences');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new cadence (with its generated steps) in Postgres
 * @param {Object} cadenceData
 * @returns {Promise} - Created cadence
 */
export const createCadence = async (cadenceData) => {
  try {
    const response = await api.post('/cadences', cadenceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update a cadence (e.g. steps, status, archived)
 * @param {string} id - Cadence ID
 * @param {Object} updates
 * @returns {Promise} - Updated cadence
 */
export const updateCadence = async (id, updates) => {
  try {
    const response = await api.put(`/cadences/${id}`, updates);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Save a generated email for a cadence step into Postgres
 * @param {string} cadenceId
 * @param {Object} emailData
 * @returns {Promise} - Saved email row
 */
export const saveCadenceEmail = async (cadenceId, emailData) => {
  try {
    const response = await api.post(`/cadences/${cadenceId}/emails`, emailData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all generated emails persisted in Postgres (across all cadences)
 * @returns {Promise} - { emails }
 */
export const getCadenceEmails = async () => {
  try {
    const response = await api.get('/cadences/emails');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Submit a rating criterion for a Postgres-backed generated email
 * @param {number} emailId
 * @param {string} criterion
 * @param {number} score
 * @returns {Promise} - Updated rating row
 */
export const submitCadenceEmailRating = async (emailId, criterion, score) => {
  try {
    const response = await api.put(`/cadences/emails/${emailId}/rating`, { criterion, score });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Add a comment for a Postgres-backed generated email
 * @param {number} emailId
 * @param {string} comment
 * @returns {Promise} - Created comment row
 */
export const addCadenceEmailComment = async (emailId, comment) => {
  try {
    const response = await api.post(`/cadences/emails/${emailId}/comment`, { comment });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;

// Made with Bob