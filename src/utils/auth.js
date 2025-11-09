// Authentication utility functions

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get the current authentication token
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get the current user
 */
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();
  return !!(token && user);
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userEmail');
  // Keep applications in localStorage for offline access
  // but they won't sync without auth
};

/**
 * Verify token is still valid
 */
export const verifyToken = async () => {
  const token = getToken();
  if (!token) return false;

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.success) {
      // Update user info in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      return true;
    }

    // Token is invalid, clear auth
    logout();
    return false;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
};

/**
 * Make authenticated API request
 */
export const authenticatedFetch = async (url, options = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  // If unauthorized, clear auth and throw error
  if (response.status === 401) {
    logout();
    throw new Error('Authentication required. Please login again.');
  }

  return response;
};

export default {
  getToken,
  getUser,
  isAuthenticated,
  logout,
  verifyToken,
  authenticatedFetch
};
