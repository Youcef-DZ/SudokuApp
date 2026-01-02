export type Board = number[][];

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface CellPosition {
  row: number;
  col: number;
}

export interface PuzzleResult {
  puzzle: Board;
  solution: Board;
  id?: number;
}

export interface GameState {
  currentBoard: Board;
  initialBoard: Board;
  solution: Board;
  elapsedTime: number;
  startTime: number;
  puzzleId?: number;
  selectedCell: CellPosition | null;
  errors: string[]; // Set converted to array for JSON
  gameWon: boolean;
}

export interface SudokuGameProps {
  difficulty?: Difficulty;
  primaryColor?: string;
  backgroundColor?: string;
  gridColor?: string;
  errorColor?: string;
  successColor?: string;
  cellSize?: number;
  onLogin?: (domainHint?: string) => void;
  onLogout?: () => void;
  onNewGame?: () => void;
  isAuthenticated?: boolean;
  userName?: string;
  userEmail?: string;
  darkMode?: boolean;
  onToggleTheme?: () => void;
  initialGameState?: GameState | null;
  onGameStateChange?: (state: GameState) => void;
}
