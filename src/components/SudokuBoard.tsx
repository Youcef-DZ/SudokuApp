/**
 * Sudoku Board Component
 * Displays the 9x9 game grid
 */

import React from 'react';
import type { Board, CellPosition } from '../types';

interface SudokuBoardProps {
  currentBoard: Board;
  initialBoard: Board;
  selectedCell: CellPosition | null;
  errors: Set<string>;
  cellSize: number;
  primaryColor: string;
  gridColor: string;
  errorColor: string;
  onCellClick: (row: number, col: number) => void;
}

export const SudokuBoard: React.FC<SudokuBoardProps> = ({
  currentBoard,
  initialBoard,
  selectedCell,
  errors,
  cellSize,
  primaryColor,
  gridColor,
  errorColor,
  onCellClick
}) => {
  return (
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
              onClick={() => onCellClick(rowIndex, colIndex)}
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
  );
};
