import api from './api';

const bookingService = {
    getAll: async (params = {}) => {
        const res = await api.get('/bookings', { params });
        return res.data;
    },
    getById: async (id) => {
        const res = await api.get(`/bookings/${id}`);
        return res.data;
    },
    create: async (bookingData) => {
        const res = await api.post('/bookings', bookingData);
        return res.data;
    },
    cancel: async (id) => {
        const res = await api.patch(`/bookings/${id}/cancel`);
        return res.data;
    },
};

export default bookingService;
