import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GameType } from '@/lib/room-utils';

export interface RoomPlayer {
  id: string;
  room_id: string;
  player_name: string;
  score: number;
  is_dealer: boolean;
  created_at: string;
  updated_at: string;
}

export interface GameRoom {
  id: string;
  game_type: GameType;
  room_name: string;
  created_by: string;
  target_score: number | null;
  max_players: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useRoom(roomId: string | undefined) {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoom = useCallback(async () => {
    if (!roomId) return;
    setLoading(true);
    const { data, error: err } = await supabase
      .from('game_rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (err) {
      setError('Không tìm thấy phòng chơi');
      setLoading(false);
      return;
    }
    setRoom(data as unknown as GameRoom);
    setError(null);
    setLoading(false);
  }, [roomId]);

  const fetchPlayers = useCallback(async () => {
    if (!roomId) return;
    const { data } = await supabase
      .from('room_players')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });

    if (data) setPlayers(data as unknown as RoomPlayer[]);
  }, [roomId]);

  useEffect(() => {
    fetchRoom();
    fetchPlayers();
  }, [fetchRoom, fetchPlayers]);

  // Realtime subscriptions
  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`room-${roomId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'room_players',
        filter: `room_id=eq.${roomId}`,
      }, () => {
        fetchPlayers();
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'game_rooms',
        filter: `id=eq.${roomId}`,
      }, () => {
        fetchRoom();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, fetchPlayers, fetchRoom]);

  const joinRoom = async (playerName: string, isDealer = false) => {
    const { error: err } = await supabase
      .from('room_players')
      .insert({
        room_id: roomId!,
        player_name: playerName.trim(),
        is_dealer: isDealer,
        score: 0,
      });
    if (err) {
      if (err.code === '23505') return 'Tên này đã được sử dụng trong phòng';
      return err.message;
    }
    await fetchPlayers();
    return null;
  };

  const updateScore = async (playerId: string, newScore: number) => {
    await supabase
      .from('room_players')
      .update({ score: newScore })
      .eq('id', playerId);
  };

  const removePlayer = async (playerId: string) => {
    await supabase
      .from('room_players')
      .delete()
      .eq('id', playerId);
  };

  const finishGame = async () => {
    await supabase
      .from('game_rooms')
      .update({ status: 'finished' })
      .eq('id', roomId!);
  };

  return {
    room,
    players,
    loading,
    error,
    joinRoom,
    updateScore,
    removePlayer,
    finishGame,
    refetch: fetchPlayers,
  };
}
