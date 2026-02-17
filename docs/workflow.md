# Workflow - Tết Game Keeper

## Development Workflow

### Phase 1: Foundation ✅
- [x] Setup Supabase project connection
- [x] Design database schema (game_rooms, room_players, game_rounds)
- [x] Create database migration with RLS policies
- [x] Enable realtime subscriptions

### Phase 2: Core Implementation ✅
- [x] Create Tet-themed design system (red & gold, horse motifs)
- [x] Build homepage with create/join room flow
- [x] Build room creation page with game type selection
- [x] Build game room page with real-time score tracking
- [x] Implement player management (join, remove, scores)

### Phase 3: Game-Specific Logic ✅
- [x] Xì Dách: money tracking between dealer/players
- [x] Tứ Hùng: target score with win detection
- [x] Tiến Lên: point tracking per round
- [x] Ba Cây: money tracking per round

### Phase 4: Polish
- [ ] Add sound effects for actions
- [ ] Add game history/rounds tracking
- [ ] Add export/screenshot functionality
- [ ] PWA support for offline mode

## Tech Stack
- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Hosting**: Lovable

## Git Branching Strategy
- `main`: Production-ready code
- Feature work done directly via Lovable AI
