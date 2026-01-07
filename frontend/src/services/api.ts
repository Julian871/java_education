import axios from 'axios';

// ==================== КОНФИГУРАЦИЯ API URL ====================
// Используем переменные окружения Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
const RESTAURANT_API_URL = import.meta.env.VITE_RESTAURANT_API_URL || 'http://localhost:8082';
const ORDER_API_URL = import.meta.env.VITE_ORDER_API_URL || 'http://localhost:8083';
const USER_API_URL = import.meta.env.VITE_USER_API_URL || 'http://localhost:8081';

console.log('🌐 API URLs Configuration:', {
    base: API_BASE_URL,
    restaurant: RESTAURANT_API_URL,
    order: ORDER_API_URL,
    user: USER_API_URL,
});

// ==================== ОСНОВНОЙ API (USER SERVICE) ====================
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 секунд
});

// ==================== RESTAURANT API ====================
export const restaurantApi = axios.create({
    baseURL: RESTAURANT_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// ==================== ORDER API ====================
export const orderApi = axios.create({
    baseURL: ORDER_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// ==================== USER API ====================
export const userApi = axios.create({
    baseURL: USER_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// ==================== ИНТЕРЦЕПТОРЫ ДЛЯ АВТОМАТИЧЕСКОЙ ПОДСТАНОВКИ ТОКЕНА ====================
const setupAuthInterceptor = (instance: any) => {
    instance.interceptors.request.use(
        (config: any) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error: any) => Promise.reject(error)
    );
};

// Настраиваем интерцепторы для всех инстансов
setupAuthInterceptor(api);
setupAuthInterceptor(restaurantApi);
setupAuthInterceptor(orderApi);
setupAuthInterceptor(userApi);

// ==================== ОБРАБОТКА ОШИБОК ДЛЯ ОСНОВНОГО API ====================
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
            console.warn('🔐 Unauthorized access detected for protected endpoint:', requestUrl);

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
            console.warn('⛔ Access forbidden: insufficient permissions for:', requestUrl);
        }

        // 👇 Обрабатываем сетевые ошибки
        if (error.code === 'ERR_NETWORK') {
            console.error('🌐 Network error: server might be down for:', requestUrl);
        }

        return Promise.reject(error);
    }
);

// ==================== ОБРАБОТКА ОШИБОК ДЛЯ RESTAURANT API ====================
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
            console.warn('⚠️ Restaurant API: Unauthorized');
        }

        if (error.response?.status === 403) {
            console.warn('⛔ Restaurant API: Forbidden');
        }

        if (error.response?.status === 404) {
            console.warn('🔍 Restaurant API: Not Found');
        }

        return Promise.reject(error);
    }
);

// ==================== ОБРАБОТКА ОШИБОК ДЛЯ ORDER API ====================
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
            console.warn('⚠️ Order API: Unauthorized');
        }

        return Promise.reject(error);
    }
);

// ==================== ОБРАБОТКА ОШИБОК ДЛЯ USER API ====================
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
            console.warn('⚠️ User API: Unauthorized');
        }

        return Promise.reject(error);
    }
);

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

/**
 * Получить заголовок Authorization с токеном
 */
export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Обновить токен в заголовках всех инстансов
 */
export const updateAuthToken = (token: string) => {
    localStorage.setItem('token', token);

    // Обновляем заголовки для всех инстансов
    [api, restaurantApi, orderApi, userApi].forEach(instance => {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    });
};

/**
 * Очистить авторизацию
 */
export const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Очищаем заголовки для всех инстансов
    [api, restaurantApi, orderApi, userApi].forEach(instance => {
        delete instance.defaults.headers.common['Authorization'];
    });
};

/**
 * Проверить доступность сервисов
 */
export const checkServicesHealth = async () => {
    const services = [
        { name: 'User Service', url: API_BASE_URL, instance: api },
        { name: 'Restaurant Service', url: RESTAURANT_API_URL, instance: restaurantApi },
        { name: 'Order Service', url: ORDER_API_URL, instance: orderApi },
    ];

    const results = await Promise.allSettled(
        services.map(async (service) => {
            try {
                await service.instance.get('/actuator/health');
                return { name: service.name, status: 'UP' };
            } catch (error) {
                return { name: service.name, status: 'DOWN', error };
            }
        })
    );

    return results.map((result, index) => ({
        service: services[index].name,
        url: services[index].url,
        status: result.status === 'fulfilled' ? result.value.status : 'DOWN',
        error: result.status === 'rejected' ? result.reason : null,
    }));
};

// ==================== ТИПЫ ДЛЯ API ====================

export interface ApiError {
    message: string;
    status: number;
    timestamp: string;
    path: string;
    messages?: Record<string, string>;
}

export interface ApiResponse<T> {
    data: T;
    status: number;
    timestamp: string;
}

// Экспортируем URL для использования в компонентах
export const API_URLS = {
    BASE: API_BASE_URL,
    RESTAURANT: RESTAURANT_API_URL,
    ORDER: ORDER_API_URL,
    USER: USER_API_URL,
};

export default {
    api,
    restaurantApi,
    orderApi,
    userApi,
    getAuthHeader,
    updateAuthToken,
    clearAuth,
    checkServicesHealth,
    API_URLS,
};