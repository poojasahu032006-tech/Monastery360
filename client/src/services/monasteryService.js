import api from './api';

const monasteryService = {
    getAll: async (params = {}) => {
        const res = await api.get('/monasteries', { params });
        return res.data;
    },
    getById: async (id) => {
        const res = await api.get(`/monasteries/${id}`);
        return res.data;
    },
};

export default monasteryService;
