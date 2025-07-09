import { apiClient } from '../Recruitment/ApiService';

// API function to fetch tenant modules
export const fetchModules = async () => {
  try {
    const response = await apiClient.get('/api/tenant/modules/');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch modules.';
    console.error('fetchModules error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: errorMessage,
    });
    throw new Error(errorMessage);
  }
};

// API function to fetch tenant data
export const fetchTenant = async () => {
  try {
    const response = await apiClient.get('/api/tenant/tenants/');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch tenant data.';
    console.error('fetchTenant error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: errorMessage,
    });
    throw new Error(errorMessage);
  }
};

// API function to create a user
export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/api/user/create/', userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    const errorDetails = error.response?.data?.message || error.response?.data || {};
    const errorMessage = typeof errorDetails === 'object'
      ? Object.entries(errorDetails)
          .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
          .join('; ')
      : errorDetails || error.message || 'Failed to create user.';
    console.error('createUser error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: errorMessage,
    });
    throw new Error(errorMessage);
  }
};