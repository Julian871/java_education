import axios from 'axios';

const USER_API_URL = import.meta.env.VITE_USER_API_URL || 'http://localhost:8081';

console.log('👤 User API URL:', USER_API_URL);

const userApi = axios.create({
    baseURL: USER_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

userApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

userApi.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('🚨 User API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: error.message
        });

        if (error.response?.status === 401) {
            console.warn('⚠️ Unauthorized - redirecting to login');
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export { userApi };