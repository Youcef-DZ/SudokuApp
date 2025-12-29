import React from 'react';
import { ThemeProvider } from 'styled-components/native';
import { theme } from './src/shared/theme';
import GameWrapper from './src/game/GameWrapper';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: 'red' }}>Critcal Application Error</Text>
                    <Text style={{ fontSize: 16, marginBottom: 20 }}>{this.state.error?.message}</Text>
                    <Text style={{ fontSize: 12, color: 'gray' }}>{this.state.error?.stack}</Text>
                </View>
            );
        }

        return this.props.children;
    }
}

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <ErrorBoundary>
                <GameWrapper />
            </ErrorBoundary>
        </ThemeProvider>
    );
}
