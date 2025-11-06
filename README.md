# Sudoku Game - React & Framer

A fully functional Sudoku game that works both locally (React + Vite) and in Framer.

## 🚀 Quick Start

### Local Development
```bash
npm install
npm run dev
```
Opens at http://localhost:3000

### Copy to Framer

**Option 1: Modular (Recommended)**
Copy 3 files from `src/framer/`:
1. **Code File**: `types.ts`
2. **Code File**: `sudokuLogic.ts`  
3. **Component**: `SudokuGame.tsx`

**Option 2: Single File**
Copy `src/FramerComponent.tsx` to a Code Component

## ✨ Features
- Three difficulty levels (Easy, Medium, Hard)
- Real-time validation
- Keyboard input (1-9, Backspace)
- Win detection
- Customizable colors and size
- Responsive design

## � File Structure

### Current (Modular)
```
src/
├── types.ts                    # Type definitions
├── logic/sudokuLogic.ts       # Game logic (pure functions)
├── hooks/useSudokuGame.ts     # State management
├── components/                # UI components
│   ├── GameHeader.tsx
│   ├── SudokuBoard.tsx
│   ├── NumberPad.tsx
│   └── WinMessage.tsx
├── SudokuGameModular.tsx      # Main component
└── framer/                    # Framer-ready versions
    ├── types.ts
    ├── sudokuLogic.ts
    └── SudokuGame.tsx
```

### Legacy (Single-file)
- `src/SudokuGame.jsx` - Original local component
- `src/FramerComponent.tsx` - Single-file Framer component

## 🛠️ Adding Features

| Feature | Edit File |
|---------|-----------|
| New difficulty level | `logic/sudokuLogic.ts` |
| Timer | `hooks/useSudokuGame.ts` + new component |
| Hints | `logic/sudokuLogic.ts` + hook |
| Undo/Redo | `hooks/useSudokuGame.ts` |
| Themes | `types.ts` + components |

## � More Details
See [MODULAR_GUIDE.md](./MODULAR_GUIDE.md) for full modular architecture documentation.

## � Tech Stack
- React 18 + TypeScript
- Vite (dev server with hot reload)
- Framer Motion (optional)
