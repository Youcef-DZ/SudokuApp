/**
 * Sudoku Game Component (Modular Version)
 * For local development - uses separate modules
 */

import React from 'react';
import { useSudokuGame } from './hooks/useSudokuGame';
import { GameHeader } from './components/GameHeader';
import { SudokuBoard } from './components/SudokuBoard';
import { NumberPad } from './components/NumberPad';
import { WinMessage } from './components/WinMessage';
import type { SudokuGameProps } from './types';

const SudokuGameModular: React.FC<SudokuGameProps> = ({
  difficulty = 'medium',
  primaryColor = '#3b82f6',
  backgroundColor = '#ffffff',
  gridColor = '#e5e7eb',
  errorColor = '#ef4444',
  successColor = '#10b981',
  cellSize = 50
}) => {
  const {
    currentBoard,
    initialBoard,
    selectedCell,
    errors,
    gameWon,
    startNewGame,
    handleCellClick,
    handleNumberInput
  } = useSudokuGame(difficulty);

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
      <GameHeader
        boardSize={boardSize}
        primaryColor={primaryColor}
        onNewGame={startNewGame}
      />

      <SudokuBoard
        currentBoard={currentBoard}
        initialBoard={initialBoard}
        selectedCell={selectedCell}
        errors={errors}
        cellSize={cellSize}
        primaryColor={primaryColor}
        gridColor={gridColor}
        errorColor={errorColor}
        onCellClick={handleCellClick}
      />

      <NumberPad
        selectedCell={selectedCell}
        boardSize={boardSize}
        primaryColor={primaryColor}
        errorColor={errorColor}
        onNumberInput={handleNumberInput}
      />

      {gameWon && <WinMessage successColor={successColor} />}

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
};

export default SudokuGameModular;
