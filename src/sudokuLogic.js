/**
 * Sudoku Game Logic
 * Pure JavaScript functions that work in both local and Framer environments
 */

// Create an empty 9x9 grid
export const createEmptyBoard = () => {
  return Array(9).fill(null).map(() => Array(9).fill(0));
};

// Check if a number is valid at a given position
export const isValid = (board, row, col, num) => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
};

// Solve the Sudoku board using backtracking
export const solveSudoku = (board) => {
  const solve = () => {
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

// Generate a random filled Sudoku board
export const generateFilledBoard = () => {
  const board = createEmptyBoard();
  
  // Fill diagonal 3x3 boxes first (they don't affect each other)
  const fillBox = (row, col) => {
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

  // Solve the rest
  solveSudoku(board);
  return board;
};

// Remove numbers from a filled board to create a puzzle
export const generatePuzzle = (difficulty = 'medium') => {
  const board = generateFilledBoard();
  const solution = board.map(row => [...row]);
  
  // Difficulty levels: easy (30-35 removed), medium (40-45), hard (50-55)
  const cellsToRemove = {
    easy: 30 + Math.floor(Math.random() * 6),
    medium: 40 + Math.floor(Math.random() * 6),
    hard: 50 + Math.floor(Math.random() * 6)
  }[difficulty];

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

// Check if the current board is solved correctly
export const checkSolution = (board, solution) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] !== solution[row][col]) {
        return false;
      }
    }
  }
  return true;
};

// Check if a move is valid
export const isValidMove = (board, row, col, num) => {
  if (num === 0) return true; // Clearing a cell is always valid
  return isValid(board, row, col, num);
};

// Deep copy a board
export const copyBoard = (board) => {
  return board.map(row => [...row]);
};
