import React from 'react';
import { ThemeProvider } from 'styled-components/native';
import { theme } from './src/shared/theme';
import GameWrapper from './src/game/GameWrapper';

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <GameWrapper />
        </ThemeProvider>
    );
}
