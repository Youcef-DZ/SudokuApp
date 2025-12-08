import React from 'react';
import ReactDOM from 'react-dom/client';
import GameWrapper from './framer/game/GameWrapper';
import { AuthProvider, useSession } from '@descope/react-sdk';
import './index.css';

const projectId = "P35AlPWcTE6gN9hXrEFjboLuqX8T";


function App() {
  const { isSessionLoading } = useSession();

  if (isSessionLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        fontFamily: 'system-ui'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // GameWrapper now handles everything: auth, difficulty selection, and game
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#f3f4f6'
    }}>
      <GameWrapper
        primaryColor="#3b82f6"
        backgroundColor="#ffffff"
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider
      projectId={projectId}
      persistTokens={true}
      sessionTokenViaCookie={true}
    >
      <App />
    </AuthProvider>
  </React.StrictMode>
);
