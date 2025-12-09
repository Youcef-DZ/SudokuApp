import React from 'react';
import { getTheme, themeToggleButtonStyle } from '../shared/theme.ts';

interface ThemeToggleProps {
    darkMode: boolean;
    onToggle: () => void;
    responsiveCellSize?: number;
}

export default function ThemeToggle({ darkMode, onToggle, responsiveCellSize = 50 }: ThemeToggleProps) {
    const theme = getTheme(darkMode);

    return (
        <button
            onClick={onToggle}
            style={{
                ...themeToggleButtonStyle(theme),
                padding: `${Math.max(4, responsiveCellSize * 0.12)}px ${Math.max(12, responsiveCellSize * 0.3)}px`,
                fontSize: `${Math.max(16, responsiveCellSize * 0.36)}px`
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05) rotate(15deg)';
                e.currentTarget.style.boxShadow = darkMode
                    ? '0 4px 16px rgba(251, 191, 36, 0.4)'
                    : '0 4px 16px rgba(124, 58, 237, 0.3)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1) rotate(0deg)';
                e.currentTarget.style.boxShadow = darkMode
                    ? '0 2px 8px rgba(251, 191, 36, 0.2)'
                    : '0 2px 8px rgba(124, 58, 237, 0.15)';
            }}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {darkMode ? '☀️' : '🌙'}
        </button>
    );
}
