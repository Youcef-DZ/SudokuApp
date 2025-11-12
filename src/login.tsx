import { Descope } from "@descope/react-sdk";

interface LoginPageProps {
  flowId?: string;
  theme?: 'light' | 'dark';
  onSuccess?: () => void;
}

export default function LoginPage({ 
  flowId = "sign-up-or-in",
  theme = "light",
  onSuccess
}: LoginPageProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '450px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: 'bold', 
          marginBottom: '12px',
          color: '#1f2937'
        }}>
          Sudoku
        </h1>
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '30px',
          fontSize: '15px',
          lineHeight: '1.6'
        }}>
          Sign in to save your progress and compete with others
        </p>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}>
          <Descope
            flowId={flowId}
            theme={theme}
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
