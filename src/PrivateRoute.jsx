import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import config from './config'; // Adjust the import path as needed

const API_BASE_URL = `${config.API_BASE_URL}`;

// Function to validate token with the backend
const validateToken = async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    return { isValid: false, user: null };
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/api/token/validate/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return { isValid: true, user: response.data.user };
  } catch (error) {
    console.error('Token validation failed:', error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tenantId');
    localStorage.removeItem('tenantSchema');
    localStorage.removeItem('user');
    return { isValid: false, user: null };
  }
};

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const result = await validateToken();
      setIsAuthenticated(result.isValid);
    };
    checkToken();
  }, []);

  // Show loading state while validating token
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;