import { useState, useCallback } from 'react';
import type { CellPosition } from '../../shared/types.ts';

interface UseCellSelectionReturn {
    selectedCell: CellPosition | null;
    handleCellClick: (row: number, col: number) => void;
    handleKeyPress: (e: KeyboardEvent, onNumberInput: (num: number) => void) => void;
    moveSelection: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

/**
 * Custom hook to manage cell selection and keyboard input
 */
export function useCellSelection(): UseCellSelectionReturn {
    const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);

    const handleCellClick = useCallback((row: number, col: number) => {
        setSelectedCell({ row, col });
    }, []);

    const moveSelection = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
        setSelectedCell(current => {
            if (!current) return { row: 0, col: 0 }; // Start at top-left if nothing selected

            const { row, col } = current;
            let newRow = row;
            let newCol = col;

            switch (direction) {
                case 'up': newRow = Math.max(0, row - 1); break;
                case 'down': newRow = Math.min(8, row + 1); break;
                case 'left': newCol = Math.max(0, col - 1); break;
                case 'right': newCol = Math.min(8, col + 1); break;
            }

            return { row: newRow, col: newCol };
        });
    }, []);

    const handleKeyPress = useCallback((e: KeyboardEvent, onNumberInput: (num: number) => void) => {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 9) {
            onNumberInput(num);
        } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
            onNumberInput(0);
        }
    }, []);

    return {
        selectedCell,
        handleCellClick,
        handleKeyPress,
        moveSelection
    };
}
