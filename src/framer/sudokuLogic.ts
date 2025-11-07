import type { Board, Difficulty, PuzzleResult } from './types.ts';
import { getRandomPuzzle } from './puzzleDatabase.ts';

export const createEmptyBoard = (): Board => {
  return Array(9).fill(null).map(() => Array(9).fill(0));
};

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

export const solveSudoku = (board: Board): Board => {
  const solve = (): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solve()) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };
  solve();
  return board;
};

export const generateFilledBoard = (): Board => {
  const board = createEmptyBoard();
  const fillBox = (row: number, col: number): void => {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const idx = Math.floor(Math.random() * nums.length);
        board[row + i][col + j] = nums[idx];
        nums.splice(idx, 1);
      }
    }
  };
  fillBox(0, 0);
  fillBox(3, 3);
  fillBox(6, 6);
  solveSudoku(board);
  return board;
};

export const generatePuzzle = async (difficulty: Difficulty = 'medium', useDatabase: boolean = true): Promise<PuzzleResult> => {

  if (useDatabase) {
    const puzzleData = await getRandomPuzzle(difficulty);
    if (puzzleData) {
      return {
        puzzle: puzzleData.puzzle.map((row: number[]) => [...row]),
        solution: puzzleData.solution.map((row: number[]) => [...row])
      };
    }
  }

  const board = generateFilledBoard();
  const solution: Board = board.map((row: number[]) => [...row]);
  const difficultyMap: Record<Difficulty, number> = {
    easy: 30 + Math.floor(Math.random() * 6),
    medium: 40 + Math.floor(Math.random() * 6),
    hard: 50 + Math.floor(Math.random() * 6)
  };
  const cellsToRemove = difficultyMap[difficulty];
  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (board[row][col] !== 0) {
      board[row][col] = 0;
      removed++;
    }
  }
  return { puzzle: board, solution };
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
