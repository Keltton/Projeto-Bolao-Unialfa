import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { invalidateSession, TOKEN_KEY, USER_KEY, getStoredToken, getStoredUserJson } from './authSession';
import { LoginResponse, Usuario } from '@/types/Usuario';

export async function login(email: string, senha: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/api/auth/login', { email, senha });
  await AsyncStorage.multiSet([
    [TOKEN_KEY, data.token],
    [USER_KEY, JSON.stringify(data.usuario)],
  ]);
  return data;
}

export async function logout(): Promise<void> {
  await invalidateSession();
}

export async function updateStoredUser(usuario: Usuario): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(usuario));
}

export async function getStoredSession(): Promise<LoginResponse | null> {
  const token = await getStoredToken();
  const userJson = await getStoredUserJson();
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

export async function solicitarRecuperacaoSenha(email: string): Promise<string> {
  const { data } = await api.post<{ mensagem: string }>('/api/auth/recuperar-senha', { email });
  return data.mensagem;
}

export async function redefinirSenha(codigo: string, novaSenha: string): Promise<string> {
  const { data } = await api.post<{ mensagem: string }>('/api/auth/redefinir-senha', {
    codigo,
    novaSenha,
  });
  return data.mensagem;
}
