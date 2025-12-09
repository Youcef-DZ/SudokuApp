import React, { useState } from 'react';

interface UserProfileProps {
    isAuthenticated: boolean;
    userName?: string;
    userEmail?: string;
    onLogin?: () => void;
    onLogout?: () => void;
    responsiveCellSize?: number;
    darkMode?: boolean;
}

export default function UserProfile({
    isAuthenticated,
    userName,
    userEmail,
    onLogin,
    onLogout,
    responsiveCellSize = 50,
    darkMode = false
}: UserProfileProps) {
    const [showUserPopup, setShowUserPopup] = useState(false);

    const buttonStyle = {
        padding: `${Math.max(4, responsiveCellSize * 0.12)}px ${Math.max(12, responsiveCellSize * 0.3)}px`,
        borderRadius: '10px',
        border: darkMode
            ? '1px solid rgba(99, 102, 241, 0.4)'
            : '1px solid rgba(59, 130, 246, 0.35)',
        background: darkMode
            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)'
            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(14, 165, 233, 0.12) 100%)',
        color: darkMode ? '#a5b4fc' : '#2563eb',
        cursor: 'pointer',
        fontSize: `${Math.max(16, responsiveCellSize * 0.36)}px`,
        fontWeight: '600',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: darkMode
            ? '0 2px 8px rgba(99, 102, 241, 0.25)'
            : '0 2px 8px rgba(59, 130, 246, 0.2)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
        e.currentTarget.style.boxShadow = darkMode
            ? '0 4px 16px rgba(99, 102, 241, 0.45)'
            : '0 4px 16px rgba(59, 130, 246, 0.35)';
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = darkMode
            ? '0 2px 8px rgba(99, 102, 241, 0.25)'
            : '0 2px 8px rgba(59, 130, 246, 0.2)';
    };

    if (!isAuthenticated) {
        return onLogin ? (
            <button
                onClick={onLogin}
                style={buttonStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                title="Login"
            >
                Login
            </button>
        ) : null;
    }

    return (
        <>
            <button
                onClick={() => setShowUserPopup(true)}
                style={buttonStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                title={userName || 'User Profile'}
            >
                {userName ? userName.split(' ').map(n => n.charAt(0).toUpperCase()).join('') : 'U'}
            </button>

            {/* User Profile Popup */}
            {showUserPopup && (
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
                            onClick={() => setShowUserPopup(false)}
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

                        {/* User Avatar */}
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: darkMode
                                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(56, 189, 248, 0.3) 100%)'
                                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(14, 165, 233, 0.2) 100%)',
                            border: darkMode
                                ? '3px solid rgba(99, 102, 241, 0.5)'
                                : '3px solid rgba(59, 130, 246, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '32px',
                            fontWeight: '700',
                            color: darkMode ? '#a5b4fc' : '#2563eb',
                            margin: '0 auto 20px'
                        }}>
                            {userName ? userName.split(' ').map(n => n.charAt(0).toUpperCase()).join('') : 'U'}
                        </div>

                        <h2 style={{
                            fontSize: '24px',
                            marginBottom: '8px',
                            background: darkMode
                                ? 'linear-gradient(135deg, #a5b4fc 0%, #38bdf8 100%)'
                                : 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: '700'
                        }}>
                            {userName || 'User'}
                        </h2>

                        {userEmail && (
                            <p style={{
                                fontSize: '16px',
                                color: darkMode ? '#94a3b8' : '#64748b',
                                marginBottom: '24px',
                                fontWeight: '500'
                            }}>
                                {userEmail}
                            </p>
                        )}

                        <button
                            onClick={() => {
                                setShowUserPopup(false);
                                onLogout?.();
                            }}
                            style={{
                                padding: '14px 32px',
                                fontSize: '16px',
                                fontWeight: '600',
                                background: darkMode
                                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)'
                                    : 'linear-gradient(135deg, rgba(254, 202, 202, 0.8) 0%, rgba(252, 165, 165, 0.8) 100%)',
                                color: darkMode ? '#fca5a5' : '#dc2626',
                                border: darkMode
                                    ? '2px solid rgba(239, 68, 68, 0.4)'
                                    : '2px solid rgba(220, 38, 38, 0.3)',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: darkMode
                                    ? '0 2px 8px rgba(239, 68, 68, 0.2)'
                                    : '0 2px 8px rgba(220, 38, 38, 0.15)',
                                width: '100%'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.02)';
                                e.currentTarget.style.boxShadow = darkMode
                                    ? '0 8px 20px rgba(239, 68, 68, 0.35)'
                                    : '0 8px 20px rgba(220, 38, 38, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = darkMode
                                    ? '0 2px 8px rgba(239, 68, 68, 0.2)'
                                    : '0 2px 8px rgba(220, 38, 38, 0.15)';
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
