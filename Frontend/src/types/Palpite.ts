import { Partida } from './Partida';
import { Usuario } from './Usuario';

export type CriterioPontuacao = 'PENDENTE' | 'PLACAR_EXATO' | 'VENCEDOR_EMPATE' | 'ERROU';

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
