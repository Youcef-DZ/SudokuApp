import React from 'react';
import { Descope } from '@descope/react-sdk';
import { getTheme, sudokuLogoStyle, sudokuLogoCellStyle } from '../shared/theme.ts';

interface LoginModalProps {
    onSuccess: (e: any) => Promise<void>;
    onError: (e: any) => void;
    onSkip: () => void;
    darkMode?: boolean;
}

export default function LoginModal({
    onSuccess,
    onError,
    onSkip,
    darkMode = false
}: LoginModalProps) {
    const theme = getTheme(darkMode);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            <div style={{
                maxWidth: '420px',
                width: '100%',
                textAlign: 'center',
                backgroundColor: theme.colors.cardBg,
                borderRadius: theme.borderRadius.xl,
                padding: theme.spacing.lg,
                boxShadow: theme.shadows.xl,
                position: 'relative'
            }}>
                {/* Skip Button */}
                <button
                    onClick={onSkip}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '600',
                        background: 'transparent',
                        color: theme.colors.textSecondary,
                        border: 'none',
                        borderRadius: theme.borderRadius.sm,
                        cursor: 'pointer',
                        transition: theme.transitions.fast,
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                        e.currentTarget.style.color = theme.colors.text;
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = theme.colors.textSecondary;
                    }}
                >
                    Skip
                </button>

                {/* Sudoku Logo */}
                <div style={sudokuLogoStyle(theme)}>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} style={sudokuLogoCellStyle(theme, [1, 3, 5, 7].includes(i), darkMode)}>
                            {[1, 3, 5, 7].includes(i) ? [5, 9, 2, 7][([1, 3, 5, 7].indexOf(i))] : ''}
                        </div>
                    ))}
                </div>

                <h1 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '6px',
                    color: theme.colors.text
                }}>
                    Sudoku
                </h1>
                <p style={{
                    color: theme.colors.textSecondary,
                    marginBottom: '20px',
                    fontSize: '13px',
                    lineHeight: '1.4'
                }}>
                    Sign in to save your progress and compete on the leaderboard
                </p>
                <div style={{
                    background: darkMode ? 'rgba(15, 23, 42, 0.4)' : 'rgba(249, 250, 251, 0.7)',
                    padding: '20px',
                    borderRadius: theme.borderRadius.lg,
                    border: `1px solid ${theme.colors.border}`,
                }}>
                    <Descope
                        flowId="sign-up-or-in"
                        theme={darkMode ? 'dark' : 'light'}
                        onSuccess={onSuccess}
                        onError={onError}
                    />
                </div>

                <button
                    onClick={onSkip}
                    style={{
                        marginTop: '12px',
                        padding: '9px 18px',
                        fontSize: '13px',
                        fontWeight: '600',
                        background: 'transparent',
                        color: theme.colors.textSecondary,
                        border: theme.borders.thin,
                        borderRadius: theme.borderRadius.sm,
                        cursor: 'pointer',
                        transition: theme.transitions.fast,
                        width: '100%'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
                        e.currentTarget.style.borderColor = theme.colors.textSecondary;
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = theme.colors.textSecondary;
                    }}
                >
                    Skip for now
                </button>
            </div>
        </div>
    );
}
