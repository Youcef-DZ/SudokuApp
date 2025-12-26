import React, { useState } from 'react';
import { getTheme } from '../shared/theme.ts';

interface NewGameButtonProps {
    onNewGame: (difficulty?: string) => void;
    responsiveCellSize?: number;
    darkMode?: boolean;
}

export default function NewGameButton({
    onNewGame,
    responsiveCellSize = 50,
    darkMode = false
}: NewGameButtonProps) {
    const [showDifficultyPopup, setShowDifficultyPopup] = useState(false);
    const theme = getTheme(darkMode);

    return (
        <>
            <button
                onClick={() => setShowDifficultyPopup(true)}
                style={{
                    padding: `${Math.max(4, responsiveCellSize * 0.12)}px ${Math.max(12, responsiveCellSize * 0.3)}px`,
                    background: theme.gradients.logo,
                    color: darkMode ? '#a5b4fc' : '#2563eb',
                    border: theme.borders.medium,
                    borderRadius: theme.borderRadius.md,
                    cursor: 'pointer',
                    fontSize: `${Math.max(14, responsiveCellSize * 0.32)}px`,
                    fontWeight: '600',
                    transition: theme.transitions.normal,
                    boxShadow: theme.shadows.md,
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                    e.currentTarget.style.boxShadow = darkMode
                        ? '0 4px 16px rgba(99, 102, 241, 0.45)'
                        : '0 4px 16px rgba(59, 130, 246, 0.35)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = darkMode
                        ? '0 2px 8px rgba(99, 102, 241, 0.25)'
                        : '0 2px 8px rgba(59, 130, 246, 0.2)';
                }}
                title="New Puzzle"
            >
                🔄
            </button>

            {/* Difficulty Selection Popup */}
            {showDifficultyPopup && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: darkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        padding: '32px',
                        borderRadius: '24px',
                        textAlign: 'center',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                        border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                        backdropFilter: 'blur(10px)',
                        maxWidth: '90%',
                        width: '400px',
                        position: 'relative'
                    }}>
                        {/* Close button */}
                        <button
                            onClick={() => setShowDifficultyPopup(false)}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '24px',
                                color: darkMode ? '#94a3b8' : '#64748b',
                                cursor: 'pointer',
                                padding: '4px 8px',
                                lineHeight: '1',
                                transition: 'color 0.2s',
                                fontWeight: '300'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = darkMode ? '#fff' : '#000'}
                            onMouseLeave={(e) => e.currentTarget.style.color = darkMode ? '#94a3b8' : '#64748b'}
                            aria-label="Close"
                        >
                            ✕
                        </button>

                        <h2 style={{
                            fontSize: '28px',
                            marginBottom: '16px',
                            background: darkMode
                                ? 'linear-gradient(135deg, #a5b4fc 0%, #38bdf8 100%)'
                                : 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: '800'
                        }}>
                            Select Difficulty
                        </h2>

                        <p style={{
                            fontSize: '16px',
                            color: darkMode ? '#94a3b8' : '#64748b',
                            marginBottom: '24px',
                            fontWeight: '500'
                        }}>
                            Choose a difficulty level for your next puzzle
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {['Easy', 'Medium', 'Hard'].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => {
                                        setShowDifficultyPopup(false);
                                        onNewGame?.(level.toLowerCase());
                                    }}
                                    style={{
                                        padding: '16px 32px',
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        background: darkMode
                                            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)'
                                            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(14, 165, 233, 0.12) 100%)',
                                        border: darkMode
                                            ? '2px solid rgba(99, 102, 241, 0.25)'
                                            : '2px solid rgba(59, 130, 246, 0.25)',
                                        color: darkMode ? '#a5b4fc' : '#2563eb',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        boxShadow: darkMode
                                            ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                                            : '0 2px 8px rgba(59, 130, 246, 0.15)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.02)';
                                        e.currentTarget.style.border = darkMode
                                            ? '2px solid rgba(99, 102, 241, 0.5)'
                                            : '2px solid rgba(59, 130, 246, 0.4)';
                                        e.currentTarget.style.boxShadow = darkMode
                                            ? '0 8px 20px rgba(99, 102, 241, 0.4)'
                                            : '0 8px 20px rgba(59, 130, 246, 0.35)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.border = darkMode
                                            ? '2px solid rgba(99, 102, 241, 0.25)'
                                            : '2px solid rgba(59, 130, 246, 0.25)';
                                        e.currentTarget.style.boxShadow = darkMode
                                            ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                                            : '0 2px 8px rgba(59, 130, 246, 0.15)';
                                    }}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
