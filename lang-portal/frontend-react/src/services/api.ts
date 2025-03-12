import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept responses to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Handle specific status codes
    if (response) {
      // Handle specific error cases here
      if (response.status === 401) {
        // Handle unauthorized
        console.error('Unauthorized access');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
