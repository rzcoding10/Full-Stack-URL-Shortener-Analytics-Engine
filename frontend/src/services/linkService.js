import api from '../api/axios';

export const createShortLink = async (originalUrl) => {
    const response = await api.post('/url/shorten', { originalUrl });
    return response.data;
};

export const getUserLinks = async () => {
    const response = await api.get('/url/my-links');
    return response.data;
};