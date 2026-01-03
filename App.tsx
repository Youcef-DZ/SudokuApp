import './src/shared/polyfills';
import './src/shared/fixUrlPolyfill';
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

import { ThemeProvider } from 'styled-components/native';
import { PublicClientApplication, EventType, AuthenticationResult } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { theme } from './src/shared/theme';
import { msalConfig } from './src/shared/msalConfig';
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
    const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);


    useEffect(() => {
        const initMsal = async () => {
            try {
                // Verify Polyfill Functionality
                if (window.crypto && window.crypto.getRandomValues) {
                    try {
                        const testArr = new Uint8Array(4);
                        window.crypto.getRandomValues(testArr);

                    } catch (e) {
                        console.error('[App.tsx] Crypto Functionality Test FAILED:', e);
                    }
                } else {
                    console.error('[App.tsx] window.crypto.getRandomValues is MISSING inside useEffect');
                }


                const pca = new PublicClientApplication(msalConfig);

                // Add event callback
                pca.addEventCallback((event) => {
                    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
                        const payload = event.payload as AuthenticationResult;
                        pca.setActiveAccount(payload.account);
                    }
                });

                // Initialize
                await pca.initialize();

                // Set active account on page load
                if (!pca.getActiveAccount() && pca.getAllAccounts().length > 0) {
                    pca.setActiveAccount(pca.getAllAccounts()[0]);
                }

                setMsalInstance(pca);
            } catch (error) {
                console.error("MSAL Initialization Failed (Stack Trace):", error);
                // @ts-ignore
                if (error.errorCode) console.error("Error Code:", error.errorCode);
                // @ts-ignore
                if (error.errorMessage) console.error("Error Message:", error.errorMessage);
                // @ts-ignore
                if (error.stack) console.error("Stack:", error.stack);
            }
        };

        initMsal();
    }, []);

    if (!msalInstance) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' }}>
                <Text>Initializing Authentication...</Text>
            </View>
        );
    }

    return (
        <MsalProvider instance={msalInstance}>
            <ThemeProvider theme={theme}>
                <View style={{ flex: 1, height: '100%', width: '100%', overflow: 'hidden' }}>
                    <ErrorBoundary>
                        <GameWrapper />
                    </ErrorBoundary>
                </View>
            </ThemeProvider>
        </MsalProvider>
    );
}
