import api from './api';
import { Usuario } from '@/types/Usuario';

type EditarPerfilPayload = {
  nome?: string;
  avatarUrl?: string | null;
  email?: string;
  senhaAtual?: string;
  novaSenha?: string;
};

export async function editarPerfil(payload: EditarPerfilPayload): Promise<Usuario> {
  const { data } = await api.put<Usuario>('/api/usuarios/me', payload);
  return data;
}

export async function obterMeuPerfil(): Promise<Usuario> {
  const { data } = await api.get<Usuario>('/api/usuarios/me');
  return data;
}

export async function excluirMinhaConta(): Promise<void> {
  await api.delete('/api/usuarios/me');
}