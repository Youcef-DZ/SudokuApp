// @ts-nocheck
/**
 * FRAMER CODE COMPONENT (.tsx)
 * Copy this entire file content to Framer as a Code Component
 * 
 * Instructions:
 * 1. In Framer, click the '+' button
 * 2. Select 'Code' under 'Components'
 * 3. Name it "SudokuGame" (Framer will create a .tsx file)
 * 4. Replace all content with this file
 * 5. The component will appear in your components panel
 * 
 * Note: Framer uses TypeScript (.tsx), not JavaScript (.jsx)
 * The @ts-nocheck directive allows this file to work in both environments
 */

import React, { useState, useEffect } from 'react';
import { addPropertyControls, ControlType } from 'framer';

// ============================================
// SUDOKU LOGIC (Include in Framer component)
// ============================================

const createEmptyBoard = () => {
  return Array(9).fill(null).map(() => Array(9).fill(0));
};

const isValid = (board, row, col, num) => {
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

const solveSudoku = (board) => {
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

const generateFilledBoard = () => {
  const board = createEmptyBoard();
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
  solveSudoku(board);
  return board;
};

const generatePuzzle = (difficulty = 'medium') => {
  const board = generateFilledBoard();
  const solution = board.map(row => [...row]);
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

const checkSolution = (board, solution) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] !== solution[row][col]) {
        return false;
      }
    }
  }
  return true;
};

const isValidMove = (board, row, col, num) => {
  if (num === 0) return true;
  return isValid(board, row, col, num);
};

const copyBoard = (board) => {
  return board.map(row => [...row]);
};

// ============================================
// REACT COMPONENT
// ============================================

export default function SudokuGame(props) {
  const {
    difficulty = 'medium',
    primaryColor = '#3b82f6',
    backgroundColor = '#ffffff',
    gridColor = '#e5e7eb',
    errorColor = '#ef4444',
    successColor = '#10b981',
    cellSize = 50
  } = props;

  const [puzzle, setPuzzle] = useState([]);
  const [solution, setSolution] = useState([]);
  const [currentBoard, setCurrentBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [errors, setErrors] = useState(new Set());
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    startNewGame();
  }, [difficulty]);

  const startNewGame = () => {
    const { puzzle: newPuzzle, solution: newSolution } = generatePuzzle(difficulty);
    setPuzzle(newPuzzle);
    setSolution(newSolution);
    setCurrentBoard(copyBoard(newPuzzle));
    setInitialBoard(copyBoard(newPuzzle));
    setSelectedCell(null);
    setErrors(new Set());
    setGameWon(false);
  };

  const handleCellClick = (row, col) => {
    if (initialBoard[row]?.[col] !== 0) return;
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (num) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (initialBoard[row][col] !== 0) return;

    const newBoard = copyBoard(currentBoard);
    const errorKey = `${row}-${col}`;
    const newErrors = new Set(errors);

    if (num !== 0 && !isValidMove(newBoard, row, col, num)) {
      newErrors.add(errorKey);
    } else {
      newErrors.delete(errorKey);
    }

    newBoard[row][col] = num;
    setCurrentBoard(newBoard);
    setErrors(newErrors);

    if (checkSolution(newBoard, solution)) {
      setGameWon(true);
    }
  };

  const handleKeyPress = (e) => {
    if (!selectedCell) return;
    const num = parseInt(e.key);
    if (num >= 1 && num <= 9) {
      handleNumberInput(num);
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
      handleNumberInput(0);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedCell, currentBoard]);

  const boardSize = cellSize * 9;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      padding: '20px',
      backgroundColor: backgroundColor,
      borderRadius: '12px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: boardSize,
      }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Sudoku</h2>
        <button
          onClick={startNewGame}
          style={{
            padding: '8px 16px',
            backgroundColor: primaryColor,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          New Game
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(9, ${cellSize}px)`,
        gap: '0',
        border: `2px solid ${gridColor}`,
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {currentBoard.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isInitial = initialBoard[rowIndex]?.[colIndex] !== 0;
            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
            const hasError = errors.has(`${rowIndex}-${colIndex}`);
            const isThickRight = (colIndex + 1) % 3 === 0 && colIndex !== 8;
            const isThickBottom = (rowIndex + 1) % 3 === 0 && rowIndex !== 8;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                style={{
                  width: cellSize,
                  height: cellSize,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: isInitial ? '700' : '400',
                  backgroundColor: isSelected ? '#dbeafe' : hasError ? '#fee2e2' : 'white',
                  color: isInitial ? '#1f2937' : hasError ? errorColor : primaryColor,
                  cursor: isInitial ? 'default' : 'pointer',
                  borderRight: isThickRight ? `2px solid ${gridColor}` : `1px solid #f3f4f6`,
                  borderBottom: isThickBottom ? `2px solid ${gridColor}` : `1px solid #f3f4f6`,
                  userSelect: 'none',
                  transition: 'background-color 0.2s'
                }}
              >
                {cell !== 0 ? cell : ''}
              </div>
            );
          })
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '8px',
        width: boardSize,
      }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberInput(num)}
            disabled={!selectedCell}
            style={{
              padding: '12px',
              fontSize: '18px',
              fontWeight: '600',
              backgroundColor: selectedCell ? primaryColor : '#e5e7eb',
              color: selectedCell ? 'white' : '#9ca3af',
              border: 'none',
              borderRadius: '6px',
              cursor: selectedCell ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s'
            }}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleNumberInput(0)}
          disabled={!selectedCell}
          style={{
            padding: '12px',
            fontSize: '14px',
            fontWeight: '600',
            backgroundColor: selectedCell ? errorColor : '#e5e7eb',
            color: selectedCell ? 'white' : '#9ca3af',
            border: 'none',
            borderRadius: '6px',
            cursor: selectedCell ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s'
          }}
        >
          Clear
        </button>
      </div>

      {gameWon && (
        <div style={{
          padding: '16px 24px',
          backgroundColor: successColor,
          color: 'white',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          🎉 Congratulations! You solved it!
        </div>
      )}

      <div style={{
        width: boardSize,
        fontSize: '12px',
        color: '#6b7280',
        textAlign: 'center'
      }}>
        Click a cell and use keyboard (1-9) or number pad to fill.
      </div>
    </div>
  );
}

// ============================================
// FRAMER PROPERTY CONTROLS
// ============================================

addPropertyControls(SudokuGame, {
  difficulty: {
    type: ControlType.Enum,
    title: 'Difficulty',
    options: ['easy', 'medium', 'hard'],
    defaultValue: 'medium'
  },
  primaryColor: {
    type: ControlType.Color,
    title: 'Primary Color',
    defaultValue: '#3b82f6'
  },
  backgroundColor: {
    type: ControlType.Color,
    title: 'Background',
    defaultValue: '#ffffff'
  },
  gridColor: {
    type: ControlType.Color,
    title: 'Grid Color',
    defaultValue: '#e5e7eb'
  },
  errorColor: {
    type: ControlType.Color,
    title: 'Error Color',
    defaultValue: '#ef4444'
  },
  successColor: {
    type: ControlType.Color,
    title: 'Success Color',
    defaultValue: '#10b981'
  },
  cellSize: {
    type: ControlType.Number,
    title: 'Cell Size',
    min: 30,
    max: 80,
    step: 5,
    defaultValue: 50
  }
});
