import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_URL = Platform.select({
  ios: 'http://localhost:8080',
  android: 'http://10.0.2.2:8080', // Endereço de loopback para a máquina host no emulador Android
  default: 'http://localhost:8080',
});

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição para injetar automaticamente o cabeçalho Authorization
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@BolaoCopa:token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default api;
