import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Create a custom event for handling auth errors
export const AUTH_ERROR_EVENT = 'authError';

// Track if we're already handling an auth error
let isHandlingAuthError = false;

export const emitAuthError = (error) => {
    // Prevent multiple auth errors from being emitted simultaneously
    if (isHandlingAuthError) return;
    
    isHandlingAuthError = true;
    const event = new CustomEvent(AUTH_ERROR_EVENT, { 
        detail: { 
            message: error.response?.data?.message || 'Authentication failed',
            status: error.response?.status,
            url: error.config?.url
        } 
    });
    window.dispatchEvent(event);
    
    // Reset after a short delay
    setTimeout(() => {
        isHandlingAuthError = false;
    }, 100);
};

const api = axios.create({
    baseURL: 'http://localhost:8080'
});

// List of endpoints that don't require authentication
const publicEndpoints = [
    '/api/users/register',
    '/api/users/login',
    '/api/enterprises/register',
    '/api/users/validate-token'
];

// Function to check if URL is public
const isPublicEndpoint = (url) => {
    if (!url) return false;
    return publicEndpoints.some(endpoint => url.endsWith(endpoint));
};

// Function to validate token
const validateToken = (token) => {
    if (!token) return false;
    try {
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};

// Function to get current token
const getValidToken = () => {
    const token = localStorage.getItem('token');
    return token && validateToken(token) ? token : null;
};

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        // Skip token check for public endpoints
        if (isPublicEndpoint(config.url)) {
            return config;
        }

        const token = getValidToken();
        if (!token) {
            if (!isHandlingAuthError) {
                emitAuthError({ 
                    response: { 
                        status: 401, 
                        data: { message: 'No valid authentication token found' } 
                    },
                    config: { url: config.url }
                });
            }
            return Promise.reject(new Error('No valid authentication token found'));
        }

        // Add token to headers
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle authentication errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle authentication errors
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Don't emit auth error for public endpoints
            if (!isPublicEndpoint(error.config?.url) && !isHandlingAuthError) {
                // Clear invalid token
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
                delete api.defaults.headers.common.Authorization;
                
                emitAuthError(error);
            }
        }
        return Promise.reject(error);
    }
);

// Update token in localStorage and axios defaults
export const updateToken = (token) => {
    if (token && validateToken(token)) {
        localStorage.setItem('token', token);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        return true;
    } else {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        delete api.defaults.headers.common.Authorization;
        return false;
    }
};

// Initialize token from localStorage
const initToken = getValidToken();
if (initToken) {
    api.defaults.headers.common.Authorization = `Bearer ${initToken}`;
}

export default api;
