/**
 * Centralized theme and style definitions for the Sudoku app
 * All colors, gradients, and reusable styles are defined here
 */

export interface Theme {
  colors: {
    background: string;
    cardBg: string;
    text: string;
    textSecondary: string;
    border: string;
    overlay: string;
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    background: string;
    button: string;
    buttonActive: string;
    buttonDisabled: string;
    error: string;
    card: string;
    textGradient: string;
    logo: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    button: string;
    buttonHover: string;
  };
  borders: {
    thin: string;
    medium: string;
    thick: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
}

export const lightTheme: Theme = {
  colors: {
    background: '#f3f4f6',
    cardBg: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: 'rgba(59, 130, 246, 0.2)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    secondary: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    background: 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 30%, #e0f7fa 60%, #e0f2f1 100%)',
    button: 'linear-gradient(135deg, rgba(59, 130, 246, 0.5) 0%, rgba(14, 165, 233, 0.5) 100%)',
    buttonActive: 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)',
    buttonDisabled: 'rgba(255, 255, 255, 0.7)',
    error: 'linear-gradient(135deg, #ef4444 0%, #f472b6 100%)',
    card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%)',
    textGradient: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
    logo: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(14, 165, 233, 0.12) 100%)',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 25px rgba(0, 0, 0, 0.15)',
    xl: '0 20px 50px rgba(59, 130, 246, 0.15)',
    button: '0 4px 16px rgba(59, 130, 246, 0.35)',
    buttonHover: '0 6px 20px rgba(59, 130, 246, 0.5)',
  },
  borders: {
    thin: '1px solid rgba(203, 213, 225, 0.5)',
    medium: '1px solid rgba(59, 130, 246, 0.4)',
    thick: '2px solid rgba(59, 130, 246, 0.3)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '8px',
    md: '10px',
    lg: '12px',
    xl: '16px',
  },
  transitions: {
    fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    normal: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export const darkTheme: Theme = {
  colors: {
    background: '#1a1a1a',
    cardBg: '#1f2937',
    text: '#ffffff',
    textSecondary: '#9ca3af',
    border: 'rgba(99, 102, 241, 0.2)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#60a5fa',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    secondary: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
    background: 'linear-gradient(135deg, #1a0b2e 0%, #16213e 30%, #0f3443 60%, #0d3b3f 100%)',
    button: 'linear-gradient(135deg, rgba(99, 102, 241, 0.6) 0%, rgba(56, 189, 248, 0.6) 100%)',
    buttonActive: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
    buttonDisabled: 'rgba(30, 41, 59, 0.5)',
    error: 'linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, rgba(244, 114, 182, 0.8) 100%)',
    card: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
    textGradient: 'linear-gradient(135deg, #a5b4fc 0%, #38bdf8 100%)',
    logo: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 25px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 50px rgba(0, 0, 0, 0.5)',
    button: '0 4px 16px rgba(99, 102, 241, 0.45)',
    buttonHover: '0 6px 20px rgba(99, 102, 241, 0.65)',
  },
  borders: {
    thin: '1px solid rgba(71, 85, 105, 0.3)',
    medium: '1px solid rgba(99, 102, 241, 0.5)',
    thick: '2px solid rgba(99, 102, 241, 0.4)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '8px',
    md: '10px',
    lg: '12px',
    xl: '16px',
  },
  transitions: {
    fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    normal: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

/**
 * Get the appropriate theme based on dark mode setting
 */
export const getTheme = (darkMode: boolean): Theme => darkMode ? darkTheme : lightTheme;

/**
 * Reusable style generators
 */
export const createButtonStyle = (
  theme: Theme,
  enabled: boolean = true,
  variant: 'primary' | 'secondary' | 'error' = 'primary'
) => {
  const baseStyle = {
    padding: '14px',
    fontSize: '20px',
    fontWeight: '700',
    borderRadius: theme.borderRadius.md,
    cursor: enabled ? 'pointer' : 'not-allowed',
    transition: theme.transitions.normal,
    transform: 'scale(1)',
  };

  if (!enabled) {
    return {
      ...baseStyle,
      background: theme.gradients.buttonDisabled,
      color: theme.colors.textSecondary,
      border: theme.borders.thin,
      boxShadow: 'none',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    };
  }

  if (variant === 'error') {
    return {
      ...baseStyle,
      background: theme.gradients.error,
      color: 'white',
      border: 'none',
      boxShadow: theme.shadows.button,
    };
  }

  return {
    ...baseStyle,
    background: variant === 'primary' ? theme.gradients.button : theme.gradients.secondary,
    color: 'white',
    border: theme.borders.medium,
    boxShadow: theme.shadows.button,
  };
};

export const createPopupOverlayStyle = () => ({
  position: 'fixed' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '20px',
  boxSizing: 'border-box' as const,
});

export const createPopupCardStyle = (theme: Theme, maxWidth: string = '420px') => ({
  maxWidth,
  width: '100%',
  textAlign: 'center' as const,
  backgroundColor: theme.colors.cardBg,
  borderRadius: theme.borderRadius.xl,
  padding: theme.spacing.lg,
  boxShadow: theme.shadows.xl,
  position: 'relative' as const,
});

export const createGradientTextStyle = (theme: Theme) => ({
  backgroundImage: theme.gradients.textGradient,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
});

/**
 * Specific component styles
 */
export const sudokuLogoStyle = (theme: Theme) => ({
  display: 'inline-grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '2px',
  marginBottom: '12px',
  padding: '6px',
  background: theme.gradients.logo,
  borderRadius: theme.borderRadius.sm,
  border: `2px solid ${theme.colors.border}`,
});

export const sudokuLogoCellStyle = (theme: Theme, isActive: boolean, isDark: boolean = false) => ({
  width: '16px',
  height: '16px',
  backgroundColor: isActive ? theme.colors.info : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(59, 130, 246, 0.1)'),
  borderRadius: '3px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '9px',
  fontWeight: 'bold',
  color: isActive ? 'white' : theme.colors.textSecondary,
  transition: theme.transitions.normal,
});

export const difficultyButtonStyle = (theme: Theme, isHovered: boolean, isDark: boolean) => {
  const baseStyle = {
    padding: '18px 32px',
    fontSize: '20px',
    fontWeight: '600',
    background: isDark
      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)'
      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(14, 165, 233, 0.12) 100%)',
    color: isDark ? '#a5b4fc' : '#2563eb',
    border: isHovered
      ? (isDark
        ? '2px solid rgba(99, 102, 241, 0.5)'
        : '2px solid rgba(59, 130, 246, 0.4)')
      : (isDark
        ? '2px solid rgba(99, 102, 241, 0.25)'
        : '2px solid rgba(59, 130, 246, 0.25)'),
    borderRadius: theme.borderRadius.lg,
    cursor: 'pointer',
    transition: theme.transitions.normal,
    boxShadow: isHovered
      ? (isDark
        ? '0 8px 20px rgba(99, 102, 241, 0.4)'
        : '0 8px 20px rgba(59, 130, 246, 0.35)')
      : (isDark
        ? '0 2px 8px rgba(0, 0, 0, 0.3)'
        : '0 2px 8px rgba(59, 130, 246, 0.15)'),
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    transform: isHovered ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
    width: '100%',
  };

  return baseStyle;
};

export const leaderboardContainerStyle = (theme: Theme) => ({
  position: 'fixed' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: theme === darkTheme ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '20px',
});

export const leaderboardCardStyle = (theme: Theme) => ({
  width: '100%',
  maxWidth: '500px',
  background: theme.gradients.card,
  borderRadius: theme.borderRadius.xl,
  border: `1px solid ${theme.colors.border}`,
  boxShadow: theme.shadows.xl,
  padding: theme.spacing.xl,
  display: 'flex',
  flexDirection: 'column' as const,
  gap: theme.spacing.lg,
  maxHeight: '80vh',
  overflow: 'hidden',
});

export const tabButtonStyle = (theme: Theme, isActive: boolean) => ({
  padding: '12px 24px',
  fontSize: '16px',
  fontWeight: '700',
  background: isActive ? theme.gradients.buttonActive : 'transparent',
  color: isActive ? 'white' : theme.colors.textSecondary,
  border: isActive ? 'none' : theme.borders.thin,
  borderRadius: theme.borderRadius.md,
  cursor: 'pointer',
  transition: theme.transitions.normal,
  textTransform: 'capitalize' as const,
});

/**
 * Theme toggle button styles
 */
export const themeToggleButtonStyle = (theme: Theme) => ({
  padding: '10px 16px',
  borderRadius: theme.borderRadius.md,
  border: theme === darkTheme
    ? '2px solid rgba(251, 191, 36, 0.4)'
    : '2px solid rgba(124, 58, 237, 0.3)',
  background: theme === darkTheme
    ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)'
    : 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
  color: theme === darkTheme ? '#fbbf24' : '#7c3aed',
  cursor: 'pointer',
  transition: theme.transitions.normal,
  fontSize: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '44px',
  height: '44px',
});
