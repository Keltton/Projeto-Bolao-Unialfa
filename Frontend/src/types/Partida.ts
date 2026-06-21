export type FasePartida = 'GRUPOS' | 'OITAVAS' | 'QUARTAS' | 'SEMIFINAL' | 'FINAL';
export type StatusPartida = 'AGENDADA' | 'EM_ANDAMENTO' | 'ENCERRADA';

export interface Selecao {
  id: number;
  nome: string;
  codigoFifa: string;
  bandeiraUrl: string;
  grupo: string;
}

export interface Partida {
  id: number;
  selecaoA: Selecao;
  selecaoB: Selecao;
  dataHora: string;
  estadio: string;
  fase: FasePartida;
  grupo: string | null;
  status: StatusPartida;
  golsSelecaoA: number | null;
  golsSelecaoB: number | null;
  criadoEm: string;
  atualizadoEm: string;
}
