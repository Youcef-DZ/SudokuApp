import React from 'react';
import ReactDOM from 'react-dom/client';
import SudokuGameModular from './SudokuGameModular';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      padding: '20px'
    }}>
      <SudokuGameModular 
        difficulty="medium"
        primaryColor="#3b82f6"
        backgroundColor="#ffffff"
      />
    </div>
  </React.StrictMode>
);
