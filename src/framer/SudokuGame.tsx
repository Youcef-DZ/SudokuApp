import { useState, useEffect, useCallback } from 'react';
import type { Board, CellPosition, Difficulty } from './types.ts';
import type { SudokuGameProps } from './types.ts';
import {
  generatePuzzle,
  checkSolution,
  isValidMove,
  copyBoard
} from './sudokuLogic.ts';
import NumberPad from './NumberPad.tsx';

export default function SudokuGame(props: SudokuGameProps) {
  const {
    difficulty = 'medium',
    primaryColor = '#3b82f6',
    backgroundColor = '#ffffff',
    gridColor = '#e5e7eb',
    errorColor = '#ef4444',
    successColor = '#10b981',
    cellSize = 50
  } = props;

  const [, setPuzzle] = useState<Board>([]);
  const [solution, setSolution] = useState<Board>([]);
  const [currentBoard, setCurrentBoard] = useState<Board>([]);
  const [initialBoard, setInitialBoard] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [gameWon, setGameWon] = useState(false);

  const startNewGame = useCallback(async () => {
    const { puzzle: newPuzzle, solution: newSolution } = await generatePuzzle(difficulty as Difficulty);
    setPuzzle(newPuzzle);
    setSolution(newSolution);
    setCurrentBoard(copyBoard(newPuzzle));
    setInitialBoard(copyBoard(newPuzzle));
    setSelectedCell(null);
    setErrors(new Set());
    setGameWon(false);
  }, [difficulty]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (initialBoard[row]?.[col] !== 0) return;
    setSelectedCell({ row, col });
  }, [initialBoard]);

  const handleNumberInput = useCallback((num: number) => {
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
  }, [selectedCell, initialBoard, currentBoard, errors, solution]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!selectedCell) return;
    const num = parseInt(e.key);
    if (num >= 1 && num <= 9) {
      handleNumberInput(num);
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
      handleNumberInput(0);
    }
  }, [selectedCell, handleNumberInput]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

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

      <NumberPad
        selectedCell={selectedCell}
        onNumberInput={handleNumberInput}
        primaryColor={primaryColor}
        errorColor={errorColor}
        boardSize={boardSize}
      />

      {gameWon && (
        <div style={{
          padding: '16px 24px',
          backgroundColor: successColor,
          color: 'white',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Congratulations! You solved it!
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

/* Framer property controls - uncomment when uploading to Framer
import { addPropertyControls, ControlType } from 'framer';

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
*/
