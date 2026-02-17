import { useState } from 'react';
import { RoomPlayer } from '@/hooks/useRoom';
import { formatMoney, GameType } from '@/lib/room-utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, Crown, Check } from 'lucide-react';

interface PlayerScoreCardProps {
  player: RoomPlayer;
  gameType: GameType;
  targetScore?: number | null;
  onUpdateScore: (playerId: string, newScore: number) => void;
  onRemove: (playerId: string) => void;
  isFinished: boolean;
}

const PlayerScoreCard = ({
  player,
  gameType,
  targetScore,
  onUpdateScore,
  onRemove,
  isFinished,
}: PlayerScoreCardProps) => {
  const [adjustValue, setAdjustValue] = useState('');
  const isWinner = gameType === 'tu-hung' && targetScore && player.score >= targetScore;
  const isPositive = player.score > 0;
  const isNegative = player.score < 0;

  const handleAdjust = (multiplier: number) => {
    const val = parseFloat(adjustValue);
    if (isNaN(val) || val === 0) return;
    onUpdateScore(player.id, player.score + val * multiplier);
    setAdjustValue('');
  };

  return (
    <Card
      className={`transition-all duration-300 ${
        isWinner
          ? 'ring-2 ring-secondary tet-card-glow bg-secondary/10'
          : ''
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {player.is_dealer && (
              <Crown className="h-4 w-4 text-secondary" />
            )}
            <span className="font-semibold text-foreground">{player.player_name}</span>
            {isWinner && <span className="text-sm">🏆</span>}
          </div>
          {!isFinished && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => onRemove(player.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        <div className="text-center mb-3">
          <span
            className={`font-display text-3xl font-bold ${
              isPositive
                ? 'text-green-600'
                : isNegative
                ? 'text-primary'
                : 'text-foreground'
            }`}
          >
            {gameType === 'xi-dach' || gameType === 'ba-cay'
              ? formatMoney(player.score)
              : player.score}
          </span>
          <span className="text-xs text-muted-foreground block mt-1">
            {gameType === 'xi-dach' || gameType === 'ba-cay' ? 'VNĐ' : 'điểm'}
          </span>
        </div>

        {!isFinished && (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 shrink-0 border-primary/20 hover:bg-primary/10"
              onClick={() => handleAdjust(-1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              placeholder="Nhập số"
              value={adjustValue}
              onChange={(e) => setAdjustValue(e.target.value)}
              className="text-center h-9"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdjust(1);
              }}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 shrink-0 border-green-500/20 hover:bg-green-500/10"
              onClick={() => handleAdjust(1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerScoreCard;
