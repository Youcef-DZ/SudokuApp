import 'react-native-get-random-values';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import 'fast-text-encoding';

import { Platform } from 'react-native';

// Polyfill window.crypto for MSAL
// MSAL requires: getRandomValues (provided by rn-get-random-values) AND subtle.digest

const polyfillCrypto = {
    getRandomValues: (typeof window !== 'undefined' && window.crypto?.getRandomValues)
        ? window.crypto.getRandomValues.bind(window.crypto)
        : global.crypto.getRandomValues,
    subtle: {
        digest: async (algorithm: AlgorithmIdentifier, data: BufferSource): Promise<ArrayBuffer> => {
            // MSAL uses SHA-256 for PKCE
            const algoName = (typeof algorithm === 'string' ? algorithm : algorithm.name).toUpperCase();

            if (algoName !== 'SHA-256') {
                throw new Error(`[Polyfill] Unsupported algorithm: ${algoName}`);
            }

            // Convert BufferSource to Uint8Array
            let dataArray: Uint8Array;
            if (ArrayBuffer.isView(data)) {
                dataArray = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
            } else {
                dataArray = new Uint8Array(data as ArrayBuffer);
            }

            // Expo Crypto expects base64 or string, but digest returns hex or base64.
            // Actually, expo-crypto digest() returns a Promise<Digest> which is ArrayBuffer in newer versions? 
            // Checking docs: digestXAsync returns string (hex/base64).
            // We need ArrayBuffer.

            const digest = await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                Array.from(dataArray).map(b => String.fromCharCode(b)).join(''), // binary string
                { encoding: Crypto.CryptoEncoding.BASE64 } // Request Base64
            );

            // Convert Base64 string back to ArrayBuffer
            const binaryString = atob(digest);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        }
    }
};

// Apply to window/global
if (typeof window !== 'undefined' && Platform.OS !== 'web') {
    // @ts-ignore
    window.crypto = { ...window.crypto, ...polyfillCrypto };

    // Polyfill window.location if missing (React Native)
    // @ts-ignore
    if (!window.location) {
        // @ts-ignore
        window.location = {
            href: 'http://localhost',
            hash: '',
            origin: 'http://localhost',
            host: 'localhost',
            hostname: 'localhost',
            pathname: '/',
            protocol: 'http:',
            search: '',
            assign: () => { },
            replace: () => { },
            reload: () => { },
        } as any;
    }

    // Polyfill window.history if missing
    // @ts-ignore
    if (!window.history) {
        // @ts-ignore
        window.history = {
            pushState: () => { },
            replaceState: () => { },
            go: () => { },
            back: () => { },
            forward: () => { },
            length: 0,
            state: null,
            scrollRestoration: 'auto'
        } as any;
    }

    // Polyfill document if missing
    // @ts-ignore
    if (!window.document) {
        // @ts-ignore
        window.document = {
            createElement: (tag: string) => ({
                style: {},
                setAttribute: () => { },
                getElementsByTagName: () => [],
                appendChild: () => { },
                // Partial HTMLVideoElement/HTMLImageElement stub
                canPlayType: () => '',
                play: () => Promise.resolve(),
                pause: () => { },
            }),
            getElementById: () => null,
            getElementsByTagName: () => [],
            querySelectorAll: () => [],
            head: { appendChild: () => { } },
            body: { appendChild: () => { }, removeChild: () => { } },
            documentElement: { style: {}, clientWidth: 0, clientHeight: 0 },
            location: window.location,
        } as any;
    }

    // Polyfill window dimensions
    // @ts-ignore
    if (!window.innerWidth) window.innerWidth = 0;
    // @ts-ignore
    if (!window.innerHeight) window.innerHeight = 0;

    // Polyfill event listeners
    // @ts-ignore
    if (!window.addEventListener) {
        // @ts-ignore
        window.addEventListener = () => { };
    }
    // @ts-ignore
    if (!window.removeEventListener) {
        // @ts-ignore
        window.removeEventListener = () => { };
    }

    // Polyfill window.open for MSAL Popup
    // @ts-ignore
    if (!window.open) {
        // @ts-ignore
        window.open = (url: string, target: string, features: string) => {


            // Backing field for href
            let _href = url || '';

            // Return a fake window object immediately so MSAL has a handle
            const popupWindow = {
                closed: false,
                close: () => {
                    console.log('[Polyfill] popupWindow.close() called');
                    popupWindow.closed = true;
                },
                location: {
                    get href() { return _href; },
                    set href(val: string) {
                        console.log('[Polyfill] popupWindow.location.href SET to:', val);
                        _href = val;
                        if (val && val !== 'about:blank') {
                            openBrowser(val);
                        }
                    },
                    assign: (url: string) => {
                        console.log('[Polyfill] popupWindow.location.assign called with:', url);
                        popupWindow.location.href = url;
                    },
                    replace: (url: string) => {
                        console.log('[Polyfill] popupWindow.location.replace called with:', url);
                        popupWindow.location.href = url;
                    },
                    reload: () => { },
                    // Basic properties to satisfy MSAL access
                    hash: '',
                    origin: '',
                    protocol: 'https:',
                    toString: () => _href
                },
                focus: () => { },
            };

            const openBrowser = (authUrl: string) => {
                // Launch Native Browser
                WebBrowser.openAuthSessionAsync(authUrl) // no specific return URL scheme specified, usually picks up default
                    .then((result) => {

                        if (result.type === 'success' && result.url) {
                            // Feed the result URL back to the fake window so MSAL can parse it!
                            console.log('[Polyfill] Feeding result URL back to MSAL polling:', result.url);
                            _href = result.url;

                            // Also try to simulate a hash property access if MSAL reads that directly
                            try {
                                const urlObj = new URL(result.url);
                                popupWindow.location.hash = urlObj.hash;
                                // @ts-ignore
                                popupWindow.location.origin = urlObj.origin;
                                // @ts-ignore
                                popupWindow.location.protocol = urlObj.protocol;
                            } catch (e) {
                                // fallback if URL polyfill is flaky
                                if (result.url.includes('#')) {
                                    popupWindow.location.hash = '#' + result.url.split('#')[1];
                                }
                            }
                        } else {
                            // Cancelled or dismissed
                            popupWindow.closed = true;
                        }
                    })
                    .catch(err => {
                        console.error('[Polyfill] Auth Session Failed:', err);
                        popupWindow.closed = true;
                    });
            };

            // If a URL is provided immediately (unlikely for MSAL, but possible)
            if (url && url !== 'about:blank') {
                openBrowser(url);
            }

            return popupWindow;
        };
    }
}

if (typeof self !== 'undefined' && Platform.OS !== 'web') {
    // @ts-ignore
    self.crypto = { ...self.crypto, ...polyfillCrypto };
}




console.log('[Polyfills] Applied. global.crypto:', !!global.crypto, 'window.crypto:', !!(typeof window !== 'undefined' && window.crypto));
