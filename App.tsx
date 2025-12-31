import './src/shared/fixUrlPolyfill';
import './src/shared/polyfills';
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

import { ThemeProvider } from 'styled-components/native';
import { PublicClientApplication, EventType, AuthenticationResult } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { theme } from './src/shared/theme';
import { msalConfig } from './src/shared/msalConfig';
import GameWrapper from './src/game/GameWrapper';

const msalInstance = new PublicClientApplication(msalConfig);

// Set active account on page load


msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const payload = event.payload as AuthenticationResult;
        msalInstance.setActiveAccount(payload.account);
    }
});

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
    const [isMsalInitialized, setIsMsalInitialized] = useState(false);

    useEffect(() => {
        msalInstance.initialize().then(() => {
            // Set active account on page load
            if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
                msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
            }
            setIsMsalInitialized(true);
        }).catch(e => {
            console.error("MSAL Initialization Error:", e);
        });
    }, []);

    if (!isMsalInitialized) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' }}>
                <Text>Initializing Authentication...</Text>
            </View>
        );
    }

    return (
        <MsalProvider instance={msalInstance}>
            <ThemeProvider theme={theme}>
                <ErrorBoundary>
                    <GameWrapper />
                </ErrorBoundary>
            </ThemeProvider>
        </MsalProvider>
    );
}
