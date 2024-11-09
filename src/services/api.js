import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', // Backend base URL
    //withCredentials: true, // Include credentials if needed
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        // Skip adding token for registration and login endpoints
        const isAuthEndpoint = ['/api/users/register', '/api/users/login', 'api/enterprises/register'].includes(config.url);
        if (!isAuthEndpoint) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = 'Bearer ' + token;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default api;
