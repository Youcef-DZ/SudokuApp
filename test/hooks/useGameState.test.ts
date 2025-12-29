import { renderHook, act } from '@testing-library/react-hooks';
import { useGameState } from '../../src/game/hooks/useGameState';
import * as SudokuLogic from '../../src/game/sudokuLogic';

// Mock the sudokuLogic dependencies
jest.mock('../../src/game/sudokuLogic', () => ({
    generatePuzzle: jest.fn(),
    checkSolution: jest.fn(),
    isValidMove: jest.fn(),
    copyBoard: jest.fn((board) => JSON.parse(JSON.stringify(board))),
}));

describe('useGameState', () => {
    const mockBoard = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];

    const mockSolution = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];

    const mockInitResult = {
        puzzle: mockBoard,
        solution: mockSolution,
        id: 123
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (SudokuLogic.generatePuzzle as jest.Mock).mockResolvedValue(mockInitResult);
        (SudokuLogic.isValidMove as jest.Mock).mockReturnValue(true);
        (SudokuLogic.checkSolution as jest.Mock).mockReturnValue(false);
    });

    it('should initialize game state correctly', async () => {
        const { result } = renderHook(() => useGameState('easy'));

        // Initially loading (default state)
        expect(result.current.loading).toBe(true);

        // Triggers async init
        await act(async () => {
            await result.current.initializeGame('easy');
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.currentBoard).toEqual(mockBoard);
        expect(result.current.initialBoard).toEqual(mockBoard);
        expect(result.current.solution).toEqual(mockSolution);
        expect(result.current.puzzleId).toBe(123);
        expect(result.current.currentDifficulty).toBe('easy');
    });

    it('should handle valid number input', async () => {
        const { result } = renderHook(() => useGameState('easy'));

        await act(async () => {
            await result.current.initializeGame('easy');
        });

        act(() => {
            // Enter '4' at [0, 2]
            const success = result.current.handleNumberInput(4, { row: 0, col: 2 });
            expect(success).toBe(false); // Not won yet
        });

        expect(result.current.currentBoard[0][2]).toBe(4);
        expect(result.current.errors.size).toBe(0);
    });

    it('should initialize errors set when invalid move made', async () => {
        (SudokuLogic.isValidMove as jest.Mock).mockReturnValue(false);
        const { result } = renderHook(() => useGameState('easy'));

        await act(async () => {
            await result.current.initializeGame('easy');
        });

        act(() => {
            result.current.handleNumberInput(9, { row: 0, col: 2 });
        });

        expect(result.current.errors.has('0-2')).toBe(true);
    });

    it('should not update board if cell is pre-filled', async () => {
        const { result } = renderHook(() => useGameState('easy'));

        await act(async () => {
            await result.current.initializeGame('easy');
        });

        const initialValue = mockBoard[0][0]; // 5

        act(() => {
            result.current.handleNumberInput(9, { row: 0, col: 0 });
        });

        expect(result.current.currentBoard[0][0]).toBe(initialValue);
    });

    it('should reset game when startNewGame is called', async () => {
        const { result } = renderHook(() => useGameState('easy'));

        await act(async () => {
            await result.current.initializeGame('easy');
        });

        // Make a move
        act(() => {
            result.current.handleNumberInput(4, { row: 0, col: 2 });
        });
        expect(result.current.currentBoard[0][2]).toBe(4);

        // Start new game
        await act(async () => {
            await result.current.startNewGame('medium');
        });

        // It should have re-generated the puzzle (mock returns same board but logic flow is what matters)
        expect(result.current.loading).toBe(false);
        expect(result.current.currentDifficulty).toBe('medium');
        expect(SudokuLogic.generatePuzzle).toHaveBeenCalledTimes(2); // Init + New Game
    });

    it('should detect win condition', async () => {
        (SudokuLogic.checkSolution as jest.Mock).mockReturnValue(true);
        const { result } = renderHook(() => useGameState('easy'));

        await act(async () => {
            await result.current.initializeGame('easy');
        });

        act(() => {
            // Use an empty cell [8, 0]
            const won = result.current.handleNumberInput(3, { row: 8, col: 0 });
            expect(won).toBe(true);
        });

        expect(result.current.gameWon).toBe(true);
        expect(result.current.gameCompleted).toBe(true);
    });
});
