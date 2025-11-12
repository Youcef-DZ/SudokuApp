import { Descope } from "@descope/react-sdk";

interface LoginPageProps {
  flowId?: string;
  darkMode?: boolean;
  onSuccess?: () => void;
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
      minHeight: '100vh',
      backgroundColor: colors.bg,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px'
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
              padding: '10px 16px',
              fontSize: '16px',
              fontWeight: '500',
              backgroundColor: colors.cardBg,
              color: colors.text,
              border: `1px solid ${darkMode ? '#444' : '#e5e7eb'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
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
          backgroundColor: colors.cardBg,
          padding: 'clamp(24px, 5vw, 40px)',
          borderRadius: '16px',
          boxShadow: darkMode 
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: darkMode ? '1px solid #444' : 'none',
        }}>
          <Descope
            flowId={flowId}
            theme={darkMode ? 'dark' : 'light'}
            onSuccess={(e) => {
              console.log('Login successful!', e.detail.user);
              if (onSuccess) {
                onSuccess();
              } else {
                // Refresh to update auth state
                window.location.reload();
              }
            }}
            onError={(e) => {
              console.error('Login error:', e);
            }}
          />
        </div>
      </div>
    </div>
  );
}
