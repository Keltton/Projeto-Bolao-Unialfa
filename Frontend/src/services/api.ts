import axios, { AxiosError } from 'axios';
import { Platform } from 'react-native';
import { ErroResponse } from '@/types/Usuario';
import { invalidateSession, getStoredToken } from './authSession';

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  Platform.select({
    ios: 'http://localhost:8080',
    android: 'http://10.0.2.2:8080',
    default: 'http://localhost:8080',
  });

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const isAuthRoute = config.url?.startsWith('/api/auth/');

    if (!isAuthRoute) {
      const token = await getStoredToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await invalidateSession();
    }
    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error: unknown, fallback = 'Erro inesperado'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === 'object' && data !== null && 'message' in data) {
      const message = (data as ErroResponse).message;
      if (message) return message;
    }

    if (typeof data === 'string' && data.trim()) {
      return data;
    }

    if (error.code === 'ERR_NETWORK') {
      return 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
    }

    if (error.response?.status === 401) {
      return 'Sessão expirada. Faça login novamente.';
    }

    if (error.response?.status === 403) {
      return 'Acesso negado. Faça login para continuar.';
    }

    return error.message || fallback;
  }

  return fallback;
}

export default api;
