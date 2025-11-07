interface GameHeaderProps {
  onNewGame: () => void;
  primaryColor: string;
  responsiveCellSize: number;
  boardSize: number;
}

export default function GameHeader({ onNewGame, primaryColor, responsiveCellSize, boardSize }: GameHeaderProps) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      maxWidth: boardSize,
    }}>
      <h2 style={{ 
        margin: 0, 
        fontSize: `${Math.max(18, responsiveCellSize * 0.5)}px`, 
        fontWeight: '600' 
      }}>Sudoku</h2>
      <button
        onClick={onNewGame}
        style={{
          padding: `${Math.max(6, responsiveCellSize * 0.16)}px ${Math.max(12, responsiveCellSize * 0.32)}px`,
          backgroundColor: primaryColor,
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: `${Math.max(12, responsiveCellSize * 0.28)}px`,
          fontWeight: '500'
        }}
      >
        New Game
      </button>
    </div>
  );
}
