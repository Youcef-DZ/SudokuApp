// React Native Theme System
// Converted from index.css with styled-components support

export const theme = {
    colors: {
        // Vibrant Color Palette
        primaryPurple: 'hsl(270, 70%, 60%)',
        primaryBlue: 'hsl(220, 85%, 60%)',
        primaryTeal: 'hsl(180, 70%, 50%)',
        accentPink: 'hsl(330, 80%, 65%)',
        accentOrange: 'hsl(25, 95%, 60%)',

        // Light mode
        lightBackground: '#f3f4f6',
        lightText: '#111827',
        lightBorder: '#e5e7eb',

        // Dark mode
        darkBackground: '#111827',
        darkText: '#f9fafb',
        darkBorder: '#374151',
    },

    gradients: {
        primary: ['hsl(270, 70%, 60%)', 'hsl(220, 85%, 60%)', 'hsl(180, 70%, 50%)'],
        success: ['hsl(150, 70%, 50%)', 'hsl(180, 70%, 50%)'],
        error: ['hsl(0, 80%, 60%)', 'hsl(330, 80%, 65%)'],
        glow: ['rgba(155, 89, 255, 0.4)', 'rgba(64, 150, 255, 0.4)'],
    },

    // Glassmorphism effects (using BlurView + background colors)
    glass: {
        light: {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            blurIntensity: 12,
        },
        dark: {
            backgroundColor: 'rgba(17, 24, 39, 0.7)',
            borderColor: 'rgba(75, 85, 99, 0.3)',
            blurIntensity: 12,
        },
    },

    // Shadows (React Native style)
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 2, // Android
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 4,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 32,
            elevation: 8,
        },
        glow: {
            shadowColor: 'rgba(155, 89, 255, 0.5)',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 24,
            elevation: 12,
        },
        glowBlue: {
            shadowColor: 'rgba(64, 150, 255, 0.5)',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 20,
            elevation: 10,
        },
        glowTeal: {
            shadowColor: 'rgba(45, 212, 191, 0.5)',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 20,
            elevation: 10,
        },
    },

    // Typography
    fonts: {
        regular: 'Inter_400Regular',
        medium: 'Inter_500Medium',
        semibold: 'Inter_600SemiBold',
        bold: 'Inter_700Bold',
        extrabold: 'Inter_800ExtraBold',
    },

    fontSizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
    },

    // Spacing
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        '2xl': 48,
        '3xl': 64,
    },

    // Border radius
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        '2xl': 24,
        full: 9999,
    },
};

export type Theme = typeof theme;

// Helper function to get theme colors based on dark mode
export const getTheme = (isDark: boolean) => ({
    ...theme,
    backgroundColor: isDark ? theme.colors.darkBackground : theme.colors.lightBackground,
    textColor: isDark ? theme.colors.darkText : theme.colors.lightText,
    borderColor: isDark ? theme.colors.darkBorder : theme.colors.lightBorder,
    glass: isDark ? theme.glass.dark : theme.glass.light,
});
