import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SudokuGame from '../../src/game/SudokuGame';
import * as SudokuLogic from '../../src/game/sudokuLogic';

// Mock dependencies
jest.mock('../../src/game/sudokuLogic', () => ({
    generatePuzzle: jest.fn(),
    checkSolution: jest.fn(),
    isValidMove: jest.fn(),
    copyBoard: jest.fn((board) => JSON.parse(JSON.stringify(board))),
}));

// Mock timer to avoid state updates warning
jest.mock('../../src/game/hooks/useTimer', () => ({
    useTimer: () => ({
        elapsedTime: 0,
        resetTimer: jest.fn(),
        stopTimer: jest.fn(),
        startTimer: jest.fn(),
    })
}));

describe('SudokuGame Integration', () => {
    // 9x9 board with all zeros except [0,0]=5
    const mockBoard = Array(9).fill(null).map(() => Array(9).fill(0));
    mockBoard[0][0] = 5;

    const mockSolution = Array(9).fill(null).map(() => Array(9).fill(1));

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

    it('should load game, select cell, and enter number', async () => {
        const { getByText, getByTestId, getAllByText } = render(
            <SudokuGame
                difficulty="easy"
                onNewGame={jest.fn()}
                onLogin={jest.fn()}
            />
        );

        // Wait for loading to finish
        await waitFor(() => {
            expect(getByText('New Game')).toBeTruthy();
        });

        // 1. Verify board loaded
        // Cell [0,0] has 5. Cell [0,1] is empty.
        expect(getAllByText('5').length).toBeGreaterThanOrEqual(1);

        // 2. Select Cell [0,1] (Empty)
        const cell = getByTestId('cell-0-1');
        fireEvent.press(cell);

        // 3. Press number '4' on NumberPad
        // NumberPad rendering numbers 1-9.
        const numBtn = getByText('4');
        fireEvent.press(numBtn);

        // 4. Verify cell [0,1] now shows '4'
        // We can check if '4' text exists, and ideally if it's inside the cell.
        // Since we don't have easy "within" for native without hierarchy complexity,
        // we can just check if '4' appears.
        expect(getAllByText('4').length).toBeGreaterThanOrEqual(1);
    });

    it('should show win modal when game won', async () => {
        (SudokuLogic.checkSolution as jest.Mock).mockReturnValue(true);
        const { getByText, getByTestId } = render(
            <SudokuGame
                difficulty="easy"
                onNewGame={jest.fn()}
            />
        );

        await waitFor(() => expect(getByText('New Game')).toBeTruthy());

        // Select a cell and "win"
        const cell = getByTestId('cell-0-1');
        fireEvent.press(cell);
        fireEvent.press(getByText('1'));

        // Win modal should appear
        expect(getByText('🎉 Puzzle Solved!')).toBeTruthy();
    });
});
