// Generate a short readable room ID
export function generateRoomId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export type GameType = 'xi-dach' | 'tu-hung' | 'tien-len' | 'ba-cay';

export const GAME_CONFIG: Record<GameType, {
  name: string;
  description: string;
  icon: string;
  maxPlayers: number;
  hasTargetScore: boolean;
  defaultTargetScore?: number;
}> = {
  'xi-dach': {
    name: 'Xì Dách',
    description: 'Ghi nợ giữa cái và con, tính tiền cuối ván',
    icon: '🃏',
    maxPlayers: 10,
    hasTargetScore: false,
  },
  'tu-hung': {
    name: 'Tứ Hùng',
    description: '4 người chơi, ai đạt điểm đích trước thắng',
    icon: '🀄',
    maxPlayers: 4,
    hasTargetScore: true,
    defaultTargetScore: 45,
  },
  'tien-len': {
    name: 'Tiến Lên',
    description: 'Ghi điểm theo ván, tính tổng cuối buổi',
    icon: '🂡',
    maxPlayers: 4,
    hasTargetScore: false,
  },
  'ba-cay': {
    name: 'Ba Cây',
    description: 'Ghi tiền thắng thua giữa các người chơi',
    icon: '🎴',
    maxPlayers: 8,
    hasTargetScore: false,
  },
};

export function formatMoney(amount: number): string {
  if (amount === 0) return '0';
  const prefix = amount > 0 ? '+' : '';
  return `${prefix}${amount.toLocaleString('vi-VN')}`;
}
