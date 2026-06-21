import api from './api';
import { Palpite } from '@/types/Palpite';

type PalpitePayload = {
  partidaId: number;
  golsSelecaoA: number;
  golsSelecaoB: number;
};

export async function listarMeusPalpites(): Promise<Palpite[]> {
  const { data } = await api.get<Palpite[]>('/api/palpites/meus');
  return data;
}

export async function registrarPalpite(payload: PalpitePayload): Promise<Palpite> {
  const { data } = await api.post<Palpite>('/api/palpites', payload);
  return data;
}

export async function editarPalpite(id: number, payload: PalpitePayload): Promise<Palpite> {
  const { data } = await api.put<Palpite>(`/api/palpites/${id}`, payload);
  return data;
}