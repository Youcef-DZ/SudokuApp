import React, { useState, useEffect } from 'react';
import {
  generatePuzzle,
  checkSolution,
  isValidMove,
  copyBoard
} from './sudokuLogic';

/**
 * FRAMER COMPONENT
 * This component can be copied directly to Framer as a Code Component
 * 
 * To use in Framer:
 * 1. Create a new Code Component
 * 2. Copy this entire file content
 * 3. Also copy sudokuLogic.js content above this component
 * 4. Add the component to your canvas
 */

const SudokuGame = ({ 
  difficulty = 'medium',
  primaryColor = '#3b82f6',
  backgroundColor = '#ffffff',
  gridColor = '#e5e7eb',
  errorColor = '#ef4444',
  successColor = '#10b981'
}) => {
  const [puzzle, setPuzzle] = useState([]);
  const [solution, setSolution] = useState([]);
  const [currentBoard, setCurrentBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [errors, setErrors] = useState(new Set());
  const [gameWon, setGameWon] = useState(false);

  // Initialize game
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
    // Don't allow selection of initial cells
    if (initialBoard[row]?.[col] !== 0) return;
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (num) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    
    // Don't allow changing initial cells
    if (initialBoard[row][col] !== 0) return;

    const newBoard = copyBoard(currentBoard);
    const errorKey = `${row}-${col}`;
    const newErrors = new Set(errors);

    // Validate the move
    if (num !== 0 && !isValidMove(newBoard, row, col, num)) {
      newErrors.add(errorKey);
    } else {
      newErrors.delete(errorKey);
    }

    newBoard[row][col] = num;
    setCurrentBoard(newBoard);
    setErrors(newErrors);

    // Check if game is won
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

  const cellSize = 50;
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
      {/* Header */}
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

      {/* Game Board */}
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

      {/* Number Pad */}
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
            gridColumn: 'span 1',
            transition: 'all 0.2s'
          }}
        >
          Clear
        </button>
      </div>

      {/* Win Message */}
      {gameWon && (
        <div style={{
          padding: '16px 24px',
          backgroundColor: successColor,
          color: 'white',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: '600',
          animation: 'fadeIn 0.5s'
        }}>
          🎉 Congratulations! You solved it!
        </div>
      )}

      {/* Instructions */}
      <div style={{
        width: boardSize,
        fontSize: '12px',
        color: '#6b7280',
        textAlign: 'center'
      }}>
        Click a cell and use keyboard (1-9) or number pad to fill. Press Delete/Backspace to clear.
      </div>
    </div>
  );
};

export default SudokuGame;
