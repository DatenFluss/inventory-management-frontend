import axios from 'axios';

// Create a custom event for handling auth errors
export const AUTH_ERROR_EVENT = 'authError';
export const emitAuthError = (error) => {
    const event = new CustomEvent(AUTH_ERROR_EVENT, { 
        detail: { 
            message: error.response?.data?.message || 'Authentication failed',
            status: error.response?.status,
            url: error.config?.url
        } 
    });
    window.dispatchEvent(event);
};

const api = axios.create({
    baseURL: 'http://localhost:8080', // Backend base URL
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        // Skip adding token for registration and login endpoints
        const isAuthEndpoint = ['/api/users/register', '/api/users/login', '/api/enterprises/register'].includes(config.url);
        
        console.log('Request interceptor - URL:', config.url);
        console.log('Is auth endpoint:', isAuthEndpoint);
        
        if (!isAuthEndpoint) {
            const token = localStorage.getItem('token');
            
            console.log('Token exists:', !!token);
            
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
                console.log('Request headers:', config.headers);
            } else {
                console.warn('No token found for authenticated endpoint:', config.url);
                emitAuthError({ response: { status: 401, data: { message: 'No authentication token found' } } });
            }
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle authentication errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.error('Authentication error:', error.response);
            emitAuthError(error);
        }
        return Promise.reject(error);
    }
);

export const updateToken = (token) => {
    if (token) {
        console.log('Updating API token');
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
    } else {
        console.log('Clearing API token');
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
    }
};

export default api;
