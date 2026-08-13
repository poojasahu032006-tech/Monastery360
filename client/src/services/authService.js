import api from './api';

const authService = {
    register: async (data) => {
        const res = await api.post('/auth/register', data);
        return res.data;
    },
    login: async (data) => {
        const res = await api.post('/auth/login', data);
        return res.data;
    },
    getMe: async (token) => {
        const res = await api.get('/auth/me', {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        return res.data;
    },
    getProfile: async (token) => {
        const res = await api.get('/auth/me', {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        return res.data;
    },
};

export default authService;
