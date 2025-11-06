/**
 * Win Message Component
 * Displays congratulations message
 */

import React from 'react';

interface WinMessageProps {
  successColor: string;
}

export const WinMessage: React.FC<WinMessageProps> = ({ successColor }) => {
  return (
    <div style={{
      padding: '16px 24px',
      backgroundColor: successColor,
      color: 'white',
      borderRadius: '8px',
      fontSize: '18px',
      fontWeight: '600',
      animation: 'fadeIn 0.5s'
    }}>
      🎉 Congratulations! You solved it!
    </div>
  );
};
