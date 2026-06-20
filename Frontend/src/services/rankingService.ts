import api from './api';
import { RankingResponse } from '@/types/Ranking';

export async function obterRanking(pagina = 0, tamanho = 50): Promise<RankingResponse> {
  const { data } = await api.get<RankingResponse>('/api/ranking', {
    params: { pagina, tamanho },
  });
  return data;
}