import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { LoginResponse, Usuario } from '@/types/Usuario';

const TOKEN_KEY = '@BolaoCopa:token';
const USER_KEY = '@BolaoCopa:usuario';

export async function login(email: string, senha: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/api/auth/login', { email, senha });
  await AsyncStorage.multiSet([
    [TOKEN_KEY, data.token],
    [USER_KEY, JSON.stringify(data.usuario)],
  ]);
  return data;
}

export async function logout(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}

export async function updateStoredUser(usuario: Usuario): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(usuario));
}

export async function getStoredSession(): Promise<LoginResponse | null> {
  const [[, token], [, userJson]] = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
  if (!token || !userJson) return null;
  return { token, usuario: JSON.parse(userJson) };
}


export async function register(nome: string, email: string, senha: string): Promise<Usuario> {
  const { data } = await api.post<Usuario>('/api/auth/register', {
    nome,
    email,
    senha,
  });
  return data;
}