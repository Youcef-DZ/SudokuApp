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

// Critical Fix: Restore Native URL on Web
// Some dependency (likely a React Native polyfill) is overwriting the browser's native URL implementation
// with a broken polyfill (whatwg-url) that fails to support 'decode'.
// We use an iframe to recover the clean, native URL constructor from the browser.
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    try {
        // Check if URL is tainted (not native code)
        if (window.URL.toString().indexOf('[native code]') === -1) {
            console.warn('[Fix] Detected broken URL polyfill. Restoring native URL via iframe...');

            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            if (iframe.contentWindow) {
                const NativeURL = (iframe.contentWindow as any).URL;
                const NativeURLSearchParams = (iframe.contentWindow as any).URLSearchParams;

                // Restore to window and global
                window.URL = NativeURL;
                (window as any).URLSearchParams = NativeURLSearchParams;
                (global as any).URL = NativeURL;
                (global as any).URLSearchParams = NativeURLSearchParams;

                console.log('[Fix] Native URL restored successfully.');
            }

            document.body.removeChild(iframe);
        }
    } catch (e) {
        console.error('[Fix] Failed to restore native URL:', e);
    }
}

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
