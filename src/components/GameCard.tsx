import { GameType, GAME_CONFIG } from '@/lib/room-utils';
import { Card, CardContent } from '@/components/ui/card';

interface GameCardProps {
  type: GameType;
  selected: boolean;
  onSelect: (type: GameType) => void;
}

const GameCard = ({ type, selected, onSelect }: GameCardProps) => {
  const config = GAME_CONFIG[type];

  return (
    <Card
      className={`cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] ${
        selected
          ? 'ring-2 ring-primary tet-card-glow border-primary'
          : 'hover:border-primary/30'
      }`}
      onClick={() => onSelect(type)}
    >
      <CardContent className="p-4 text-center">
        <div className="text-4xl mb-2">{config.icon}</div>
        <h3 className="font-display font-bold text-lg text-foreground">{config.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
        {config.hasTargetScore && (
          <span className="inline-block mt-2 text-xs bg-secondary/30 text-secondary-foreground px-2 py-0.5 rounded-full">
            Có điểm đích
          </span>
        )}
      </CardContent>
    </Card>
  );
};

export default GameCard;
