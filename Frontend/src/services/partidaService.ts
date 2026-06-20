import api from './api';
import { FasePartida, Partida, StatusPartida } from '@/types/Partida';

type FiltrosPartida = {
  fase?: FasePartida;
  status?: StatusPartida;
  inicio?: string;
  fim?: string;
};

export async function listarPartidas(filtros?: FiltrosPartida): Promise<Partida[]> {
  const { data } = await api.get<Partida[]>('/api/partidas', { params: filtros });
  return data;
}

export async function listarProximasPartidas(): Promise<Partida[]> {
  const { data } = await api.get<Partida[]>('/api/partidas/proximas');
  return data;
}

export async function buscarPartidaPorId(id: number): Promise<Partida> {
  const { data } = await api.get<Partida>(`/api/partidas/${id}`);
  return data;
}