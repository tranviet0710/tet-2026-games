import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';

interface JoinRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoin: (name: string) => Promise<string | null>;
  gameType: string;
}

const JoinRoomDialog = ({ open, onOpenChange, onJoin, gameType }: JoinRoomDialogProps) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Vui lòng nhập tên');
      return;
    }
    setLoading(true);
    const err = await onJoin(name.trim());
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      setName('');
      setError('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Tham gia phòng</DialogTitle>
          <DialogDescription>Nhập tên của bạn để vào chơi</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="playerName">Tên người chơi</Label>
            <Input
              id="playerName"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Ví dụ: Minh, Hùng, ..."
              autoFocus
            />
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>
          <Button type="submit" className="w-full tet-gradient text-primary-foreground" disabled={loading}>
            <UserPlus className="h-4 w-4 mr-2" />
            {loading ? 'Đang tham gia...' : 'Vào phòng'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinRoomDialog;
