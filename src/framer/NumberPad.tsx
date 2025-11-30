interface NumberPadProps {
  selectedCell: { row: number; col: number } | null;
  onNumberInput: (num: number) => void;
  boardSize: number;
  darkMode?: boolean;
}

export default function NumberPad({
  selectedCell,
  onNumberInput,
  boardSize,
  darkMode = false
}: NumberPadProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '10px',
      width: boardSize,
      padding: '4px',
      margin: '0 auto'
    }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <button
          key={num}
          onClick={() => onNumberInput(num)}
          disabled={!selectedCell}
          style={{
            padding: '14px',
            fontSize: '20px',
            fontWeight: '700',
            background: selectedCell
              ? (darkMode
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.6) 0%, rgba(56, 189, 248, 0.6) 100%)'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.5) 0%, rgba(14, 165, 233, 0.5) 100%)')
              : (darkMode
                ? 'rgba(30, 41, 59, 0.5)'
                : 'rgba(255, 255, 255, 0.7)'),
            color: selectedCell ? 'white' : (darkMode ? '#64748b' : '#93c5fd'),
            border: selectedCell
              ? (darkMode
                ? '1px solid rgba(99, 102, 241, 0.5)'
                : '1px solid rgba(59, 130, 246, 0.4)')
              : (darkMode
                ? '1px solid rgba(71, 85, 105, 0.3)'
                : '1px solid rgba(203, 213, 225, 0.5)'),
            borderRadius: '10px',
            cursor: selectedCell ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: selectedCell
              ? (darkMode
                ? '0 4px 16px rgba(99, 102, 241, 0.45)'
                : '0 4px 16px rgba(59, 130, 246, 0.35)')
              : 'none',
            transform: 'scale(1)',
            backdropFilter: !selectedCell ? 'blur(8px)' : 'none',
            WebkitBackdropFilter: !selectedCell ? 'blur(8px)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (selectedCell) {
              e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
              e.currentTarget.style.boxShadow = darkMode
                ? '0 6px 20px rgba(99, 102, 241, 0.65)'
                : '0 6px 20px rgba(59, 130, 246, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedCell) {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = darkMode
                ? '0 4px 16px rgba(99, 102, 241, 0.45)'
                : '0 4px 16px rgba(59, 130, 246, 0.35)';
            }
          }}
          onMouseDown={(e) => {
            if (selectedCell) {
              e.currentTarget.style.transform = 'scale(0.95)';
            }
          }}
          onMouseUp={(e) => {
            if (selectedCell) {
              e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
            }
          }}
        >
          {num}
        </button>
      ))}
      <button
        onClick={() => onNumberInput(0)}
        disabled={!selectedCell}
        style={{
          padding: '14px',
          fontSize: '16px',
          fontWeight: '700',
          background: selectedCell
            ? (darkMode
              ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, rgba(244, 114, 182, 0.8) 100%)'
              : 'linear-gradient(135deg, #ef4444 0%, #f472b6 100%)')
            : (darkMode
              ? 'rgba(75, 85, 99, 0.5)'
              : 'rgba(229, 231, 235, 0.7)'),
          color: selectedCell ? 'white' : (darkMode ? '#6b7280' : '#9ca3af'),
          border: selectedCell
            ? (darkMode
              ? '2px solid rgba(239, 68, 68, 0.5)'
              : '2px solid rgba(239, 68, 68, 0.3)')
            : 'none',
          borderRadius: '10px',
          cursor: selectedCell ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: selectedCell
            ? (darkMode
              ? '0 4px 16px rgba(239, 68, 68, 0.4)'
              : '0 4px 16px rgba(239, 68, 68, 0.3)')
            : 'none',
          transform: 'scale(1)',
          backdropFilter: !selectedCell ? 'blur(8px)' : 'none',
          WebkitBackdropFilter: !selectedCell ? 'blur(8px)' : 'none'
        }}
        onMouseEnter={(e) => {
          if (selectedCell) {
            e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
            e.currentTarget.style.boxShadow = darkMode
              ? '0 6px 20px rgba(239, 68, 68, 0.6)'
              : '0 6px 20px rgba(239, 68, 68, 0.5)';
          }
        }}
        onMouseLeave={(e) => {
          if (selectedCell) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = darkMode
              ? '0 4px 16px rgba(239, 68, 68, 0.4)'
              : '0 4px 16px rgba(239, 68, 68, 0.3)';
          }
        }}
        onMouseDown={(e) => {
          if (selectedCell) {
            e.currentTarget.style.transform = 'scale(0.95)';
          }
        }}
        onMouseUp={(e) => {
          if (selectedCell) {
            e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
          }
        }}
      >
        Clear
      </button>
    </div>
  );
}
