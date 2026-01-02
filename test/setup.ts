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

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
    FontAwesome: 'FontAwesome',
}));

// Mock styled-components/native
jest.mock('styled-components/native', () => {
    // The default export is a function styled(Component)
    const mockStyled = (Component: any) => {
        // It returns a function that parses the template literal
        return () => {
            const MockComponent = ({ children, ...props }: any) => {
                const React = require('react');
                // Check if Component is Pressable/View mock and map if needed, or just wrap
                // For simplicity, just render the Component but inject data-testid
                const newProps = { ...props, 'data-testid': props.testID };
                // Force div if testID is present to ensure it appears in DOM despite RN mock stripping
                const finalComponent = props.testID ? 'div' : Component;
                return React.createElement(finalComponent, newProps, children);
            };
            // Try to set a useful name
            MockComponent.displayName = `Styled(${Component.displayName || Component.name || 'Component'})`;
            return MockComponent;
        }
    };

    // Add properties for styled.View, styled.Text, etc.
    const aliases = ['View', 'Text', 'Pressable', 'TouchableOpacity', 'Image', 'SafeAreaView', 'ScrollView', 'TextInput'];
    aliases.forEach((alias) => {
        // @ts-ignore
        mockStyled[alias] = () => {
            // Return a component that renders a primitive with the same name
            // utilizing React.createElement to mimic the native component
            const MockComponent = ({ children, ...props }: any) => {
                const React = require('react');
                // Map Pressable/View to div to ensure props like data-testid are preserved in JSDOM output
                const componentName = alias === 'Pressable' || alias === 'TouchableOpacity' || alias === 'View' ? 'div' : alias;
                // Explicitly pass data-testid for RNTL web-like environments
                const newProps = { ...props, 'data-testid': props.testID };
                return React.createElement(componentName, newProps, children);
            };
            MockComponent.displayName = alias;
            return MockComponent;
        };
    });

    return {
        __esModule: true,
        default: mockStyled,
        ThemeProvider: ({ children }: any) => children,
        useTheme: () => ({ gradients: { primary: ['#000', '#fff'] } }),
        css: () => { },
    };
});

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
