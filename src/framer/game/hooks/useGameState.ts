import { useState, useCallback } from 'react';
import type { Board, Difficulty } from '../../shared/types.ts';
import { generatePuzzle, checkSolution, isValidMove, copyBoard } from '../sudokuLogic.ts';

interface UseGameStateReturn {
    // State
    solution: Board;
    currentBoard: Board;
    initialBoard: Board;
    errors: Set<string>;
    gameWon: boolean;
    gameCompleted: boolean;
    loading: boolean;
    puzzleId: number | undefined;
    currentDifficulty: string;

    // Actions
    handleNumberInput: (num: number, selectedCell: { row: number; col: number } | null) => boolean;
    startNewGame: (newDifficulty?: string) => Promise<void>;
    initializeGame: (difficulty: Difficulty) => Promise<void>;
    setGameWon: (won: boolean) => void;
}

/**
 * Custom hook to manage core Sudoku game state and logic
 */
export function useGameState(initialDifficulty: string): UseGameStateReturn {
    const [solution, setSolution] = useState<Board>([]);
    const [currentBoard, setCurrentBoard] = useState<Board>([]);
    const [initialBoard, setInitialBoard] = useState<Board>([]);
    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [gameWon, setGameWon] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [puzzleId, setPuzzleId] = useState<number | undefined>(undefined);
    const [currentDifficulty, setCurrentDifficulty] = useState<string>(initialDifficulty);

    const handleGameInit = useCallback((result: { puzzle: Board; solution: Board; id?: number }) => {
        setSolution(result.solution);
        setCurrentBoard(copyBoard(result.puzzle));
        setInitialBoard(copyBoard(result.puzzle));
        setPuzzleId(result.id);
        setErrors(new Set());
        setGameWon(false);
        setGameCompleted(false);
        setLoading(false);
    }, []);

    const initializeGame = useCallback(async (difficulty: Difficulty) => {
        setLoading(true);
        setCurrentDifficulty(difficulty);
        const result = await generatePuzzle(difficulty);
        handleGameInit(result);
    }, [handleGameInit]);

    const startNewGame = useCallback(async (newDifficulty?: string) => {
        setLoading(true);
        const targetDifficulty = (newDifficulty || currentDifficulty) as Difficulty;
        setCurrentDifficulty(targetDifficulty);
        const result = await generatePuzzle(targetDifficulty);
        handleGameInit(result);
    }, [currentDifficulty, handleGameInit]);

    const handleNumberInput = useCallback((num: number, selectedCell: { row: number; col: number } | null): boolean => {
        if (!selectedCell) return false;
        const { row, col } = selectedCell;
        if (initialBoard[row][col] !== 0) return false;

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

        // Check if puzzle is solved
        if (checkSolution(newBoard, solution)) {
            setGameWon(true);
            setGameCompleted(true);
            return true; // Puzzle solved
        }

        return false;
    }, [initialBoard, currentBoard, errors, solution]);

    return {
        solution,
        currentBoard,
        initialBoard,
        errors,
        gameWon,
        gameCompleted,
        loading,
        puzzleId,
        currentDifficulty,
        handleNumberInput,
        startNewGame,
        initializeGame,
        setGameWon
    };
}
