interface NumberPadProps {
  selectedCell: { row: number; col: number } | null;
  onNumberInput: (num: number) => void;
  primaryColor: string;
  errorColor: string;
  boardSize: number;
  darkMode?: boolean;
}

export default function NumberPad({
  selectedCell,
  onNumberInput,
  primaryColor,
  errorColor,
  boardSize,
  darkMode = false
}: NumberPadProps) {
  const disabledBg = darkMode ? '#4b5563' : '#e5e7eb';
  const disabledText = darkMode ? '#6b7280' : '#9ca3af';
  
  // Use softer colors in dark mode
  const activePrimaryBg = darkMode ? '#79a1f8ff' : primaryColor; // Softer blue in dark mode
  const activeErrorBg = darkMode ? '#be7a7aff' : errorColor; // Softer red in dark mode
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '8px',
      width: boardSize,
    }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <button
          key={num}
          onClick={() => onNumberInput(num)}
          disabled={!selectedCell}
          style={{
            padding: '12px',
            fontSize: '18px',
            fontWeight: '600',
            backgroundColor: selectedCell ? activePrimaryBg : disabledBg,
            color: selectedCell ? 'white' : disabledText,
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
        onClick={() => onNumberInput(0)}
        disabled={!selectedCell}
        style={{
          padding: '12px',
          fontSize: '14px',
          fontWeight: '600',
          backgroundColor: selectedCell ? activeErrorBg : disabledBg,
          color: selectedCell ? 'white' : disabledText,
          border: 'none',
          borderRadius: '6px',
          cursor: selectedCell ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s'
        }}
      >
        Clear
      </button>
    </div>
  );
}
