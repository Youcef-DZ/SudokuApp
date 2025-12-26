import React, { useState } from 'react';
import { getTheme, difficultyButtonStyle } from '../shared/theme.ts';
import type { Difficulty } from '../shared/types.ts';

interface DifficultySelectorProps {
    onSelect: (difficulty: Difficulty) => void;
    onShowLeaderboard?: () => void;
    darkMode?: boolean;
}

export default function DifficultySelector({
    onSelect,
    onShowLeaderboard,
    darkMode = false
}: DifficultySelectorProps) {
    const [hoveredDifficulty, setHoveredDifficulty] = useState<string | null>(null);
    const theme = getTheme(darkMode);

    const difficulties: Array<{ level: Difficulty; title: string }> = [
        { level: 'easy', title: 'Easy' },
        { level: 'medium', title: 'Medium' },
        { level: 'hard', title: 'Hard' }
    ];

    return (
        <div style={{
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            backgroundColor: theme.colors.cardBg,
            borderRadius: theme.borderRadius.xl,
            padding: '40px',
            boxShadow: theme.shadows.xl,
            position: 'relative',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            <h2 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: theme.spacing.sm,
                color: theme.colors.text
            }}>
                Select Difficulty
            </h2>

            <p style={{
                fontSize: '16px',
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing.xl,
                fontWeight: '500'
            }}>
                Choose a difficulty level to start playing
            </p>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: theme.spacing.lg,
                alignItems: 'center'
            }}>
                {difficulties.map(({ level, title }) => (
                    <button
                        key={level}
                        onClick={() => onSelect(level)}
                        onMouseEnter={() => setHoveredDifficulty(level)}
                        onMouseLeave={() => setHoveredDifficulty(null)}
                        style={{
                            ...difficultyButtonStyle(theme, hoveredDifficulty === level, darkMode),
                            maxWidth: '320px'
                        }}
                    >
                        {title}
                    </button>
                ))}

                {onShowLeaderboard && (
                    <button
                        onClick={onShowLeaderboard}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '15px',
                            fontWeight: '600',
                            color: theme.colors.textSecondary,
                            cursor: 'pointer',
                            marginTop: theme.spacing.sm,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: theme.spacing.sm + ' ' + theme.spacing.md,
                            borderRadius: theme.borderRadius.sm,
                            transition: theme.transitions.fast,
                            justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        🏆 View Leaderboard
                    </button>
                )}
            </div>
        </div>
    );
}
