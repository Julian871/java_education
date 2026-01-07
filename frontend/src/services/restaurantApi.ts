import axios from 'axios';

const RESTAURANT_API_URL = import.meta.env.VITE_RESTAURANT_API_URL || 'http://localhost:8082';

console.log('🍽️ Restaurant API URL:', RESTAURANT_API_URL);

const restaurantApi = axios.create({
    baseURL: RESTAURANT_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Интерцептор для автоматической подстановки JWT токена
restaurantApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Интерцептор для обработки ошибок
restaurantApi.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('🚨 Restaurant API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: error.message
        });

        // Обработка конкретных статусов
        if (error.response?.status === 401) {
            console.warn('⚠️ Unauthorized - token might be invalid or expired');
            // Можно добавить редирект на логин если нужно
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }

        if (error.response?.status === 403) {
            console.warn('⛔ Forbidden - user does not have permission');
            alert('You do not have permission to perform this action');
        }

        if (error.response?.status === 404) {
            console.warn('🔍 Not Found - endpoint might not exist');
        }

        // Пробрасываем ошибку дальше для обработки в компонентах
        return Promise.reject(error);
    }
);

export { restaurantApi };