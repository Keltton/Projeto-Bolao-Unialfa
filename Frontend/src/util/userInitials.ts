const AVATAR_COLORS = [
  '#2D6A4F',
  '#40916C',
  '#1B4332',
  '#344E41',
  '#588157',
  '#52796F',
  '#354F52',
];

export function getUserInitials(nome: string): string {
  const parts = nome.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return '?';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  const primeira = parts[0][0] ?? '';
  const ultima = parts[parts.length - 1][0] ?? '';
  return `${primeira}${ultima}`.toUpperCase();
}

export function getAvatarColor(nome: string): string {
  let hash = 0;

  for (let i = 0; i < nome.length; i += 1) {
    hash = nome.charCodeAt(i) + ((hash << 5) - hash);
  }

  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
