import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true,
});

// Track when the last real API call happened (used by smart idle-heartbeat)
export let lastApiCallTime = Date.now();

api.interceptors.request.use((config) => {
    // We still check localStorage for backward compatibility or session storage if needed,
    // but the primary auth is now via HTTP-only cookies managed by the browser.
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        lastApiCallTime = Date.now();
        return response;
    },
    (error) => {
        const isLoginRequest = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/login') || error.config?.url?.includes('/auth/me');
        if (error.response?.status === 401 && !isLoginRequest) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
