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
                // Cast to any to access URL and URLSearchParams properties safely
                const NativeURL = (iframe.contentWindow as any).URL;
                const NativeURLSearchParams = (iframe.contentWindow as any).URLSearchParams;

                // Restore to window and global
                window.URL = NativeURL;
                (window as any).URLSearchParams = NativeURLSearchParams;
                (global as any).URL = NativeURL;
                (global as any).URLSearchParams = NativeURLSearchParams;
            }

            document.body.removeChild(iframe);
        }
    } catch (e) {
        console.error('[Fix] Failed to restore native URL:', e);
    }
}
