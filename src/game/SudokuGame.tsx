import { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Pressable, Modal, Dimensions, Text } from 'react-native';
import styled from 'styled-components/native';
// import * as Haptics from 'expo-haptics'; // Breaks React Native Web
import type { SudokuGameProps } from '../shared/types.ts';
import NumberPad from '../components/NumberPad';
import Header from '../components/Header';
import Leaderboard from '../components/Leaderboard';

import { useGameState } from './hooks/useGameState.ts';
import { useCellSelection } from './hooks/useCellSelection.ts';
import { useTimer } from './hooks/useTimer.ts';
import type { ScoreData } from '../data/Database.tsx';

const Container = styled.View<{ darkMode: boolean }>`
  flex: 1;
  background-color: ${props => props.darkMode ? '#1e293b' : '#f3f4f6'};
  align-items: center;
  padding: 20px;
`;

const GameBoard = styled.View<{ boardSize: number; darkMode: boolean }>`
  width: ${props => props.boardSize}px;
  border-radius: 16px;
  overflow: hidden;
  background-color: ${props => props.darkMode ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.85)'};
  border-width: 2px;
  border-color: ${props => props.darkMode ? 'rgba(99, 102, 241, 0.4)' : 'rgba(59, 130, 246, 0.3)'};
  padding: 2px;
`;

const Row = styled.View`
  flex-direction: row;
`;

const Cell = styled(Pressable) <{
    cellSize: number;
    isSelected: boolean;
    hasError: boolean;
    isRelated: boolean;
    isInitial: boolean;
    isSameNumber: boolean;
    darkMode: boolean;
    isThickRight: boolean;
    isThickBottom: boolean;
}>`
  width: ${props => props.cellSize}px;
  height: ${props => props.cellSize}px;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
        props.isSelected
            ? (props.darkMode ? 'rgba(99, 102, 241, 0.35)' : 'rgba(59, 130, 246, 0.18)')
            : props.hasError
                ? (props.darkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(254, 202, 202, 0.9)')
                : props.isRelated
                    ? (props.darkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(59, 130, 246, 0.07)')
                    : (props.darkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.8)')
    };
  border-right-width: ${props => props.isThickRight ? 2 : 1}px;
  border-right-color: ${props =>
        props.isThickRight
            ? (props.darkMode ? 'rgba(99, 102, 241, 0.5)' : 'rgba(59, 130, 246, 0.4)')
            : (props.darkMode ? 'rgba(71, 85, 105, 0.35)' : 'rgba(148, 163, 184, 0.4)')
    };
  border-bottom-width: ${props => props.isThickBottom ? 2 : 1}px;
  border-bottom-color: ${props =>
        props.isThickBottom
            ? (props.darkMode ? 'rgba(99, 102, 241, 0.5)' : 'rgba(59, 130, 246, 0.4)')
            : (props.darkMode ? 'rgba(71, 85, 105, 0.35)' : 'rgba(148, 163, 184, 0.4)')
    };
`;

const CellText = styled.Text<{
    cellSize: number;
    isSelected: boolean;
    hasError: boolean;
    isInitial: boolean;
    isSameNumber: boolean;
    darkMode: boolean;
}>`
  font-size: ${props => Math.max(14, props.cellSize * 0.4)}px;
  font-weight: ${props => props.isSameNumber ? '800' : (props.isInitial ? '700' : (props.isSelected ? '600' : '500'))};
  color: ${props =>
        props.isSameNumber
            ? (props.darkMode ? '#38bdf8' : '#0284c7')
            : props.isInitial
                ? (props.darkMode ? '#f1f5f9' : '#0f172a')
                : props.hasError
                    ? (props.darkMode ? '#fca5a5' : '#dc2626')
                    : (props.darkMode ? '#a5b4fc' : '#2563eb')
    };
`;

const WinModal = styled(Modal)``;

const WinContainer = styled.View<{ darkMode: boolean }>`
  flex: 1;
  background-color: ${props => props.darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  align-items: center;
  justify-content: center;
`;

const WinContent = styled.View<{ darkMode: boolean }>`
  background-color: ${props => props.darkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  padding: 40px;
  border-radius: 24px;
  width: 90%;
  max-width: 400px;
  align-items: center;
`;

const WinTitle = styled.Text`
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 16px;
  text-align: center;
`;

const WinText = styled.Text<{ darkMode: boolean }>`
  font-size: 18px;
  color: ${props => props.darkMode ? '#cbd5e1' : '#475569'};
  margin-bottom: 8px;
  text-align: center;
`;

const WinButton = styled(Pressable) <{ primary?: boolean; darkMode: boolean }>`
  padding: 16px 32px;
  border-radius: 12px;
  width: 100%;
  margin-top: 12px;
  background-color: ${props =>
        props.primary
            ? '#3b82f6'
            : (props.darkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.8)')
    };
  align-items: center;
`;

const WinButtonText = styled.Text<{ primary?: boolean; darkMode: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: ${props =>
        props.primary
            ? '#ffffff'
            : (props.darkMode ? '#e2e8f0' : '#1e293b')
    };
`;

const LoadingContainer = styled.View<{ darkMode: boolean }>`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.darkMode ? '#1e293b' : '#f3f4f6'};
`;

const LoadingText = styled.Text<{ darkMode: boolean }>`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.darkMode ? '#f1f5f9' : '#0f172a'};
`;

const HintText = styled.Text<{ cellSize: number; darkMode: boolean }>`
  font-size: ${props => Math.max(11, props.cellSize * 0.26)}px;
  color: ${props => props.darkMode ? 'rgba(209, 213, 219, 0.8)' : 'rgba(107, 114, 128, 0.9)'};
  text-align: center;
  padding: 10px;
  font-weight: 500;
  letter-spacing: 0.3px;
  margin-top: 20px;
`;

export default function SudokuGame(props: SudokuGameProps) {
    const {
        difficulty = 'medium',
        cellSize = 50,
        onLogin,
        onLogout,
        onNewGame,
        isAuthenticated = false,
        userName,
        userEmail,
        darkMode = false,
        onToggleTheme
    } = props;

    const gameState = useGameState(difficulty);
    const cellSelection = useCellSelection();
    const timer = useTimer();

    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [scores, setScores] = useState<ScoreData[]>([]);
    const [loadingScores, setLoadingScores] = useState(false);
    const [scoreFilter, setScoreFilter] = useState<'easy' | 'medium' | 'hard'>(difficulty);
    const [responsiveCellSize, setResponsiveCellSize] = useState(cellSize);
    const scoreSavedRef = useRef(false);

    // Calculate responsive cell size
    useEffect(() => {
        const { width, height } = Dimensions.get('window');
        // More aggressive sizing for mobile - leave less space for controls
        const maxWidth = width - 60;  // 30px padding on each side
        const maxHeight = height - 300;  // Space for header, number pad, margins
        const maxBoardSize = Math.min(maxWidth, maxHeight);
        const calculatedCellSize = Math.floor(maxBoardSize / 9);
        // Clamp between 28 and 50px
        const finalCellSize = Math.min(Math.max(calculatedCellSize, 28), 50);
        setResponsiveCellSize(finalCellSize);
    }, [cellSize]);

    // Initialize game
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
        return () => { mounted = false; };
    }, [difficulty]);

    // Stop timer when game is completed
    useEffect(() => {
        if (gameState.gameCompleted) {
            timer.stopTimer();
        }
    }, [gameState.gameCompleted]);

    // API Base URL for mobile development
    const getApiBaseUrl = () => {
        if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
            if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                return '';
            }
        }
        return process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';
    };
    const API_BASE_URL = getApiBaseUrl();

    // Fetch scores when leaderboard is opened
    useEffect(() => {
        if (showLeaderboard && scores.length === 0) {
            setLoadingScores(true);
            fetch(`${API_BASE_URL}/api/scores`)
                .then(res => res.json())
                .then(data => {
                    setScores(data);
                    setLoadingScores(false);
                })
                .catch(err => {
                    console.error('Failed to fetch scores:', err);
                    setLoadingScores(false);
                });
        }
    }, [showLeaderboard]);

    const handleNumberInput = (num: number) => {
        // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        gameState.handleNumberInput(num, cellSelection.selectedCell);
    };

    const handleCellPress = (row: number, col: number) => {
        // Haptics.selectionAsync();
        cellSelection.handleCellClick(row, col);
    };

    const boardSize = responsiveCellSize * 9;

    if (gameState.loading) {
        return (
            <LoadingContainer darkMode={darkMode}>
                <LoadingText darkMode={darkMode}>Loading...</LoadingText>
            </LoadingContainer>
        );
    }

    if (gameState.initializationError) {
        return (
            <LoadingContainer darkMode={darkMode}>
                <LoadingText darkMode={darkMode} style={{ color: '#ef4444', marginBottom: 20 }}>
                    Error: {gameState.initializationError}
                </LoadingText>
                <WinButton
                    darkMode={darkMode}
                    onPress={() => gameState.initializeGame(difficulty as any)}
                    primary
                >
                    <WinButtonText darkMode={darkMode} primary>Retry</WinButtonText>
                </WinButton>
            </LoadingContainer>
        );
    }

    return (
        <Container darkMode={darkMode}>
            <ScrollView
                contentContainerStyle={{
                    alignItems: 'center',
                    paddingVertical: 20,
                }}
                showsVerticalScrollIndicator={false}
            >
                <View key="header-section" style={{ width: '100%', alignItems: 'center' }}>
                    <Header
                        onNewGame={onNewGame}
                        onLogin={onLogin}
                        onLogout={onLogout}
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

                    <View key="gameboard-section" style={{ marginTop: 20, alignItems: 'center' }}>
                        <GameBoard boardSize={boardSize} darkMode={darkMode}>
                            {gameState.currentBoard.map((row, rowIndex) => (
                                <Row key={rowIndex}>
                                    {row.map((cell, colIndex) => {
                                        const selectedValue = cellSelection.selectedCell
                                            ? gameState.currentBoard[cellSelection.selectedCell.row][cellSelection.selectedCell.col]
                                            : 0;
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
                                            <Cell
                                                key={`${rowIndex}-${colIndex}`}
                                                testID={`cell-${rowIndex}-${colIndex}`}
                                                onPress={() => handleCellPress(rowIndex, colIndex)}
                                                cellSize={responsiveCellSize}
                                                isSelected={isSelected}
                                                hasError={hasError}
                                                isRelated={!!isRelated}
                                                isInitial={isInitial}
                                                isSameNumber={isSameNumber}
                                                darkMode={darkMode}
                                                isThickRight={isThickRight}
                                                isThickBottom={isThickBottom}
                                            >
                                                <CellText
                                                    cellSize={responsiveCellSize}
                                                    isSelected={isSelected}
                                                    hasError={hasError}
                                                    isInitial={isInitial}
                                                    isSameNumber={isSameNumber}
                                                    darkMode={darkMode}
                                                >
                                                    {cell !== 0 ? cell : ''}
                                                </CellText>
                                            </Cell>
                                        );
                                    })}
                                </Row>
                            ))}
                        </GameBoard>
                    </View>

                    <View key="numberpad-section" style={{ marginTop: 20 }}>
                        <NumberPad
                            selectedCell={cellSelection.selectedCell}
                            onNumberInput={handleNumberInput}
                            boardSize={boardSize}
                            darkMode={darkMode}
                        />
                    </View>

                    <HintText key="hint-text" cellSize={responsiveCellSize} darkMode={darkMode}>
                        💡 Tap a cell and use the number pad to fill
                    </HintText>
                </View>
            </ScrollView>

            {/* Win Modal */}
            <WinModal
                visible={gameState.gameWon}
                transparent
                animationType="fade"
                onRequestClose={() => gameState.setGameWon(false)}
            >
                <WinContainer darkMode={darkMode}>
                    <WinContent darkMode={darkMode}>
                        <WinTitle>🎉 Puzzle Solved!</WinTitle>
                        <WinText darkMode={darkMode}>
                            Time: {Math.floor(timer.elapsedTime / 60)}:{(timer.elapsedTime % 60).toString().padStart(2, '0')}
                        </WinText>
                        <WinText darkMode={darkMode}>
                            Difficulty: {gameState.currentDifficulty}
                        </WinText>

                        <WinButton
                            primary
                            darkMode={darkMode}
                            onPress={() => {
                                gameState.setGameWon(false);
                                onNewGame?.();
                            }}
                        >
                            <WinButtonText primary darkMode={darkMode}>
                                Play Again
                            </WinButtonText>
                        </WinButton>

                        <WinButton
                            darkMode={darkMode}
                            onPress={() => {
                                gameState.setGameWon(false);
                                setShowLeaderboard(true);
                            }}
                        >
                            <WinButtonText darkMode={darkMode}>
                                View Leaderboard 🏆
                            </WinButtonText>
                        </WinButton>
                    </WinContent>
                </WinContainer>
            </WinModal>

            {/* Leaderboard Modal */}
            <WinModal
                visible={showLeaderboard}
                transparent
                animationType="fade"
                onRequestClose={() => setShowLeaderboard(false)}
            >
                <WinContainer darkMode={darkMode}>
                    <WinContent darkMode={darkMode}>
                        <WinTitle key="title">🏆 Leaderboard</WinTitle>

                        <Leaderboard
                            key="leaderboard"
                            scores={scores}
                            loading={loadingScores}
                            difficulty={scoreFilter}
                            onDifficultyChange={setScoreFilter}
                            darkMode={darkMode}
                        />

                        <WinButton
                            key="close-btn"
                            primary
                            darkMode={darkMode}
                            onPress={() => setShowLeaderboard(false)}
                        >
                            <WinButtonText primary darkMode={darkMode}>
                                Close
                            </WinButtonText>
                        </WinButton>
                    </WinContent>
                </WinContainer>
            </WinModal>
        </Container>
    );
}
