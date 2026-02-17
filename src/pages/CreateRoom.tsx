import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import GameCard from '@/components/GameCard';
import TetDecorations from '@/components/TetDecorations';
import { GameType, GAME_CONFIG, generateRoomId } from '@/lib/room-utils';
import { ArrowLeft, Rocket } from 'lucide-react';

const CreateRoom = () => {
  const navigate = useNavigate();
  const [gameType, setGameType] = useState<GameType>('xi-dach');
  const [roomName, setRoomName] = useState('');
  const [dealerName, setDealerName] = useState('');
  const [targetScore, setTargetScore] = useState('45');
  const [loading, setLoading] = useState(false);

  const config = GAME_CONFIG[gameType];

  const handleCreate = async () => {
    if (!roomName.trim() || !dealerName.trim()) return;

    setLoading(true);
    const roomId = generateRoomId();

    const { error: roomErr } = await supabase.from('game_rooms').insert({
      id: roomId,
      game_type: gameType,
      room_name: roomName.trim(),
      created_by: dealerName.trim(),
      target_score: config.hasTargetScore ? parseInt(targetScore) || 45 : null,
      max_players: config.maxPlayers,
    });

    if (roomErr) {
      setLoading(false);
      return;
    }

    // Add dealer as first player
    await supabase.from('room_players').insert({
      room_id: roomId,
      player_name: dealerName.trim(),
      is_dealer: true,
      score: 0,
    });

    navigate(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen tet-pattern relative overflow-hidden">
      <TetDecorations />

      <main className="relative z-10 px-4 py-6 max-w-lg mx-auto">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Về trang chủ
        </Button>

        <h1 className="font-display text-3xl font-bold text-foreground mb-6">
          🎲 Tạo phòng chơi
        </h1>

        {/* Game type selection */}
        <div className="mb-6">
          <Label className="text-sm font-semibold mb-3 block">Chọn loại bài</Label>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(GAME_CONFIG) as GameType[]).map((type) => (
              <GameCard
                key={type}
                type={type}
                selected={gameType === type}
                onSelect={setGameType}
              />
            ))}
          </div>
        </div>

        {/* Room settings */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="roomName">Tên phòng</Label>
            <Input
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Ví dụ: Bàn nhà Ngoại, Hội bạn thân..."
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="dealerName">
              {gameType === 'xi-dach' || gameType === 'ba-cay' ? 'Tên cái (người tạo)' : 'Tên bạn'}
            </Label>
            <Input
              id="dealerName"
              value={dealerName}
              onChange={(e) => setDealerName(e.target.value)}
              placeholder="Nhập tên của bạn"
              className="mt-1"
            />
          </div>

          {config.hasTargetScore && (
            <div>
              <Label htmlFor="targetScore">Điểm đích</Label>
              <Input
                id="targetScore"
                type="number"
                value={targetScore}
                onChange={(e) => setTargetScore(e.target.value)}
                placeholder="45"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Ai đạt {targetScore || '?'} điểm trước sẽ thắng!
              </p>
            </div>
          )}
        </div>

        <Button
          className="w-full h-13 mt-8 text-lg font-semibold tet-gradient text-primary-foreground"
          onClick={handleCreate}
          disabled={loading || !roomName.trim() || !dealerName.trim()}
        >
          <Rocket className="h-5 w-5 mr-2" />
          {loading ? 'Đang tạo...' : 'Tạo phòng & Bắt đầu'}
        </Button>
      </main>
    </div>
  );
};

export default CreateRoom;
