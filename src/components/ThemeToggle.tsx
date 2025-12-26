import React from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
// import * as Haptics from 'expo-haptics'; // Breaks React Native Web
import { getTheme } from '../shared/theme';

interface ThemeToggleProps {
    darkMode: boolean;
    onToggle: () => void;
    responsiveCellSize?: number;
}

// Simplified without Reanimated

const ToggleButton = styled(Pressable) <{ darkMode: boolean; cellSize: number }>`
  padding: ${props => Math.max(4, props.cellSize * 0.12)}px ${props => Math.max(12, props.cellSize * 0.3)}px;
  border-radius: 12px;
  background-color: ${props => props.darkMode ? 'rgba(251, 191, 36, 0.15)' : 'rgba(124, 58, 237, 0.15)'};
  border-width: 1px;
  border-color: ${props => props.darkMode ? 'rgba(251, 191, 36, 0.3)' : 'rgba(124, 58, 237, 0.3)'};
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text<{ cellSize: number }>`
  font-size: ${props => Math.max(16, props.cellSize * 0.36)}px;
`;

export default function ThemeToggle({ darkMode, onToggle, responsiveCellSize = 50 }: ThemeToggleProps) {
    const theme = getTheme(darkMode);

    const handlePress = () => {
        // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onToggle();
    };

    return (
        <ToggleButton
            onPress={handlePress}
            darkMode={darkMode}
            cellSize={responsiveCellSize}
        >
            <ButtonText cellSize={responsiveCellSize}>
                {darkMode ? '☀️' : '🌙'}
            </ButtonText>
        </ToggleButton>
    );
}
