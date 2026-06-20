export function formatarDataPartida(dataHora: string): string {
    const date = new Date(dataHora);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const hora = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${dia}/${mes} • ${hora}:${min}`;
  }