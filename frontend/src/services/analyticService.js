import api from '../api/axios';

export const getLinkAnalytics = async (hash) => {
    const response = await api.get(`/url/${hash}/analytics`);
    return response.data;
};