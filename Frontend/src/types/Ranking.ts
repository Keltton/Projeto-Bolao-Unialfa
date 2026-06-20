import { UsuarioRanking } from './Usuario';

export interface RankingResponse {
  ranking: UsuarioRanking[];
  paginaAtual: number;
  totalPaginas: number;
  totalElementos: number;
  posicaoUsuarioAutenticado: number | null;
}
export interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
    avatarUrl: string | null;
    perfil: string;
    status: string;
  };
}
