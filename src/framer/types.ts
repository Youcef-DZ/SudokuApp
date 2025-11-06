/**
 * FRAMER CODE FILE: types.ts
 * Type definitions for Sudoku game
 * 
 * In Framer: Create as Code File (not Component)
 */

export type Board = number[][];

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface CellPosition {
  row: number;
  col: number;
}

export interface PuzzleResult {
  puzzle: Board;
  solution: Board;
}

export interface SudokuGameProps {
  difficulty?: Difficulty;
  primaryColor?: string;
  backgroundColor?: string;
  gridColor?: string;
  errorColor?: string;
  successColor?: string;
  cellSize?: number;
}
