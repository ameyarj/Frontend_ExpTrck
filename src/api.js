// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://backend-exptrck.onrender.com/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default API;