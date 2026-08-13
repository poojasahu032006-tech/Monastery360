import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('m360_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Handle 401s globally
api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('m360_token');
            // Let components react via AuthContext
        }
        return Promise.reject(error);
    }
);

export default api;
