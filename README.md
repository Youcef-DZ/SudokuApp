# Sudoku Game - React & Framer

A fully functional Sudoku game with **Notion database integration**. Works both locally (React + Vite) and in Framer using the **same 5 files**.

## 🚀 Quick Start

### Local Development
```bash
npm install
npm run dev
```
Opens at http://localhost:3000

### Copy to Framer

Copy all 5 files from `src/framer/`:
1. **Code File**: `types.ts`
2. **Code File**: `puzzleDatabase.ts`
3. **Code File**: `sudokuLogic.ts`
4. **Code Component**: `NumberPad.tsx`
5. **Code Component**: `SudokuGame.tsx`

**For Framer only**: Uncomment the Framer property controls at the bottom of `SudokuGame.tsx`

## ✨ Features
- **Notion Database Integration**: Real-time puzzle updates
- 30 curated puzzles (10 per difficulty level)
- Three difficulty levels (Easy, Medium, Hard)
- Real-time validation with error highlighting
- Keyboard input (1-9, Backspace, Delete)
- Win detection
- Customizable colors and cell size
- Responsive design
- Built-in caching for performance

## 🎯 Architecture

**One codebase for both environments**:
```
src/framer/              # Single source of truth
├── types.ts             # Type definitions
├── puzzleDatabase.ts    # Fetches puzzles from Notion API
├── sudokuLogic.ts       # Game logic (uses database)
├── NumberPad.tsx        # Number pad component
└── SudokuGame.tsx       # Main component (works in both local & Framer)
```

**Why this works**:
- ✅ Zero duplication between local and Framer
- ✅ Edit once, works everywhere
- ✅ Puzzles managed in Notion, no redeployment needed
- ✅ Framer controls commented out for local dev

## 🗄️ Notion Database

**API**: `https://notion-dgmd-cc.vercel.app/api/query?d=2a34ffe6f70c809fa74dca478af13756&r=true&n=a`

Benefits:
- Edit puzzles in Notion → instantly available in game
- CSV export/import support (`puzzles.csv`)
- 81-character string format (easy to copy/paste)
- Falls back to random generation if API fails

## � Legacy Files (Not Needed)

These folders are kept for reference but **not required**:
- `src/logic/` - Old local version
- `src/hooks/` - Old local version  
- `src/components/` - Old local version
- `src/SudokuGameModular.tsx` - Old local version

**The `src/framer/` folder is the only source of truth now.**

## 🔧 Tech Stack
- React 18 + TypeScript
- Vite (dev server with hot reload)
- Notion API (puzzle database)
- Fetch API (data fetching)
