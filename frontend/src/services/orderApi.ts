import axios from 'axios';

const ORDER_API_BASE_URL = 'http://localhost:8083';

const orderApi = axios.create({
    baseURL: ORDER_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

orderApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

orderApi.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('🚨 Order API Error:', {
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

export { orderApi };