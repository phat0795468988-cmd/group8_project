// API Configuration
// Tự động chọn URL phù hợp với môi trường

const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://group8-project.onrender.com'
    : 'http://localhost:3000');

export default API_BASE_URL;

// Export các endpoints
export const API_ENDPOINTS = {
  // Auth
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
  
  // Profile
  PROFILE: `${API_BASE_URL}/api/profile`,
  
  // Upload
  UPLOAD_AVATAR: `${API_BASE_URL}/api/upload/avatar`,
  
  // Users
  USERS: `${API_BASE_URL}/api/users`,
  USER_BY_ID: (id) => `${API_BASE_URL}/api/users/${id}`,
};

