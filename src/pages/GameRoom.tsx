import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoom } from '@/hooks/useRoom';
import { GAME_CONFIG, GameType } from '@/lib/room-utils';
import PlayerScoreCard from '@/components/PlayerScoreCard';
import JoinRoomDialog from '@/components/JoinRoomDialog';
import TetDecorations from '@/components/TetDecorations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft,
  Copy,
  UserPlus,
  Trophy,
  Check,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';

const GameRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { room, players, loading, error, joinRoom, updateScore, removePlayer, finishGame } =
    useRoom(roomId);
  const [showJoin, setShowJoin] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyRoomId = async () => {
    await navigator.clipboard.writeText(roomId || '');
    setCopied(true);
    toast.success('Đã copy mã phòng!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareRoom = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: `Tết Game - ${room?.room_name}`,
        text: `Vào chơi bài Tết! Mã phòng: ${roomId}`,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Đã copy link phòng!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center tet-pattern">
        <div className="text-center">
          <div className="text-5xl mb-3 animate-sway">🏮</div>
          <p className="text-muted-foreground">Đang tải phòng chơi...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center tet-pattern px-4">
        <Card className="max-w-sm w-full">
          <CardContent className="p-6 text-center">
            <div className="text-5xl mb-3">😕</div>
            <h2 className="font-display text-xl font-bold mb-2">Không tìm thấy phòng</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Mã phòng "{roomId}" không tồn tại hoặc đã bị xóa.
            </p>
            <Button onClick={() => navigate('/')} className="tet-gradient text-primary-foreground">
              Về trang chủ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const config = GAME_CONFIG[room.game_type as GameType];
  const isFinished = room.status === 'finished';
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const totalBalance = players.reduce((sum, p) => sum + p.score, 0);

  return (
    <div className="min-h-screen tet-pattern relative overflow-hidden">
      <TetDecorations />

      <main className="relative z-10 px-4 py-4 max-w-lg mx-auto pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={copyRoomId} className="font-mono text-xs">
              {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
              {roomId}
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={shareRoom}>
              <Share2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Room info */}
        <div className="text-center mb-5">
          <span className="text-3xl">{config.icon}</span>
          <h1 className="font-display text-2xl font-bold text-foreground mt-1">
            {room.room_name}
          </h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {config.name}
            </span>
            {isFinished && (
              <span className="text-xs bg-secondary/20 text-secondary-foreground px-2 py-0.5 rounded-full font-medium">
                🏁 Đã kết thúc
              </span>
            )}
            {room.target_score && (
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                🎯 Đích: {room.target_score}
              </span>
            )}
          </div>
        </div>

        {/* Summary for money games */}
        {(room.game_type === 'xi-dach' || room.game_type === 'ba-cay') && players.length > 0 && (
          <Card className="mb-4 border-secondary/20">
            <CardContent className="p-3 text-center">
              <span className="text-xs text-muted-foreground">Tổng cân bằng: </span>
              <span className={`font-bold ${totalBalance === 0 ? 'text-green-600' : 'text-destructive'}`}>
                {totalBalance === 0 ? '✅ Cân bằng' : `⚠️ Lệch ${totalBalance.toLocaleString('vi-VN')}`}
              </span>
            </CardContent>
          </Card>
        )}

        {/* Winner announcement for Tu Hung */}
        {room.game_type === 'tu-hung' && room.target_score && !isFinished && (
          (() => {
            const winner = players.find(p => p.score >= (room.target_score || 0));
            if (!winner) return null;
            return (
              <Card className="mb-4 tet-card-glow border-secondary bg-secondary/5">
                <CardContent className="p-4 text-center">
                  <Trophy className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <h2 className="font-display text-xl font-bold text-foreground">
                    🎉 {winner.player_name} thắng!
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Đạt {winner.score}/{room.target_score} điểm
                  </p>
                </CardContent>
              </Card>
            );
          })()
        )}

        {/* Players grid */}
        {players.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-3">👥</div>
              <p className="text-muted-foreground">Chưa có người chơi nào</p>
              <p className="text-xs text-muted-foreground mt-1">
                Bấm "Thêm người chơi" để bắt đầu
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sortedPlayers.map((player, index) => (
              <PlayerScoreCard
                key={player.id}
                player={player}
                gameType={room.game_type as GameType}
                targetScore={room.target_score}
                onUpdateScore={updateScore}
                onRemove={removePlayer}
                isFinished={isFinished}
              />
            ))}
          </div>
        )}
      </main>

      {/* Bottom action bar */}
      {!isFinished && (
        <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur border-t border-border p-3 z-20">
          <div className="max-w-lg mx-auto flex gap-2">
            <Button
              className="flex-1 tet-gradient text-primary-foreground"
              onClick={() => setShowJoin(true)}
              disabled={players.length >= (room.max_players || 10)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Thêm người chơi ({players.length}/{room.max_players || 10})
            </Button>
            {players.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  finishGame();
                  toast.success('Ván bài đã kết thúc! 🎉');
                }}
              >
                <Trophy className="h-4 w-4 mr-1" />
                Kết thúc
              </Button>
            )}
          </div>
        </div>
      )}

      <JoinRoomDialog
        open={showJoin}
        onOpenChange={setShowJoin}
        onJoin={joinRoom}
        gameType={room.game_type}
      />
    </div>
  );
};

export default GameRoom;
