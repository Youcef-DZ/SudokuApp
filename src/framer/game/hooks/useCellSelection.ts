import { useState, useCallback } from 'react';
import type { CellPosition } from '../../shared/types.ts';

interface UseCellSelectionReturn {
    selectedCell: CellPosition | null;
    handleCellClick: (row: number, col: number) => void;
    handleKeyPress: (e: KeyboardEvent, onNumberInput: (num: number) => void) => void;
}

/**
 * Custom hook to manage cell selection and keyboard input
 */
export function useCellSelection(): UseCellSelectionReturn {
    const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);

    const handleCellClick = useCallback((row: number, col: number) => {
        setSelectedCell({ row, col });
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
        handleKeyPress
    };
}
