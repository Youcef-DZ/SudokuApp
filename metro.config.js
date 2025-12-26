const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add .native.tsx and .native.ts to resolver extensions
config.resolver.sourceExts.push('tsx', 'ts', 'jsx', 'js', 'json');

// Prioritize .native.tsx and .native.ts files
config.resolver.sourceExts = [
    'native.tsx',
    'native.ts',
    'native.jsx',
    'native.js',
    ...config.resolver.sourceExts,
];

module.exports = config;
