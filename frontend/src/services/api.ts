import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const requestUrl = error.config?.url || '';

        // 👇 Список публичных endpoints, которые не должны вызывать редирект
        const publicEndpoints = [
            '/auth/login',
            '/auth/register',
            '/auth/refresh',
        ];

        const isPublicEndpoint = publicEndpoints.some(endpoint =>
            requestUrl.includes(endpoint)
        );

        // 👇 Обрабатываем 401 только для защищенных запросов
        if (error.response?.status === 401 && !isPublicEndpoint) {
            console.warn('🔐 Unauthorized access detected for protected endpoint');

            // Сохраняем текущий путь для возврата после логина
            if (window.location.pathname !== '/login') {
                localStorage.setItem('redirectAfterLogin', window.location.pathname);
            }

            // Очищаем аутентификационные данные
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Редирект только если мы не на странице логина
            if (window.location.pathname !== '/login') {
                setTimeout(() => {
                    window.location.href = '/login';
                }, 100);
            }
        }

        // 👇 Обрабатываем 403 (Forbidden)
        if (error.response?.status === 403) {
            console.warn('⛔ Access forbidden: insufficient permissions');
        }

        // 👇 Обрабатываем сетевые ошибки
        if (error.code === 'ERR_NETWORK') {
            console.error('🌐 Network error: server might be down');
        }

        return Promise.reject(error);
    }
);