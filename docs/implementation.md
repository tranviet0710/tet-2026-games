# Implementation Details - Tết Game Keeper

## Architecture

### Database Schema

```
game_rooms
├── id (TEXT, PK) - 6-char alphanumeric code
├── game_type (TEXT) - xi-dach | tu-hung | tien-len | ba-cay
├── room_name (TEXT)
├── created_by (TEXT)
├── target_score (INTEGER, nullable)
├── max_players (INTEGER, default 10)
├── status (TEXT) - active | finished
├── created_at, updated_at (TIMESTAMPTZ)

room_players
├── id (UUID, PK)
├── room_id (TEXT, FK → game_rooms)
├── player_name (TEXT)
├── score (NUMERIC, default 0)
├── is_dealer (BOOLEAN)
├── created_at, updated_at (TIMESTAMPTZ)
├── UNIQUE(room_id, player_name)

game_rounds
├── id (UUID, PK)
├── room_id (TEXT, FK → game_rooms)
├── round_number (INTEGER)
├── round_data (JSONB)
├── created_at (TIMESTAMPTZ)
```

### RLS Policies
- All tables have public access (no auth required)
- This is intentional: casual game app, no user accounts needed
- Players identified by name within room context

### Realtime
- `game_rooms` and `room_players` tables added to `supabase_realtime` publication
- Hook `useRoom` subscribes to changes on both tables filtered by room_id
- Score updates reflect instantly across all devices

## Game Types

### Xì Dách (Blackjack variant)
- Dealer (cái) vs Players (con)
- Track money: positive = winning, negative = owing
- Balance check: sum of all scores should be 0

### Tứ Hùng
- Exactly 4 players
- Target score (default 45)
- First player to reach target wins → celebration UI

### Tiến Lên
- Up to 4 players
- Track points per round
- Running total displayed

### Ba Cây
- Up to 8 players
- Money tracking similar to Xì Dách
- Balance verification

## Design System
- **Colors**: Red (primary) + Gold (accent) — traditional Tet palette
- **Fonts**: Playfair Display (headings) + Be Vietnam Pro (body)
- **Decorations**: Floating lanterns, cherry blossoms, horse emoji (2026 zodiac)
- **Mobile-first**: Max-width 512px, touch-friendly buttons
