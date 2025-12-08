import { Descope } from "@descope/react-sdk";

interface LoginPageProps {
  flowId?: string;
  darkMode?: boolean;
  onSuccess?: () => void | Promise<void>;
  onBack?: () => void;
}

export default function LoginPage({
  flowId = "sign-up-or-in",
  darkMode = false,
  onSuccess,
  onBack
}: LoginPageProps) {
  const colors = {
    bg: darkMode ? '#1a1a1a' : '#f3f4f6',
    cardBg: darkMode ? '#2d2d2d' : 'white',
    text: darkMode ? '#ffffff' : '#1f2937',
    subtext: darkMode ? '#9ca3af' : '#6b7280',
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        textAlign: 'center',
        backgroundColor: darkMode ? '#1f2937' : 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: darkMode
          ? '0 20px 50px rgba(0, 0, 0, 0.5)'
          : '0 20px 50px rgba(0, 0, 0, 0.15)',
        position: 'relative'
      }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '600',
              background: 'transparent',
              color: darkMode ? '#9ca3af' : '#6b7280',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
              e.currentTarget.style.color = darkMode ? '#e5e7eb' : '#1f2937';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = darkMode ? '#9ca3af' : '#6b7280';
            }}
          >
            Skip
          </button>
        )}
        {/* Sudoku Logo */}
        <div style={{
          display: 'inline-grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2px',
          marginBottom: '12px',
          padding: '6px',
          background: darkMode 
            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)'
            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(14, 165, 233, 0.12) 100%)',
          borderRadius: '8px',
          border: darkMode
            ? '2px solid rgba(99, 102, 241, 0.25)'
            : '2px solid rgba(59, 130, 246, 0.25)'
        }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: [1, 3, 5, 7].includes(i) 
                  ? (darkMode ? '#60a5fa' : '#3b82f6')
                  : (darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(59, 130, 246, 0.1)'),
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: 'bold',
                color: [1, 3, 5, 7].includes(i) ? 'white' : (darkMode ? '#94a3b8' : '#64748b'),
                transition: 'all 0.3s'
              }}
            >
              {[1, 3, 5, 7].includes(i) ? [5, 9, 2, 7][([1, 3, 5, 7].indexOf(i))] : ''}
            </div>
          ))}
        </div>
        
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '6px',
          color: colors.text
        }}>
          Sudoku
        </h1>
        <p style={{
          color: colors.subtext,
          marginBottom: '20px',
          fontSize: '13px',
          lineHeight: '1.4'
        }}>
          Sign in to save your progress and compete on the leaderboard
        </p>
        <div style={{
          background: darkMode ? 'rgba(15, 23, 42, 0.4)' : 'rgba(249, 250, 251, 0.7)',
          padding: '20px',
          borderRadius: '12px',
          border: darkMode
            ? '1px solid rgba(99, 102, 241, 0.2)'
            : '1px solid rgba(59, 130, 246, 0.15)',
        }}>
          <Descope
            flowId={flowId}
            theme={darkMode ? 'dark' : 'light'}
            onSuccess={async (e) => {
              console.log('🎉 Descope Login successful!');
              console.log('User from event:', e.detail.user);

              if (onSuccess) {
                // Call the success callback and wait for it
                console.log('Waiting for session refresh...');
                await onSuccess();
                console.log('Session refresh complete, navigating back');
              } else {
                // Reload immediately to refresh auth state
                console.log('Reloading page to update auth state...');
                window.location.reload();
              }
            }}
            onError={(e) => {
              console.error('❌ Descope Login error:', e);
              console.error('Error detail:', e.detail);
            }}
          />
        </div>
        
        {onBack && (
          <button
            onClick={onBack}
            style={{
              marginTop: '12px',
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: '600',
              background: 'transparent',
              color: darkMode ? '#9ca3af' : '#6b7280',
              border: darkMode ? '1px solid rgba(156, 163, 175, 0.3)' : '1px solid rgba(107, 114, 128, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              width: '100%'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
              e.currentTarget.style.borderColor = darkMode ? 'rgba(156, 163, 175, 0.5)' : 'rgba(107, 114, 128, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = darkMode ? 'rgba(156, 163, 175, 0.3)' : 'rgba(107, 114, 128, 0.3)';
            }}
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}
