/**
 * Game Header Component
 * Title and New Game button
 */

import React from 'react';

interface GameHeaderProps {
  boardSize: number;
  primaryColor: string;
  onNewGame: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  boardSize,
  primaryColor,
  onNewGame
}) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: boardSize,
    }}>
      <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Sudoku</h2>
      <button
        onClick={onNewGame}
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
  );
};
