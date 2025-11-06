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

Copy 4 files from `src/framer/`:
1. **Code File**: `types.ts`
2. **Code File**: `sudokuLogic.ts`
3. **Code Component**: `NumberPad.tsx`
4. **Code Component**: `SudokuGame.tsx`

**Important**: Use `.ts` extension in imports (e.g., `'./types.ts'`)

**Alternative**: Copy `SudokuGame-SingleFile.tsx` as a single component (no imports needed)

## ✨ Features
- Three difficulty levels (Easy, Medium, Hard)
- Real-time validation
- Keyboard input (1-9, Backspace)
- Win detection
- Customizable colors and size
- Responsive design

## 📁 File Structure

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
├── SudokuGameModular.tsx      # Main component (local)
└── framer/                    # Framer-ready versions
    ├── types.ts               # Copy as Code File
    ├── sudokuLogic.ts         # Copy as Code File
    ├── NumberPad.tsx          # Copy as Code Component
    ├── SudokuGame.tsx         # Copy as Code Component
    └── SudokuGame-SingleFile.tsx  # Alternative: all-in-one
```

## 🛠️ Adding Features

| Feature | Edit File |
|---------|-----------|
| New difficulty level | `logic/sudokuLogic.ts` |
| Timer | `hooks/useSudokuGame.ts` + new component |
| Hints | `logic/sudokuLogic.ts` + hook |
| Undo/Redo | `hooks/useSudokuGame.ts` |
| Themes | `types.ts` + components |

## 🔧 Tech Stack
- React 18 + TypeScript
- Vite (dev server with hot reload)
- Framer Motion (optional)
