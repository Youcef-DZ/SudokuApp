import React from 'react';
import { getTheme } from '../shared/theme.ts';

interface GameTimerProps {
    elapsedTime: number;
    puzzleId?: number;
    difficulty?: string;
    responsiveCellSize?: number;
    darkMode?: boolean;
}

function formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function GameTimer({
    elapsedTime,
    puzzleId,
    difficulty,
    responsiveCellSize = 50,
    darkMode = false
}: GameTimerProps) {
    const theme = getTheme(darkMode);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
        }}>
            {/* Puzzle Info */}
            {(difficulty || puzzleId) && (
                <div style={{
                    fontSize: `${Math.max(12, responsiveCellSize * 0.3)}px`,
                    color: darkMode ? '#a5b4fc' : '#2563eb',
                    fontWeight: '600',
                    background: theme.gradients.logo,
                    padding: '4px 12px',
                    borderRadius: '6px',
                    border: '1px solid transparent',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    whiteSpace: 'nowrap'
                }}>
                    {difficulty && <span style={{ textTransform: 'capitalize' }}>{difficulty}</span>}
                    {difficulty && puzzleId && <span> • </span>}
                    {puzzleId && <span>#{puzzleId}</span>}
                </div>
            )}

            {/* Timer */}
            <div style={{
                fontSize: `${Math.max(13, responsiveCellSize * 0.32)}px`,
                color: darkMode ? '#f0abfc' : '#c026d3',
                fontWeight: '700',
                background: darkMode
                    ? 'linear-gradient(135deg, rgba(244, 114, 182, 0.15) 0%, rgba(192, 38, 211, 0.15) 100%)'
                    : 'linear-gradient(135deg, rgba(244, 114, 182, 0.1) 0%, rgba(192, 38, 211, 0.1) 100%)',
                padding: '4px 12px',
                borderRadius: '6px',
                border: '1px solid transparent',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                whiteSpace: 'nowrap'
            }}>
                {<span>⏱︎ </span>}
                {formatTime(elapsedTime)}
            </div>
        </div>
    );
}
