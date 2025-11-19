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
import Header from './Header.tsx';

export default function SudokuGame(props: SudokuGameProps) {
  const {
    difficulty = 'medium',
    primaryColor = '#3b82f6',
    gridColor: gridColorProp,
    errorColor = '#ef4444',
    successColor = '#10b981',
    cellSize = 50,
    onLogin,
    onLogout,
    isAuthenticated = false,
    userName,
    darkMode = false,
    onToggleTheme
  } = props;

  // Dark mode colors
  const gridColor = gridColorProp || (darkMode ? '#4b5563' : '#e5e7eb');
  const cellBg = darkMode ? '#374151' : 'white';
  const cellBgSelected = darkMode ? '#1e3a5f' : '#dbeafe';
  const cellBgError = darkMode ? '#7f1d1d' : '#fee2e2';
  const cellBgRelated = darkMode ? '#2d3748' : '#f0f4ff';
  const cellBorder = darkMode ? '#4b5563' : '#f3f4f6';
  const textColor = darkMode ? '#f9fafb' : '#1f2937';
  const textColorLight = darkMode ? '#9ca3af' : '#6b7280';
  const userNumberColor = darkMode ? '#60a5fa' : primaryColor; // Softer blue for user numbers in dark mode
  const userErrorColor = darkMode ? '#f87171' : errorColor; // Softer red for errors in dark mode

  const [solution, setSolution] = useState<Board>([]);
  const [currentBoard, setCurrentBoard] = useState<Board>([]);
  const [initialBoard, setInitialBoard] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [gameWon, setGameWon] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [startTime, setStartTime] = useState<number>(Date.now());

  // Responsive cell size based on screen width
  const [responsiveCellSize, setResponsiveCellSize] = useState(cellSize);

  useEffect(() => {
    const updateCellSize = () => {
      const maxWidth = window.innerWidth - 40; // 20px padding each side
      const maxHeight = window.innerHeight - 300; // Leave room for header, numberpad, etc
      const maxBoardSize = Math.min(maxWidth, maxHeight);
      const calculatedCellSize = Math.floor(maxBoardSize / 9);
      const finalCellSize = Math.min(calculatedCellSize, cellSize); // Don't exceed prop cellSize
      setResponsiveCellSize(Math.max(30, finalCellSize)); // Minimum 30px
    };

    updateCellSize();
    window.addEventListener('resize', updateCellSize);
    return () => window.removeEventListener('resize', updateCellSize);
  }, [cellSize]);

  const startNewGame = useCallback(async () => {
    const { puzzle: newPuzzle, solution: newSolution } = await generatePuzzle(difficulty as Difficulty);
    setSolution(newSolution);
    setCurrentBoard(copyBoard(newPuzzle));
    setInitialBoard(copyBoard(newPuzzle));
    setSelectedCell(null);
    setErrors(new Set());
    setGameWon(false);
    setElapsedTime(0);
    setStartTime(Date.now());
  }, [difficulty]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Timer effect - updates every second
  useEffect(() => {
    if (gameWon) return; // Stop timer when game is won

    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, gameWon]);

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

  const boardSize = responsiveCellSize * 9;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      padding: '20px',
      backgroundColor: darkMode ? '#111827' : '#f3f4f6',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      width: '100%',
      minHeight: '100%',
      boxSizing: 'border-box'
    }}>

      <Header 
        onNewGame={startNewGame}
        onLogin={onLogin}
        onLogout={onLogout}
        primaryColor={primaryColor}
        responsiveCellSize={responsiveCellSize}
        isAuthenticated={isAuthenticated}
        userName={userName}
        elapsedTime={elapsedTime}
        darkMode={darkMode}
        onToggleTheme={onToggleTheme}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(9, ${responsiveCellSize}px)`,
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
            
            // Check if cell is in same row, column, or 3x3 box as selected cell
            const isRelated = selectedCell && !isSelected && (
              selectedCell.row === rowIndex || // Same row
              selectedCell.col === colIndex || // Same column
              (Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) && 
               Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3)) // Same 3x3 box
            );

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                style={{
                  width: responsiveCellSize,
                  height: responsiveCellSize,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: `${Math.max(14, responsiveCellSize * 0.4)}px`,
                  fontWeight: isInitial ? '700' : '400',
                  backgroundColor: isSelected ? cellBgSelected : hasError ? cellBgError : isRelated ? cellBgRelated : cellBg,
                  color: isInitial ? textColor : hasError ? userErrorColor : userNumberColor,
                  cursor: isInitial ? 'default' : 'pointer',
                  borderRight: isThickRight ? `2px solid ${gridColor}` : `1px solid ${cellBorder}`,
                  borderBottom: isThickBottom ? `2px solid ${gridColor}` : `1px solid ${cellBorder}`,
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
        boardSize={responsiveCellSize * 9}
        darkMode={darkMode}
      />

      {gameWon && (
        <div style={{
          padding: `${Math.max(12, responsiveCellSize * 0.32)}px ${Math.max(18, responsiveCellSize * 0.48)}px`,
          backgroundColor: successColor,
          color: 'white',
          borderRadius: '8px',
          fontSize: `${Math.max(14, responsiveCellSize * 0.36)}px`,
          fontWeight: '600',
          textAlign: 'center'
        }}>
          🎉 Congratulations! You solved it in {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}!
        </div>
      )}

      <div style={{
        width: '100%',
        maxWidth: boardSize,
        fontSize: `${Math.max(10, responsiveCellSize * 0.24)}px`,
        color: textColorLight,
        textAlign: 'center',
        padding: '0 10px'
      }}>
        Click a cell and use keyboard (1-9) or number pad to fill.
      </div>
    </div>
  );
}
