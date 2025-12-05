# Sudoku Game - AI Coding Instructions

## Project Overview
A React + TypeScript Sudoku game with **dual-environment architecture** - runs identically in local development (Vite) and Framer. Features Descope OAuth authentication, Notion API integration for puzzles/leaderboards, and a custom lightweight state management system.

## Critical Architecture Patterns

### Dual Environment Strategy
- **Single source of truth**: `src/framer/` folder contains all core logic
- Local dev uses Vite; Framer uses these exact files as code components
- Framer property controls are commented out in local dev (see `SudokuGame.tsx` bottom)
- When editing core files, ensure they work in BOTH environments

### Authentication Flow (Descope)
```
GameWrapper (AuthProvider) 
  → GameWithAuth (useSession/useUser hooks)
    → DifficultySelect (pre-game) OR SudokuGame (in-game)
```

**Key patterns:**
- `GameWrapper.tsx` wraps everything in `AuthProvider` (project ID: `P35AlPWcTE6gN9hXrEFjboLuqX8T`)
- OAuth redirect handling: URL params `code`/`state` trigger `showLogin` state to process callback
- Username extraction: falls back through `user.givenName → user.name → user.email → user.loginIds[0]`
- Two-second delay after OAuth before cleaning URL params (Descope needs processing time)

### Notion API Integration
**Puzzles**: Fetched from `Database.tsx` using proxy API `https://notion-dgmd-cc.vercel.app/api/query?d=2a34ffe6f70c809fa74dca478af13756`
- 81-character strings converted to `number[][]` boards via `stringToBoard()`
- In-memory cache (`puzzleCache`) prevents repeated API calls
- DB ID extracted via custom `NotionHook.tsx` (3000+ line vendored library)

**Scores**: Saved via `useNotionData` hook with structured payload:
```typescript
{
  DATABASE_ID: string,
  PROPERTIES: {
    Name: { TYPE: 'title', VALUE: string },
    Time: { TYPE: 'number', VALUE: number },
    Difficulty: { TYPE: 'select', VALUE: 'Easy'|'Medium'|'Hard' }
  }
}
```

### State Management
**Custom store pattern** (`src/framer/data/store.ts`):
- Lightweight pub-sub system (no external libraries like Redux/Zustand)
- `createStore<T>` returns a React hook with `[state, setState]` signature
- Used for sharing Notion write handlers across component tree (`ScoresDb` → `SudokuGame`)

## Development Workflow

### Local Development
```bash
npm install      # First time only
npm run dev      # Starts Vite at localhost:5173
```

### Key Commands
- **Build**: `npm run build` (outputs to `dist/`)
- **Preview**: `npm run preview` (test production build)
- **Fix puzzles**: `node fix-notion-puzzles.js` (generates/updates Notion DB puzzles)

### File Modification Rules
1. **Core logic changes**: Edit `src/framer/` files ONLY
2. **Authentication changes**: Test both OAuth flow and manual login
3. **Notion changes**: Verify DB IDs match constants in `Database.tsx` (puzzles: `2a34ffe6`, scores: `2bb4ffe6`)
4. **Type changes**: Update `src/framer/types/types.ts` - used across all components

## Common Pitfalls

### Authentication Issues
- **Problem**: User object is `null` after OAuth → **Solution**: Check `sessionToken` claims instead (see `getUserName()` in `GameWrapper.tsx`)
- **Problem**: Login modal doesn't close → **Solution**: Ensure `refresh()` is called after OAuth, wait for `isAuthenticated` state update

### Notion API Failures
- **Problem**: Puzzles not loading → **Solution**: Check network tab for 200 response, verify `puzzleCache` is populated
- **Problem**: Scores not saving → **Solution**: Ensure `handleCreate` from `useScoresStore` exists before calling

### State Synchronization
- **Problem**: Game state out of sync → **Solution**: Use `scoreSavedRef.current` pattern to prevent duplicate saves
- **Problem**: Timer not stopping → **Solution**: Verify `gameWon` dependency in timer `useEffect`

## Tech Stack
- **React 18** + **TypeScript** (strict mode)
- **Vite** for dev server/bundling
- **Framer Motion** (animation library, minimal usage)
- **Descope React SDK** (OAuth + session management)
- **Notion API** (via custom proxy, no direct integration)

## File Organization
```
src/framer/              # ⚠️ Edit these files
├── types/types.ts       # Shared type definitions
├── game/
│   ├── GameWrapper.tsx  # Auth wrapper + view routing
│   ├── SudokuGame.tsx   # Main game component
│   └── sudokuLogic.ts   # Pure logic (validation, board copying)
├── data/
│   ├── Database.tsx     # Notion puzzle/score fetching
│   ├── NotionHook.tsx   # Vendored Notion SDK (read-only)
│   └── store.ts         # Custom state management
└── components/
    ├── DescopeAuth.tsx  # Auth HOCs (protectedComponent, etc.)
    ├── DifficultySelect.tsx
    ├── Header.tsx
    ├── Leaderboard.tsx
    ├── LoginPage.tsx
    └── NumberPad.tsx
```

## Testing Checklist
Before committing changes:
- [ ] Test login flow (both OAuth and email)
- [ ] Verify puzzles load for all three difficulties
- [ ] Complete a game and check score saves to Notion
- [ ] Test keyboard input (1-9, Backspace, Delete)
- [ ] Verify responsive sizing on mobile viewport
- [ ] Check dark mode toggle works
- [ ] Test logout returns to difficulty select
