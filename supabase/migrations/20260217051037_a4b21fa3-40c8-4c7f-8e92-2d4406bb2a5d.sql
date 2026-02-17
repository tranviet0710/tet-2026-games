
-- Game rooms table
CREATE TABLE public.game_rooms (
  id TEXT NOT NULL PRIMARY KEY,
  game_type TEXT NOT NULL CHECK (game_type IN ('xi-dach', 'tu-hung', 'tien-len', 'ba-cay')),
  room_name TEXT NOT NULL,
  created_by TEXT NOT NULL,
  target_score INTEGER DEFAULT NULL,
  max_players INTEGER DEFAULT 10,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'finished')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Room players table
CREATE TABLE public.room_players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id TEXT NOT NULL REFERENCES public.game_rooms(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  score NUMERIC NOT NULL DEFAULT 0,
  is_dealer BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(room_id, player_name)
);

-- Game rounds for tracking history
CREATE TABLE public.game_rounds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id TEXT NOT NULL REFERENCES public.game_rooms(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL DEFAULT 1,
  round_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_rounds ENABLE ROW LEVEL SECURITY;

-- Public access policies (no auth needed - casual game app)
CREATE POLICY "Anyone can view game rooms" ON public.game_rooms FOR SELECT USING (true);
CREATE POLICY "Anyone can create game rooms" ON public.game_rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update game rooms" ON public.game_rooms FOR UPDATE USING (true);

CREATE POLICY "Anyone can view room players" ON public.room_players FOR SELECT USING (true);
CREATE POLICY "Anyone can join rooms" ON public.room_players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update scores" ON public.room_players FOR UPDATE USING (true);
CREATE POLICY "Anyone can leave rooms" ON public.room_players FOR DELETE USING (true);

CREATE POLICY "Anyone can view rounds" ON public.game_rounds FOR SELECT USING (true);
CREATE POLICY "Anyone can create rounds" ON public.game_rounds FOR INSERT WITH CHECK (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_game_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_game_rooms_updated_at
  BEFORE UPDATE ON public.game_rooms
  FOR EACH ROW EXECUTE FUNCTION public.update_game_updated_at();

CREATE TRIGGER update_room_players_updated_at
  BEFORE UPDATE ON public.room_players
  FOR EACH ROW EXECUTE FUNCTION public.update_game_updated_at();

-- Indexes
CREATE INDEX idx_room_players_room_id ON public.room_players(room_id);
CREATE INDEX idx_game_rounds_room_id ON public.game_rounds(room_id);
CREATE INDEX idx_game_rooms_status ON public.game_rooms(status);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_players;
