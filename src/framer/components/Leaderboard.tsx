import { useState, useEffect } from 'react';
import { fetchScoresFromNotion } from '../data/Database.tsx';
import { getTheme, leaderboardContainerStyle, leaderboardCardStyle, tabButtonStyle } from '../shared/theme';

interface Score {
    id: string;
    userName: string;
    time: number;
    difficulty: 'easy' | 'medium' | 'hard';
    date: string;
}

interface LeaderboardProps {
    darkMode: boolean;
    onClose: () => void;
    initialDifficulty?: 'easy' | 'medium' | 'hard';
}

export default function Leaderboard({ darkMode, onClose, initialDifficulty = 'medium' }: LeaderboardProps) {
    const [activeTab, setActiveTab] = useState<'easy' | 'medium' | 'hard'>(initialDifficulty);
    const [scores, setScores] = useState<Score[]>([]);
    const theme = getTheme(darkMode);

    useEffect(() => {
        const loadScores = async () => {
            // Load global scores from Notion
            const globalScores = await fetchScoresFromNotion();

            // Sort by time (ascending)
            const sortedScores = globalScores.sort((a, b) => a.time - b.time);
            setScores(sortedScores);
        };

        loadScores();
    }, []);

    const filteredScores = scores.filter(s => s.difficulty === activeTab);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div style={leaderboardContainerStyle(theme)}>
            <div style={leaderboardCardStyle(theme)}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: '800',
                        margin: 0,
                        backgroundImage: theme.gradients.textGradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Leaderboard 🏆
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: theme.colors.textSecondary,
                            padding: theme.spacing.sm,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: theme.transitions.fast
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                            e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    background: darkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(241, 245, 249, 0.8)',
                    padding: '4px',
                    borderRadius: theme.borderRadius.lg,
                    gap: '4px'
                }}>
                    {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                        <button
                            key={difficulty}
                            onClick={() => setActiveTab(difficulty)}
                            style={{
                                ...tabButtonStyle(theme, activeTab === difficulty),
                                flex: 1,
                                boxShadow: activeTab === difficulty && !darkMode ? theme.shadows.sm : 'none'
                            }}
                        >
                            {difficulty}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div style={{
                    overflowY: 'auto',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    paddingRight: '4px'
                }}>
                    {filteredScores.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 0',
                            color: theme.colors.textSecondary
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: theme.spacing.md }}>📝</div>
                            <p>No scores yet for this difficulty.</p>
                            <p style={{ fontSize: '14px' }}>Be the first to set a record!</p>
                        </div>
                    ) : (
                        filteredScores.map((score, index) => (
                            <div
                                key={`${score.id}-${index}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px 16px',
                                    borderRadius: theme.borderRadius.lg,
                                    background: darkMode
                                        ? 'rgba(30, 41, 59, 0.4)'
                                        : 'rgba(255, 255, 255, 0.6)',
                                    border: darkMode
                                        ? '1px solid rgba(255, 255, 255, 0.05)'
                                        : '1px solid rgba(0, 0, 0, 0.05)',
                                    gap: theme.spacing.md
                                }}
                            >
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '50%',
                                    background: index === 0
                                        ? 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)'
                                        : index === 1
                                            ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                                            : index === 2
                                                ? 'linear-gradient(135deg, #b45309 0%, #78350f 100%)'
                                                : (darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
                                    color: index < 3 ? 'white' : theme.colors.textSecondary,
                                    fontWeight: '700',
                                    fontSize: '14px'
                                }}>
                                    {index + 1}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontWeight: '600',
                                        color: theme.colors.text,
                                        fontSize: '16px'
                                    }}>
                                        {score.userName}
                                    </div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: theme.colors.textSecondary
                                    }}>
                                        {formatDate(score.date)}
                                    </div>
                                </div>

                                <div style={{
                                    fontFamily: 'monospace',
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    color: theme.colors.info
                                }}>
                                    {formatTime(score.time)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
