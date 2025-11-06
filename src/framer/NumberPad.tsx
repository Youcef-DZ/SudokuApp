interface NumberPadProps {
  selectedCell: { row: number; col: number } | null;
  onNumberInput: (num: number) => void;
  primaryColor: string;
  errorColor: string;
  boardSize: number;
}

export default function NumberPad({
  selectedCell,
  onNumberInput,
  primaryColor,
  errorColor,
  boardSize
}: NumberPadProps) {
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
        onClick={() => onNumberInput(0)}
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
  );
}
