import type { Board, Difficulty, PuzzleResult } from './types.ts';
import { getRandomPuzzle } from './Database.tsx';

export const isValid = (board: Board, row: number, col: number, num: number): boolean => {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }
  return true;
};

export const generatePuzzle = async (difficulty: Difficulty = 'medium'): Promise<PuzzleResult> => {
  const puzzleData = await getRandomPuzzle(difficulty);

  if (!puzzleData) {
    throw new Error(`No puzzle found for difficulty: ${difficulty}`);
  }

  return {
    puzzle: puzzleData.puzzle.map((row: number[]) => [...row]),
    solution: puzzleData.solution.map((row: number[]) => [...row]),
    id: puzzleData.id
  };
};

export const checkSolution = (board: Board, solution: Board): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] !== solution[row][col]) {
        return false;
      }
    }
  }
  return true;
};

export const isValidMove = (board: Board, row: number, col: number, num: number): boolean => {
  if (num === 0) return true;
  return isValid(board, row, col, num);
};

export const copyBoard = (board: Board): Board => {
  return board.map((row: number[]) => [...row]);
};
