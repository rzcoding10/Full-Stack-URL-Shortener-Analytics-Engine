import axios from 'axios';

const api = axios.create({
    // Make sure this port matches your running backend port
    baseURL: 'http://localhost:4000/api', 
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;