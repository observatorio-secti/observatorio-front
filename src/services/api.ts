import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://simcc.uesc.br/v3/api',
  timeout: 15000,
});

export default api;
