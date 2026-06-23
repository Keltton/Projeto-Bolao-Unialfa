import api from './api';

export type Notificacao = {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: string;
  data: string;
};

export async function listarNotificacoes(): Promise<Notificacao[]> {
  const { data } = await api.get<Notificacao[]>('/api/notificacoes');
  return data;
}
