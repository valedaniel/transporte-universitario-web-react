import axios, { AxiosInstance } from 'axios';
import dotenv from '../../utils/dotenv';

const API: AxiosInstance = axios.create({
    baseURL: `${dotenv.URL_SERVER}/api`,
    headers: { Accept: 'application/json' }
})

export default API;