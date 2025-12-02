import { useState, useEffect } from 'react';
import { fetchScoresFromNotion } from './Database.ts';

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
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '500px',
                background: darkMode
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%)',
                borderRadius: '24px',
                border: darkMode
                    ? '1px solid rgba(99, 102, 241, 0.2)'
                    : '1px solid rgba(59, 130, 246, 0.2)',
                boxShadow: darkMode
                    ? '0 20px 50px rgba(0, 0, 0, 0.5)'
                    : '0 20px 50px rgba(59, 130, 246, 0.15)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                maxHeight: '80vh',
                overflow: 'hidden'
            }}>
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
                        background: darkMode
                            ? 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)'
                            : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
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
                            color: darkMode ? '#94a3b8' : '#64748b',
                            padding: '8px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
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
                    borderRadius: '12px',
                    gap: '4px'
                }}>
                    {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                        <button
                            key={difficulty}
                            onClick={() => setActiveTab(difficulty)}
                            style={{
                                flex: 1,
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                background: activeTab === difficulty
                                    ? (darkMode
                                        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(56, 189, 248, 0.2) 100%)'
                                        : 'white')
                                    : 'transparent',
                                color: activeTab === difficulty
                                    ? (darkMode ? '#fff' : '#0f172a')
                                    : (darkMode ? '#64748b' : '#64748b'),
                                fontWeight: activeTab === difficulty ? '600' : '500',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                transition: 'all 0.3s',
                                boxShadow: activeTab === difficulty && !darkMode
                                    ? '0 2px 8px rgba(0,0,0,0.05)'
                                    : 'none'
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
                            color: darkMode ? '#64748b' : '#94a3b8'
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
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
                                    borderRadius: '12px',
                                    background: darkMode
                                        ? 'rgba(30, 41, 59, 0.4)'
                                        : 'rgba(255, 255, 255, 0.6)',
                                    border: darkMode
                                        ? '1px solid rgba(255, 255, 255, 0.05)'
                                        : '1px solid rgba(0, 0, 0, 0.05)',
                                    gap: '16px'
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
                                    color: index < 3 ? 'white' : (darkMode ? '#94a3b8' : '#64748b'),
                                    fontWeight: '700',
                                    fontSize: '14px'
                                }}>
                                    {index + 1}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontWeight: '600',
                                        color: darkMode ? '#e2e8f0' : '#1e293b',
                                        fontSize: '16px'
                                    }}>
                                        {score.userName}
                                    </div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: darkMode ? '#64748b' : '#94a3b8'
                                    }}>
                                        {formatDate(score.date)}
                                    </div>
                                </div>

                                <div style={{
                                    fontFamily: 'monospace',
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    color: darkMode ? '#38bdf8' : '#0284c7'
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
