import axios from 'axios';
import config from '../../../config';

const API_BASE_URL = `${config.API_BASE_URL}`;

// Create an axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to refresh token
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
      refresh: refreshToken,
    });

    const newAccessToken = response.data.access;
    localStorage.setItem('accessToken', newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw new Error('Session expired. Please log in again.');
  }
};

// Add a request interceptor to include the token and handle token refresh
apiClient.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// API function to create a requisition
export const createRequisition = async (requisitionData) => {
  try {
    const response = await apiClient.post('/api/talent-engine/requisitions/', requisitionData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to create job requisition. Please try again.';
  }
};

// API function to fetch a requisition
export const fetchRequisition = async (id) => {
  try {
    const response = await apiClient.get(`/api/talent-engine/requisitions/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to fetch requisition data.';
  }
};

// API function to fetch all requisitions
export const fetchAllRequisitions = async (params = {}) => {
  try {
    const response = await apiClient.get('/api/talent-engine/requisitions/', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to load job requisitions. Please try again.';
  }
};

// API function to update a requisition
export const updateRequisition = async (id, requisitionData) => {
  try {
    const response = await apiClient.patch(`/api/talent-engine/requisitions/${id}/`, requisitionData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to update requisition. Please try again.';
  }
};

// API function to delete a requisition
export const deleteRequisition = async (id) => {
  try {
    await apiClient.delete(`/api/talent-engine/requisitions/${id}/`);
    return true;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to delete requisition. Please try again.';
  }
};

// API function to bulk delete requisitions
export const bulkDeleteRequisitions = async (ids) => {
  try {
    const response = await apiClient.post('/api/talent-engine/requisitions/bulk-delete/', { ids });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to delete requisitions. Please try again.';
  }
};

// API function to update requisition status
export const updateRequisitionStatus = async (id, status) => {
  try {
    const response = await apiClient.patch(`/api/talent-engine/requisitions/${id}/`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || `Failed to ${status} requisition.`;
  }
};

// API function to toggle publish status
export const togglePublishRequisition = async (id, publishStatus) => {
  try {
    const response = await apiClient.patch(`/api/talent-engine/requisitions/${id}/`, { publish_status: publishStatus });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to toggle publish status.';
  }
};

// API function to fetch all job applications
export const fetchAllJobApplications = async () => {
  try {
    const response = await apiClient.get('/api/talent-engine-job-applications/applications/');
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to load job applications. Please try again.';
  }
};

// API function to bulk delete job applications
export const bulkDeleteJobApplications = async (ids) => {
  try {
    const response = await apiClient.post('/api/talent-engine-job-applications/applications/bulk-delete/', { ids });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to delete job applications. Please try again.';
  }
};