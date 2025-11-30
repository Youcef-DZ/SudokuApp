import { useState, useEffect, useCallback } from 'react';
import type { Board, CellPosition, Difficulty } from './types.ts';
import type { SudokuGameProps } from './types.ts';
import {
  generatePuzzle,
  checkSolution,
  isValidMove,
  copyBoard
} from './sudokuLogic.ts';
import { saveScoreToNotion } from './Database.ts';
import NumberPad from './NumberPad.tsx';
import Header from './Header.tsx';
import Leaderboard from './Leaderboard.tsx';

export default function SudokuGame(props: SudokuGameProps) {
  const {
    difficulty = 'medium',
    primaryColor = '#3b82f6',
    cellSize = 50,
    onLogin,
    onLogout,
    isAuthenticated = false,
    userName,
    darkMode = false,
    onToggleTheme
  } = props;

  const [solution, setSolution] = useState<Board>([]);
  const [currentBoard, setCurrentBoard] = useState<Board>([]);
  const [initialBoard, setInitialBoard] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [gameWon, setGameWon] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [puzzleId, setPuzzleId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

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

  const handleGameInit = useCallback((result: { puzzle: Board; solution: Board; id?: number }) => {
    setSolution(result.solution);
    setCurrentBoard(copyBoard(result.puzzle));
    setInitialBoard(copyBoard(result.puzzle));
    setPuzzleId(result.id);
    setSelectedCell(null);
    setErrors(new Set());
    setGameWon(false);
    setElapsedTime(0);
    setStartTime(Date.now());
    setLoading(false);
  }, []);

  const startNewGame = useCallback(async () => {
    setLoading(true);
    const result = await generatePuzzle(difficulty as Difficulty);
    handleGameInit(result);
  }, [difficulty, handleGameInit]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setLoading(true);
      const result = await generatePuzzle(difficulty as Difficulty);
      if (mounted) {
        handleGameInit(result);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [difficulty, handleGameInit]);

  // Save score when game is won
  useEffect(() => {
    if (gameWon) {
      const saveScore = async () => {
        const score = {
          userName: userName || 'Anonymous',
          time: elapsedTime,
          difficulty: difficulty,
          date: new Date().toISOString()
        };

        await saveScoreToNotion(score);
      };

      saveScore();
    }
  }, [gameWon, elapsedTime, userName, difficulty]);

  // Timer effect - updates every second
  useEffect(() => {
    if (gameWon) return; // Stop timer when game is won

    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, gameWon]);

  const handleCellClick = useCallback((row: number, col: number) => {
    setSelectedCell({ row, col });
  }, []);

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

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        background: darkMode
          ? 'linear-gradient(135deg, #1a0b2e 0%, #16213e 30%, #0f3443 60%, #0d3b3f 100%)'
          : 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 30%, #e0f7fa 60%, #e0f2f1 100%)',
        color: darkMode ? '#e2e8f0' : '#1e293b',
        fontFamily: '"Inter", sans-serif'
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          Loading
          <style>
            {`
              @keyframes ellipsis {
                0% { content: ''; }
                25% { content: '.'; }
                50% { content: '..'; }
                75% { content: '...'; }
                100% { content: ''; }
              }
              .loading-dots::after {
                content: '';
                animation: ellipsis 1.5s infinite;
                display: inline-block;
                width: 24px;
                text-align: left;
              }
            `}
          </style>
          <span className="loading-dots"></span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px',
      padding: '20px',
      background: darkMode
        ? 'linear-gradient(135deg, #1a0b2e 0%, #16213e 30%, #0f3443 60%, #0d3b3f 100%)'
        : 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 30%, #e0f7fa 60%, #e0f2f1 100%)',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      width: '100%',
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>

      {/* Container for header and game - constrained to game width */}
      <div style={{
        width: '100%',
        maxWidth: `${responsiveCellSize * 9 + 100}px`, // Grid width + padding for breathing room
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Header constrained to exact grid width */}
        <div style={{
          width: `${responsiveCellSize * 9 + 6}px`, // Exact grid width (9 cells + border + padding)
          margin: '0 auto'
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
            puzzleId={puzzleId}
            difficulty={difficulty}
            onShowLeaderboard={() => setShowLeaderboard(true)}
          />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(9, ${responsiveCellSize}px)`,
          gap: '0',
          background: darkMode ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: darkMode
            ? '2px solid rgba(99, 102, 241, 0.4)'
            : '2px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: darkMode
            ? '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.15)'
            : '0 12px 40px rgba(59, 130, 246, 0.18), 0 0 0 1px rgba(59, 130, 246, 0.12)',
          padding: '2px',
          width: 'fit-content',
          margin: '0 auto'
        }}>
          {currentBoard.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const selectedValue = selectedCell ? currentBoard[selectedCell.row][selectedCell.col] : 0;
              const isSameNumber = selectedValue !== 0 && cell === selectedValue;
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
                    fontWeight: isSameNumber ? '800' : (isInitial ? '700' : (isSelected ? '600' : '500')),
                    background: isSelected
                      ? (darkMode
                        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.35) 0%, rgba(56, 189, 248, 0.35) 100%)'
                        : 'linear-gradient(135deg, rgba(59, 130, 246, 0.18) 0%, rgba(14, 165, 233, 0.18) 100%)')
                      : hasError
                        ? (darkMode
                          ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%)'
                          : 'linear-gradient(135deg, rgba(254, 202, 202, 0.9) 0%, rgba(252, 231, 243, 0.9) 100%)')
                        : isRelated
                          ? (darkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(59, 130, 246, 0.07)')
                          : (darkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.8)')
                    ,
                    color: isSameNumber
                      ? (darkMode ? '#38bdf8' : '#0284c7')
                      : isInitial
                        ? (darkMode ? '#f1f5f9' : '#0f172a')
                        : hasError
                          ? (darkMode ? '#fca5a5' : '#dc2626')
                          : (darkMode ? '#a5b4fc' : '#2563eb'),
                    textShadow: isSameNumber
                      ? (darkMode ? '0 0 8px rgba(56, 189, 248, 0.5)' : '0 0 8px rgba(2, 132, 199, 0.3)')
                      : 'none',
                    cursor: 'pointer',
                    borderRight: isThickRight
                      ? (darkMode
                        ? '2px solid rgba(99, 102, 241, 0.5)'
                        : '2px solid rgba(59, 130, 246, 0.4)')
                      : `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.35)' : 'rgba(148, 163, 184, 0.4)'}`,
                    borderBottom: isThickBottom
                      ? (darkMode
                        ? '2px solid rgba(99, 102, 241, 0.5)'
                        : '2px solid rgba(59, 130, 246, 0.4)')
                      : `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.35)' : 'rgba(148, 163, 184, 0.4)'}`,
                    userSelect: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isSelected
                      ? (darkMode
                        ? '0 0 24px rgba(99, 102, 241, 0.5), inset 0 0 12px rgba(99, 102, 241, 0.15)'
                        : '0 0 20px rgba(59, 130, 246, 0.4), inset 0 2px 8px rgba(59, 130, 246, 0.08)')
                      : hasError
                        ? '0 0 14px rgba(239, 68, 68, 0.35)'
                        : !isInitial && 'hover'
                          ? '0 2px 8px rgba(0, 0, 0, 0.1)'
                          : 'none',
                    transform: isSelected ? 'scale(0.98)' : 'scale(1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isInitial) {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = darkMode
                        ? '0 4px 14px rgba(99, 102, 241, 0.35)'
                        : '0 4px 14px rgba(59, 130, 246, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isInitial) {
                      e.currentTarget.style.transform = isSelected ? 'scale(0.98)' : 'scale(1)';
                      e.currentTarget.style.boxShadow = isSelected
                        ? (darkMode
                          ? '0 0 24px rgba(99, 102, 241, 0.5), inset 0 0 12px rgba(99, 102, 241, 0.15)'
                          : '0 0 20px rgba(59, 130, 246, 0.4), inset 0 2px 8px rgba(59, 130, 246, 0.08)')
                        : hasError
                          ? '0 0 14px rgba(239, 68, 68, 0.35)'
                          : 'none';
                    }
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
          boardSize={responsiveCellSize * 9}
          darkMode={darkMode}
        />

        {gameWon && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100
          }}>
            <div style={{
              background: darkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              padding: '40px',
              borderRadius: '24px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
              border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
              backdropFilter: 'blur(10px)',
              maxWidth: '90%',
              width: '400px'
            }}>
              <h2 style={{
                fontSize: '32px',
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '800'
              }}>
                🎉 Puzzle Solved!
              </h2>
              <p style={{
                fontSize: '18px',
                color: darkMode ? '#cbd5e1' : '#475569',
                marginBottom: '8px'
              }}>
                Time: <span style={{ fontWeight: '700', color: darkMode ? '#fff' : '#0f172a' }}>{Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}</span>
              </p>
              <p style={{
                fontSize: '16px',
                color: darkMode ? '#94a3b8' : '#64748b',
                marginBottom: '32px'
              }}>
                Difficulty: <span style={{ textTransform: 'capitalize' }}>{difficulty}</span>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={startNewGame}
                  style={{
                    padding: '16px 32px',
                    fontSize: '18px',
                    fontWeight: '600',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Play Again
                </button>

                <button
                  onClick={() => setShowLeaderboard(true)}
                  style={{
                    padding: '16px 32px',
                    fontSize: '18px',
                    fontWeight: '600',
                    background: darkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.8)',
                    color: darkMode ? '#e2e8f0' : '#1e293b',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  View Leaderboard 🏆
                </button>
              </div>
            </div>
          </div>
        )}

        {showLeaderboard && (
          <Leaderboard
            darkMode={darkMode}
            onClose={() => setShowLeaderboard(false)}
            initialDifficulty={difficulty as 'easy' | 'medium' | 'hard'}
          />
        )}

        <div style={{
          width: '100%',
          maxWidth: boardSize,
          fontSize: `${Math.max(11, responsiveCellSize * 0.26)}px`,
          color: darkMode ? 'rgba(209, 213, 219, 0.8)' : 'rgba(107, 114, 128, 0.9)',
          textAlign: 'center',
          padding: '0 10px',
          fontWeight: '500',
          letterSpacing: '0.3px',
          margin: '0 auto'
        }}>
          💡 Click a cell and use keyboard (1-9) or number pad to fill
        </div>
      </div> {/* Close game container */}
    </div>
  );
}
