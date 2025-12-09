import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './test/setup.ts',
        css: true,
        testTimeout: 10000, // 10 seconds timeout for each test
        hookTimeout: 10000, // 10 seconds timeout for hooks
    },
});
