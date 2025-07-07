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

// Function to refresh access token
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
    localStorage.removeItem('tenantId');
    localStorage.removeItem('tenantSchema');
    localStorage.removeItem('user');
    window.location.href = '/';
    throw new Error('Session expired. Please log in again.');
  }
};

// Request interceptor to include access token
apiClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
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

export const createRequisition = async (requisitionData) => {
  try {
    const response = await apiClient.post('/api/talent-engine/requisitions/', requisitionData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to create job requisition.');
  }
};

export const fetchRequisition = async (id) => {
  try {
    const response = await apiClient.get(`/api/talent-engine/requisitions/${id}/`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch requisition data.');
  }
};


export const bulkDeleteRequisitions = async (ids) => {
  try {
    console.log('Sending bulk soft delete request for requisitions:', { ids, url: '/api/talent-engine/requisitions/bulk-delete/' });
    if (!ids.every(id => typeof id === 'string' && id.match(/^PRO-\d{4}$/))) {
      throw new Error('Invalid IDs provided. All IDs must be in the format PRO-XXXX.');
    }
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    };
    console.log('Request config:', config);
    const response = await apiClient.post('/api/talent-engine/requisitions/bulk-delete/', { ids }, config);
    console.log('Bulk soft delete response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Bulk soft delete error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.detail || error.message || 'Failed to soft delete requisitions.');
  }
};

export const fetchAllRequisitions = async (params = {}) => {
  try {
    const response = await apiClient.get('/api/talent-engine/requisitions/', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to load job requisitions.');
  }
};


export const updateRequisition = async (id, requisitionData) => {
  try {
    const response = await apiClient.patch(`/api/talent-engine/requisitions/${id}/`, requisitionData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to update requisition.');
  }
};

export const deleteRequisition = async (id) => {
  try {
    await apiClient.delete(`/api/talent-engine/requisitions/${id}/`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to soft delete requisition.');
  }
};


export const fetchSoftDeletedRequisitions = async () => {
  try {
    const response = await apiClient.get('/api/talent-engine/requisitions/deleted/soft_deleted/');
    //console.log('Soft-deleted job Requisitions:', response.data);
    return response.data.data || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to load soft-deleted requisitions.');
  }
};

export const recoverRequisitions = async (ids) => {
  try {
    const response = await apiClient.post('/api/talent-engine/requisitions/recover/requisition/', { ids });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to recover requisitions.');
  }
};

export const permanentDeleteRequisitions = async (ids) => {
  try {
    const response = await apiClient.post('/api/talent-engine/requisitions/permanent-delete/requisition/', { ids });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to permanently delete requisitions.');
  }
};

export const updateRequisitionStatus = async (id, status) => {
  try {
    const response = await apiClient.patch(`/api/talent-engine/requisitions/${id}/`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || `Failed to update requisition status to ${status}.`);
  }
};

export const togglePublishRequisition = async (id, publishStatus) => {
  try {
    const response = await apiClient.patch(`/api/talent-engine/requisitions/${id}/`, { publish_status: publishStatus });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to toggle publish status.');
  }
};


// API function to fetch all job applications
export const fetchAllJobApplications = async () => {
  try {
    const response = await apiClient.get('/api/talent-engine-job-applications/applications/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to load job applications.');
  }
};

// API function to fetch job applications by requisition
export const fetchJobApplicationsByRequisition = async (jobId) => {
  try {
    const response = await apiClient.get(`/api/talent-engine-job-applications/applications/job-requisitions/${jobId}/applications/`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to load job applications for requisition.');
  }
};

// API function to fetch soft-deleted job applications
export const fetchSoftDeletedJobApplications = async () => {
  try {
    const response = await apiClient.get('/api/talent-engine-job-applications/applications/deleted/soft_deleted/');
   // console.log('Soft-deleted job applications:', response.data);
    return response.data.data || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to load soft-deleted job applications.');
  }
};

// API function to recover soft-deleted job applications
export const recoverJobApplications = async (ids) => {
  try {
    const response = await apiClient.post('/api/talent-engine-job-applications/applications/recover/application/', { ids });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to recover job applications.');
  }
};

// API function to permanently delete job applications
export const permanentDeleteJobApplications = async (ids) => {
  try {
    const response = await apiClient.post('/api/talent-engine-job-applications/applications/permanent-delete/application/', { ids });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to permanently delete job applications.');
  }
};

// API function to update job application status
export const updateJobApplicationStatus = async (id, status) => {
  try {
    const response = await apiClient.put(`/api/talent-engine-job-applications/applications/${id}/`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to update job application status.');
  }
};

// API function to bulk delete job applications
export const bulkDeleteJobApplications = async (ids) => {
  try {
    const response = await apiClient.post('/api/talent-engine-job-applications/applications/bulk-delete/applications/', { ids });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to delete job applications.');
  }
};

// API function to screen resumes for a job requisition
export const screenResumes = async (jobRequisitionId, data) => {
  try {
    const response = await apiClient.post(
      `/api/talent-engine-job-applications/requisitions/${jobRequisitionId}/screen-resumes/`,
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to screen resumes.');
  }
};

// API function to fetch published requisitions with shortlisted applications
export const fetchPublishedRequisitionsWithShortlisted = async () => {
  try {
    const response = await apiClient.get('/api/talent-engine-job-applications/published-requisitions-with-shortlisted/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to load published requisitions with shortlisted applications.');
  }
};

// export const createSchedule = async (scheduleData) => {
//   try {
//     const response = await apiClient.post('/api/talent-engine-job-applications/schedules/', scheduleData);
//     return response.data;
//   } catch (error) {
//     const errorDetails = error.response?.data || {};
//     if (errorDetails.meeting_link) {
//       throw new Error(errorDetails.meeting_link[0] || 'Invalid meeting link provided.');
//     } else if (errorDetails.non_field_errors) {
//       throw new Error(errorDetails.non_field_errors[0] || 'Invalid schedule data.');
//     } else if (errorDetails.detail) {
//       throw new Error(errorDetails.detail);
//     }
//     throw new Error('Failed to create schedule.');
//   }
// };

export const createSchedule = async (scheduleData) => {
  try {
    const response = await apiClient.post('/api/talent-engine-job-applications/schedules/', scheduleData);
    return response.data;
  } catch (error) {
    const errorDetails = error.response?.data || {};
    if (errorDetails.detail && errorDetails.detail.includes('EMAIL_USE_TLS/EMAIL_USE_SSL')) {
      throw new Error('Email configuration error: EMAIL_USE_TLS and EMAIL_USE_SSL cannot both be enabled. Contact your administrator.');
    } else if (errorDetails.meeting_link) {
      throw new Error(errorDetails.meeting_link[0] || 'Invalid meeting link provided.');
    } else if (errorDetails.non_field_errors) {
      throw new Error(errorDetails.non_field_errors[0] || 'Invalid schedule data.');
    } else if (errorDetails.detail) {
      throw new Error(errorDetails.detail);
    }
    throw new Error('Failed to create schedule. Please try again.');
  }
};

export const fetchSchedules = async (params = {}) => {
  try {
    const response = await apiClient.get('/api/talent-engine-job-applications/schedules/', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to load schedules.');
  }
};

export const updateSchedule = async (id, scheduleData) => {
  try {
    const response = await apiClient.patch(`/api/talent-engine-job-applications/schedules/${id}/`, scheduleData);
    return response.data;
  } catch (error) {
    const errorDetails = error.response?.data || {};
    if (errorDetails.meeting_link) {
      throw new Error(errorDetails.meeting_link[0] || 'Invalid meeting link provided.');
    } else if (errorDetails.detail) {
      throw new Error(errorDetails.detail);
    }
    throw new Error('Failed to update schedule.');
  }
};

export const completeSchedule = async (id) => {
  try {
    const response = await apiClient.patch(`/api/talent-engine-job-applications/schedules/${id}/`, {
      status: 'completed',
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to complete schedule.');
  }
};

export const cancelSchedule = async (id, cancellationReason) => {
  try {
    const response = await apiClient.patch(`/api/talent-engine-job-applications/schedules/${id}/`, {
      status: 'cancelled',
      cancellation_reason: cancellationReason,
    });
    return response.data;
  } catch (error) {
    const errorDetails = error.response?.data || {};
    if (errorDetails.cancellation_reason) {
      throw new Error(errorDetails.cancellation_reason[0] || 'Cancellation reason is required.');
    } else if (errorDetails.detail) {
      throw new Error(errorDetails.detail);
    }
    throw new Error('Failed to cancel schedule.');
  }
};

export const deleteSchedule = async (id) => {
  try {
    await apiClient.delete(`/api/talent-engine-job-applications/schedules/${id}/`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to delete schedule.');
  }
};

export const bulkDeleteSchedules = async (ids) => {
  try {
    console.log('Sending bulk delete request:', { ids });
    const response = await apiClient.post('/api/talent-engine-job-applications/schedules/bulk-delete/', { ids });
    console.log('Bulk delete response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Bulk delete error:', error.response?.data);
    throw new Error(error.response?.data?.detail || 'Failed to delete schedules.');
  }
};

export const fetchSoftDeletedSchedules = async () => {
  try {
    const response = await apiClient.get('/api/talent-engine-job-applications/schedules/deleted/soft_deleted/');
    //console.log('Soft-deleted job Schedule:', response.data);
    return response.data.data || response.data; // Handle response structure
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to load soft-deleted schedules.');
  }
};

export const recoverSchedules = async (ids) => {
  try {
    const response = await apiClient.post('/api/talent-engine-job-applications/schedules/recover/schedule/', { ids });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to recover schedules.');
  }
};

export const permanentDeleteSchedules = async (ids) => {
  try {
    const response = await apiClient.post('/api/talent-engine-job-applications/schedules/permanent-delete/schedule/', { ids });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to permanently delete schedules.');
  }
};

// API function to fetch tenant email configuration
export const fetchTenantConfig = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No access token available');
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    const tenantId = payload.tenant_id;
    const response = await apiClient.get(`api/tenant/tenants/${tenantId}/`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch tenant configuration.');
  }
};

// API function to update tenant email configuration
export const updateTenantConfig = async (id, configData) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No access token available');
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    const tenantId = payload.tenant_id;
    const response = await apiClient.patch(`api/tenant/tenants/${tenantId}/`, configData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to update tenant configuration.');
  }
};



export const createComplianceItem = async (jobRequisitionId, itemData) => {
  try {
    const response = await apiClient.post(
      `/api/talent-engine/requisitions/${jobRequisitionId}/compliance-items/`,
      itemData
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to create compliance item.');
  }
};

export const updateApplicantComplianceStatus = async (jobApplicationId, itemId, data) => {
  try {
    const response = await apiClient.put(
      `/api/talent-engine-job-applications/applications/compliance/${jobApplicationId}/compliance-items/${itemId}/`,
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to update compliance status.');
  }
};

export const deleteComplianceItem = async (jobRequisitionId, itemId) => {
    try {
        const response =  await apiClient.delete(
            `/api/talent-engine/requisitions/${jobRequisitionId}/compliance-items/${itemId}/`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            }
        );
        return response.data; // Should be empty for 204 No Content
    } catch (error) {
        console.error('Error deleting compliance item:', error);
        throw error;
    }
};

export const updateComplianceItem = async (jobRequisitionId, itemId, data) => {
    try {
        const response =  await apiClient.put(
            `/api/talent-engine/requisitions/${jobRequisitionId}/compliance-items/${itemId}/`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            }
        );
        return response.data; // Expecting { id, name, description, required, status, checked_by, checked_at }
    } catch (error) {
        console.error('Error updating compliance item:', error);
        throw error;
    }
};