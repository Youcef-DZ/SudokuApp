/**
 * Custom React Hook for Sudoku Game Logic
 * Manages game state and interactions
 */

import { useState, useEffect, useCallback } from 'react';
import type { Board, CellPosition, Difficulty } from '../types';
import {
  generatePuzzle,
  checkSolution,
  isValidMove,
  copyBoard
} from '../logic/sudokuLogic';

export const useSudokuGame = (difficulty: Difficulty) => {
  const [puzzle, setPuzzle] = useState<Board>([]);
  const [solution, setSolution] = useState<Board>([]);
  const [currentBoard, setCurrentBoard] = useState<Board>([]);
  const [initialBoard, setInitialBoard] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [gameWon, setGameWon] = useState(false);

  const startNewGame = useCallback(() => {
    const { puzzle: newPuzzle, solution: newSolution } = generatePuzzle(difficulty);
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

  return {
    currentBoard,
    initialBoard,
    selectedCell,
    errors,
    gameWon,
    startNewGame,
    handleCellClick,
    handleNumberInput
  };
};
