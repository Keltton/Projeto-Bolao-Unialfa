export type PerfilUsuario = 'USUARIO' | 'ADMIN';
export type StatusUsuario = 'ATIVO' | 'BLOQUEADO' | 'EXCLUIDO';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  avatarUrl: string | null;
  perfil: PerfilUsuario;
  status: StatusUsuario;
  pontuacaoTotal: number;
  placaresExatos: number;
  ultimoLoginEm: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface UsuarioRanking {
  id: number;
  nome: string;
  avatarUrl: string | null;
  pontuacaoTotal: number;
  placaresExatos: number;
  posicao: number;
}


export interface LoginResponse {
  token: string;
  usuario: Usuario;
}
export interface ErroResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}