import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const generateCadences = async (data) => {
  try {
    const response = await api.post('/cadence/generate', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTrainingExamples = async () => {
  try {
    const response = await api.get('/training/examples');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addTrainingExample = async (example) => {
  try {
    const response = await api.post('/training/examples', example);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTrainingExample = async (id, example) => {
  try {
    const response = await api.put(`/training/examples/${id}`, example);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTrainingExample = async (id) => {
  try {
    const response = await api.delete(`/training/examples/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveGeneratedEmail = async (emailData) => {
  try {
    const response = await api.post('/training/generated-emails', emailData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGeneratedEmails = async () => {
  try {
    const response = await api.get('/feedback/emails');
    return response.data;
  } catch (error) {
    throw error;
  }
};

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

export const deleteGeneratedEmail = async (emailId) => {
  try {
    const response = await api.delete(`/feedback/emails/${emailId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCadences = async () => {
  try {
    const response = await api.get('/cadences');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCadence = async (cadenceData) => {
  try {
    const response = await api.post('/cadences', cadenceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCadence = async (id, updates) => {
  try {
    const response = await api.put(`/cadences/${id}`, updates);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveCadenceEmail = async (cadenceId, emailData) => {
  try {
    const response = await api.post(`/cadences/${cadenceId}/emails`, emailData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;