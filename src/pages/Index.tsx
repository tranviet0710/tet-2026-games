import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import TetDecorations from '@/components/TetDecorations';
import { ArrowRight, Plus, Hash } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [joinId, setJoinId] = useState('');

  const handleJoin = () => {
    if (joinId.trim()) {
      navigate(`/room/${joinId.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen tet-pattern relative overflow-hidden">
      <TetDecorations />

      <main className="relative z-10 px-4 py-8 max-w-lg mx-auto">
        {/* Hero */}
        <div className="text-center mb-10 pt-8">
          <div className="text-6xl mb-3">🐴</div>
          <h1 className="font-display text-4xl font-black text-foreground mb-2">
            Tết Game Keeper
          </h1>
          <p className="text-muted-foreground font-body">
            Ghi điểm & tiền bài Tết 2026 — Năm Bính Ngọ 🧧
          </p>
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          {/* Create room */}
          <Card className="tet-card-glow border-primary/20">
            <CardContent className="p-5">
              <Button
                className="w-full h-14 text-lg font-semibold tet-gradient text-primary-foreground"
                onClick={() => navigate('/create')}
              >
                <Plus className="h-5 w-5 mr-2" />
                Tạo phòng mới
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Tạo phòng → chia sẻ mã → bắt đầu chơi
              </p>
            </CardContent>
          </Card>

          {/* Join room */}
          <Card className="border-secondary/30">
            <CardContent className="p-5">
              <h2 className="font-display font-bold text-lg mb-3 text-foreground">
                Vào phòng có sẵn
              </h2>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={joinId}
                    onChange={(e) => setJoinId(e.target.value.toUpperCase())}
                    placeholder="Nhập mã phòng"
                    className="pl-9 h-12 text-lg tracking-widest font-mono uppercase"
                    maxLength={6}
                    onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                  />
                </div>
                <Button
                  variant="outline"
                  className="h-12 px-5 border-primary/30 hover:bg-primary/10"
                  onClick={handleJoin}
                  disabled={!joinId.trim()}
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game types preview */}
        <div className="mt-10">
          <h2 className="font-display font-bold text-center text-muted-foreground mb-4 text-sm uppercase tracking-wider">
            Hỗ trợ các loại bài
          </h2>
          <div className="grid grid-cols-4 gap-3 text-center">
            {[
              { icon: '🃏', name: 'Xì Dách' },
              { icon: '🀄', name: 'Tứ Hùng' },
              { icon: '🂡', name: 'Tiến Lên' },
              { icon: '🎴', name: 'Ba Cây' },
            ].map((g) => (
              <div key={g.name} className="flex flex-col items-center gap-1">
                <span className="text-3xl">{g.icon}</span>
                <span className="text-xs text-muted-foreground">{g.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 pb-6">
          <p className="text-xs text-muted-foreground">
            🧧 Chúc Mừng Năm Mới 2026 🧧
          </p>
          <p className="text-xs text-muted-foreground/50 mt-1">
            Made with ❤️ for Tết
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
