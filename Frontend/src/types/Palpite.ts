import { Partida } from './Partida';
import { Usuario } from './Usuario';

export type CriterioPontuacao = 'PLACAR_EXATO' | 'VENCEDOR_EMPATE' | 'NENHUM';

export interface Palpite {
  id: number;
  usuario: Usuario;
  partida: Partida;
  golsSelecaoA: number;
  golsSelecaoB: number;
  pontos: number | null;
  criterioPontuacao: CriterioPontuacao | null;
  criadoEm: string;
  atualizadoEm: string;
}
