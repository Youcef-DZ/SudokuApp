// Jest setup for React Native Testing Library
// Note: extend-expect is built-in since @testing-library/react-native v12.4+

// Mock expo modules
jest.mock('expo-linear-gradient', () => ({
    LinearGradient: 'LinearGradient',
}));

jest.mock('expo-haptics', () => ({
    impactAsync: jest.fn(),
    ImpactFeedbackStyle: {
        Light: 'light',
        Medium: 'medium',
        Heavy: 'heavy',
    },
}));

// Mock Descope
jest.mock('@descope/react-sdk', () => ({
    useDescope: () => ({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
    }),
    useSession: () => ({
        isAuthenticated: false,
        sessionToken: null,
    }),
    useUser: () => ({
        user: null,
        isUserLoading: false,
    }),
    AuthProvider: ({ children }: any) => children,
    Descope: () => null,
}));

// Mock KeyboardEvent for React Native (doesn't exist in RN)
global.KeyboardEvent = class KeyboardEvent {
    key: string;
    constructor(type: string, init: { key: string }) {
        this.key = init.key;
    }
} as any;

// Suppress console warnings in tests
global.console = {
    ...console,
    warn: jest.fn(),
    error: jest.fn(),
};
