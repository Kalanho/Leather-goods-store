import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// 1. Добавляем токен к каждому запросу
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Обрабатываем ответы и ошибки
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Если сервер ответил 401 (токен протух или неверный)
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      // Если мы не на странице логина — редиректим
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }

    const message =
      error.response?.data?.message || error.message || 'Ошибка запроса';
    console.error('[API ERROR]', message);
    return Promise.reject(new Error(message));
  }
);