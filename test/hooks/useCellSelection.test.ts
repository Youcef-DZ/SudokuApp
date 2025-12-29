import { renderHook, act } from '@testing-library/react-native';
import { useCellSelection } from '../../src/game/hooks/useCellSelection.ts';

describe('useCellSelection', () => {
    it('should initialize with no cell selected', () => {
        const { result } = renderHook(() => useCellSelection());
        expect(result.current.selectedCell).toBeNull();
    });

    it('should select a cell when handleCellClick is called', () => {
        const { result } = renderHook(() => useCellSelection());

        act(() => {
            result.current.handleCellClick(2, 3);
        });

        expect(result.current.selectedCell).toEqual({ row: 2, col: 3 });
    });

    it('should update selected cell when different cell is clicked', () => {
        const { result } = renderHook(() => useCellSelection());

        act(() => {
            result.current.handleCellClick(2, 3);
        });

        expect(result.current.selectedCell).toEqual({ row: 2, col: 3 });

        act(() => {
            result.current.handleCellClick(5, 7);
        });

        expect(result.current.selectedCell).toEqual({ row: 5, col: 7 });
    });

    it('should call onNumberInput with correct number when number key is pressed', () => {
        const { result } = renderHook(() => useCellSelection());
        const mockOnNumberInput = jest.fn();

        const event = new KeyboardEvent('keydown', { key: '5' });

        act(() => {
            result.current.handleKeyPress(event as any, mockOnNumberInput);
        });

        expect(mockOnNumberInput).toHaveBeenCalledWith(5);
    });

    it('should call onNumberInput with 0 when Backspace is pressed', () => {
        const { result } = renderHook(() => useCellSelection());
        const mockOnNumberInput = jest.fn();

        const event = new KeyboardEvent('keydown', { key: 'Backspace' });

        act(() => {
            result.current.handleKeyPress(event as any, mockOnNumberInput);
        });

        expect(mockOnNumberInput).toHaveBeenCalledWith(0);
    });

    it('should call onNumberInput with 0 when Delete is pressed', () => {
        const { result } = renderHook(() => useCellSelection());
        const mockOnNumberInput = jest.fn();

        const event = new KeyboardEvent('keydown', { key: 'Delete' });

        act(() => {
            result.current.handleKeyPress(event as any, mockOnNumberInput);
        });

        expect(mockOnNumberInput).toHaveBeenCalledWith(0);
    });

    it('should not call onNumberInput for invalid keys', () => {
        const { result } = renderHook(() => useCellSelection());
        const mockOnNumberInput = jest.fn();

        const event = new KeyboardEvent('keydown', { key: 'a' });

        act(() => {
            result.current.handleKeyPress(event as any, mockOnNumberInput);
        });

        expect(mockOnNumberInput).not.toHaveBeenCalled();
    });

    it('should accept number keys 1-9', () => {
        const { result } = renderHook(() => useCellSelection());
        const mockOnNumberInput = jest.fn();

        for (let i = 1; i <= 9; i++) {
            const event = new KeyboardEvent('keydown', { key: i.toString() });

            act(() => {
                result.current.handleKeyPress(event as any, mockOnNumberInput);
            });
        }

        expect(mockOnNumberInput).toHaveBeenCalledTimes(9);
    });
});
