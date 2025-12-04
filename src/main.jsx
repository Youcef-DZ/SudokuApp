import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import GameWrapper from './framer/game/GameWrapper';
import LoginPage from './framer/components/LoginPage';
import DifficultySelect from './framer/components/DifficultySelect';
import { AuthProvider, useSession, useUser } from '@descope/react-sdk';
import { unprotectedComponent } from './framer/components/DescopeAuth';
import './index.css';

const projectId = "P35AlPWcTE6gN9hXrEFjboLuqX8T";

// Only wrap login page (hide it when authenticated)
const UnprotectedLogin = unprotectedComponent(LoginPage);

// Helper function to extract username from Descope user object or session token
const getUserName = (user, sessionToken) => {
  console.log('getUserName called with:', { user, sessionToken });

  // First try to get from user object
  if (user) {
    console.log('Descope user object:', user);
    console.log('user.givenName:', user.givenName);
    console.log('user.name:', user.name);
    console.log('user.email:', user.email);
    console.log('user.loginIds:', user.loginIds);

    const username = user.givenName || user.name || user.email || user.loginIds?.[0];
    if (username) {
      console.log('Extracted username from user:', username);
      return username;
    }
  }

  // If user object is null, try to extract from session token claims
  if (sessionToken) {
    console.log('Session token:', sessionToken);
    // JWT tokens have claims that might include user info
    // Common claims: email, name, given_name, family_name, sub (subject/userId)
    const username = sessionToken.given_name || sessionToken.name || sessionToken.email || sessionToken.sub;
    if (username) {
      console.log('Extracted username from session token:', username);
      return username;
    }
  }

  console.log('Could not extract username from user or session');
  return undefined;
};


function App() {
  const { isSessionLoading, isAuthenticated, sessionToken } = useSession();
  const { user } = useUser();
  const [currentView, setCurrentView] = useState('game'); // Start directly in game like Framer
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');

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

  // Show login page (hidden if authenticated)
  if (currentView === 'login') {
    return <UnprotectedLogin />;
  }

  // Show difficulty selection
  if (currentView === 'difficulty') {
    return (
      <DifficultySelect
        onSelectDifficulty={(difficulty) => {
          setSelectedDifficulty(difficulty);
          setCurrentView('game');
        }}
        onLogin={() => setCurrentView('login')}
        isAuthenticated={isAuthenticated}
        userName={getUserName(user, sessionToken)}
      />
    );
  }

  // Show game (accessible to everyone, auth is optional)
  // GameWrapper automatically handles auth connection
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#f3f4f6'
    }}>
      <GameWrapper
        difficulty={selectedDifficulty}
        primaryColor="#3b82f6"
        backgroundColor="#ffffff"
        onLoginOverride={() => setCurrentView('login')}
        onLogoutOverride={() => {
          // Logout is handled by GameWrapper
          // Just navigate back home
          setCurrentView('game');
        }}
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
