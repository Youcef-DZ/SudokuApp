import { getTheme, createButtonStyle } from '../shared/theme';

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
  const theme = getTheme(darkMode);
  const buttonStyle = createButtonStyle(theme, !!selectedCell);
  const clearButtonStyle = createButtonStyle(theme, !!selectedCell, 'error');
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
          style={buttonStyle}
          onMouseEnter={(e) => {
            if (selectedCell) {
              e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
              e.currentTarget.style.boxShadow = theme.shadows.buttonHover;
            }
          }}
          onMouseLeave={(e) => {
            if (selectedCell) {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = theme.shadows.button;
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
        style={{ ...clearButtonStyle, fontSize: '16px' }}
        onMouseEnter={(e) => {
          if (selectedCell) {
            e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
            e.currentTarget.style.boxShadow = theme.shadows.buttonHover;
          }
        }}
        onMouseLeave={(e) => {
          if (selectedCell) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = theme.shadows.button;
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
