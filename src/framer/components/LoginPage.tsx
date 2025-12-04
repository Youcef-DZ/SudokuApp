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
      height: '100%',
      background: darkMode
        ? 'linear-gradient(135deg, #1a0b2e 0%, #16213e 30%, #0f3443 60%, #0d3b3f 100%)'
        : 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 30%, #e0f7fa 60%, #e0f2f1 100%)',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '450px',
        width: '100%',
        textAlign: 'center'
      }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              padding: '12px 20px',
              fontSize: '16px',
              fontWeight: '600',
              background: darkMode
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(14, 165, 233, 0.12) 100%)',
              color: darkMode ? '#a5b4fc' : '#2563eb',
              border: darkMode
                ? '2px solid rgba(99, 102, 241, 0.3)'
                : '2px solid rgba(59, 130, 246, 0.25)',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              boxShadow: darkMode
                ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                : '0 2px 8px rgba(59, 130, 246, 0.15)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = darkMode
                ? '0 4px 16px rgba(99, 102, 241, 0.4)'
                : '0 4px 16px rgba(59, 130, 246, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = darkMode
                ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                : '0 2px 8px rgba(59, 130, 246, 0.15)';
            }}
          >
            ← Back
          </button>
        )}
        <h1 style={{
          fontSize: 'clamp(28px, 6vw, 36px)',
          fontWeight: 'bold',
          marginBottom: '12px',
          color: colors.text
        }}>
          Sudoku
        </h1>
        <p style={{
          color: colors.subtext,
          marginBottom: '30px',
          fontSize: 'clamp(14px, 3vw, 15px)',
          lineHeight: '1.6'
        }}>
          Sign in to save your progress and compete with others
        </p>
        <div style={{
          background: darkMode ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.85)',
          padding: 'clamp(28px, 6vw, 44px)',
          borderRadius: '16px',
          boxShadow: darkMode
            ? '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.15)'
            : '0 12px 40px rgba(59, 130, 246, 0.18), 0 0 0 1px rgba(59, 130, 246, 0.12)',
          border: darkMode
            ? '2px solid rgba(99, 102, 241, 0.25)'
            : '2px solid rgba(59, 130, 246, 0.2)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)'
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
      </div>
    </div>
  );
}
