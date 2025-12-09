import { useState, useEffect, useRef } from 'react';
import type { SudokuGameProps } from '../shared/types.ts';
import NumberPad from '../components/NumberPad.tsx';
import Header from '../components/Header.tsx';
import Leaderboard from '../components/Leaderboard.tsx';
import ScoresDb, { useScoresStore } from '../data/Database.tsx';
import { getNotionDataPrimaryDbId } from '../data/NotionHook.tsx';
import { getTheme } from '../shared/theme.ts';
import { useGameState } from './hooks/useGameState.ts';
import { useCellSelection } from './hooks/useCellSelection.ts';
import { useTimer } from './hooks/useTimer.ts';

export default function SudokuGame(props: SudokuGameProps) {
  const {
    difficulty = 'medium',
    primaryColor = '#3b82f6',
    cellSize = 50,
    onLogin,
    onLogout,
    isAuthenticated = false,
    userName,
    userEmail,
    darkMode = false,
    onToggleTheme
  } = props;

  const theme = getTheme(darkMode);

  // Custom hooks for game logic
  const gameState = useGameState(difficulty);
  const cellSelection = useCellSelection();
  const timer = useTimer();

  // UI state
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [responsiveCellSize, setResponsiveCellSize] = useState(cellSize);

  // Get handleCreate from ScoresDb hook for saving scores
  const [scoresStore] = useScoresStore();
  const handleCreate = scoresStore?.handleCreate;
  const notionData = scoresStore?.notionData;

  // Track if we've already saved the score for this game
  const scoreSavedRef = useRef(false);

  // Responsive cell size based on screen width
  useEffect(() => {
    const updateCellSize = () => {
      const maxWidth = window.innerWidth - 40;
      const maxHeight = window.innerHeight - 300;
      const maxBoardSize = Math.min(maxWidth, maxHeight);
      const calculatedCellSize = Math.floor(maxBoardSize / 9);
      const finalCellSize = Math.min(calculatedCellSize, cellSize);
      setResponsiveCellSize(Math.max(30, finalCellSize));
    };

    updateCellSize();
    window.addEventListener('resize', updateCellSize);
    return () => window.removeEventListener('resize', updateCellSize);
  }, [cellSize]);

  // Initialize game on mount
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      await gameState.initializeGame(difficulty as any);
      if (mounted) {
        timer.resetTimer();
        scoreSavedRef.current = false;
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [difficulty]);

  // Stop timer when game is completed
  useEffect(() => {
    if (gameState.gameCompleted) {
      timer.stopTimer();
    }
  }, [gameState.gameCompleted]);

  // Save score when game is won (only once)
  useEffect(() => {
    if (gameState.gameWon && handleCreate && notionData && !scoreSavedRef.current) {
      console.log('Saving score. UserName:', userName);
      const dbId = getNotionDataPrimaryDbId(notionData);
      if (!dbId) return;

      const scoreData = {
        DATABASE_ID: dbId,
        PROPERTIES: {
          Name: {
            TYPE: 'title',
            VALUE: userName || 'Anonymous'
          },
          Time: {
            TYPE: 'number',
            VALUE: timer.elapsedTime
          },
          Difficulty: {
            TYPE: 'select',
            VALUE: gameState.currentDifficulty.charAt(0).toUpperCase() + gameState.currentDifficulty.slice(1)
          },
          Date: {
            TYPE: 'rich_text',
            VALUE: new Date().toISOString()
          }
        }
      };

      handleCreate(scoreData);
      scoreSavedRef.current = true;
      console.log('Score saved to Notion!');
    }
  }, [gameState.gameWon, handleCreate, notionData, timer.elapsedTime, userName, gameState.currentDifficulty]);

  // Handle number input
  const handleNumberInput = (num: number) => {
    const isPuzzleSolved = gameState.handleNumberInput(num, cellSelection.selectedCell);
    // No need to do anything special here - gameState will update gameWon/gameCompleted
  };

  // Keyboard event listener
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!cellSelection.selectedCell) return;
      cellSelection.handleKeyPress(e, handleNumberInput);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [cellSelection.selectedCell, cellSelection.handleKeyPress, handleNumberInput]);

  // Handle new game
  const handleNewGame = async (newDifficulty?: string) => {
    await gameState.startNewGame(newDifficulty);
    timer.resetTimer();
    scoreSavedRef.current = false;
  };

  const boardSize = responsiveCellSize * 9;

  if (gameState.loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        background: theme.gradients.background,
        color: theme.colors.text,
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
      gap: theme.spacing.lg,
      padding: '20px',
      background: theme.gradients.background,
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      width: '100%',
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      {/* Initialize ScoresDb hook for saving scores */}
      <ScoresDb />

      {/* Container for header and game - constrained to game width */}
      <div style={{
        width: '100%',
        maxWidth: `${responsiveCellSize * 9 + 100}px`,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Header - allow full width for buttons */}
        <div style={{
          width: '100%',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
          pointerEvents: 'auto'
        }}>
          <Header
            onNewGame={handleNewGame}
            onLogin={onLogin}
            onLogout={onLogout}
            primaryColor={primaryColor}
            responsiveCellSize={responsiveCellSize}
            isAuthenticated={isAuthenticated}
            userName={userName}
            userEmail={userEmail}
            elapsedTime={timer.elapsedTime}
            darkMode={darkMode}
            onToggleTheme={onToggleTheme}
            puzzleId={gameState.puzzleId}
            difficulty={gameState.currentDifficulty}
            onShowLeaderboard={() => setShowLeaderboard(true)}
          />
        </div>

        {/* Sudoku Board */}
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
          {gameState.currentBoard.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const selectedValue = cellSelection.selectedCell ? gameState.currentBoard[cellSelection.selectedCell.row][cellSelection.selectedCell.col] : 0;
              const isSameNumber = selectedValue !== 0 && cell === selectedValue;
              const isInitial = gameState.initialBoard[rowIndex]?.[colIndex] !== 0;
              const isSelected = cellSelection.selectedCell?.row === rowIndex && cellSelection.selectedCell?.col === colIndex;
              const hasError = gameState.errors.has(`${rowIndex}-${colIndex}`);
              const isThickRight = (colIndex + 1) % 3 === 0 && colIndex !== 8;
              const isThickBottom = (rowIndex + 1) % 3 === 0 && rowIndex !== 8;

              const isRelated = cellSelection.selectedCell && !isSelected && (
                cellSelection.selectedCell.row === rowIndex ||
                cellSelection.selectedCell.col === colIndex ||
                (Math.floor(cellSelection.selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
                  Math.floor(cellSelection.selectedCell.col / 3) === Math.floor(colIndex / 3))
              );

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => cellSelection.handleCellClick(rowIndex, colIndex)}
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
          selectedCell={cellSelection.selectedCell}
          onNumberInput={handleNumberInput}
          boardSize={responsiveCellSize * 9}
          darkMode={darkMode}
        />

        {gameState.gameWon && (
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
              width: '400px',
              position: 'relative'
            }}>
              {/* Close button */}
              <button
                onClick={() => gameState.setGameWon(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  color: darkMode ? '#94a3b8' : '#64748b',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  lineHeight: '1',
                  transition: 'color 0.2s',
                  fontWeight: '300'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = darkMode ? '#fff' : '#000'}
                onMouseLeave={(e) => e.currentTarget.style.color = darkMode ? '#94a3b8' : '#64748b'}
                aria-label="Close"
              >
                ✕
              </button>

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
                Time: <span style={{ fontWeight: '700', color: darkMode ? '#fff' : '#0f172a' }}>{Math.floor(timer.elapsedTime / 60)}:{(timer.elapsedTime % 60).toString().padStart(2, '0')}</span>
              </p>
              <p style={{
                fontSize: '16px',
                color: darkMode ? '#94a3b8' : '#64748b',
                marginBottom: '32px'
              }}>
                Difficulty: <span style={{ textTransform: 'capitalize' }}>{gameState.currentDifficulty}</span>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={() => handleNewGame()}
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
                    background: darkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249,  0.8)',
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
            initialDifficulty={gameState.currentDifficulty as 'easy' | 'medium' | 'hard'}
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
      </div>
    </div>
  );
}
