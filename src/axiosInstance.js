import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '/api', // Proxy will handle the prefix
});

export default axiosInstance;
