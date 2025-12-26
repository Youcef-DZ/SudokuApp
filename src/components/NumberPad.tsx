import React from 'react';
import { View, Pressable, Text } from 'react-native';
import styled from 'styled-components/native';
// import * as Haptics from 'expo-haptics'; // Breaks React Native Web
import { getTheme } from '../shared/theme';

interface NumberPadProps {
    selectedCell: { row: number; col: number } | null;
    onNumberInput: (num: number) => void;
    boardSize: number;
    darkMode?: boolean;
}

// Simplified without Reanimated animations

const Container = styled.View<{ boardSize: number }>`
  flex-direction: row;
  flex-wrap: wrap;
  width: ${props => props.boardSize}px;
  padding: 4px;
  justify-content: center;
`;

const NumberButton = styled(Pressable) <{ disabled: boolean; darkMode: boolean }>`
  width: ${props => (props.boardSize - 60) / 5}px;
  height: 50px;
  margin: 5px;
  border-radius: 12px;
  background-color: ${props => props.disabled
        ? (props.darkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.5)')
        : (props.darkMode ? 'rgba(155, 89, 255, 0.2)' : 'rgba(124, 58, 237, 0.15)')
    };
  border-width: 2px;
  border-color: ${props => props.disabled
        ? (props.darkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.8)')
        : (props.darkMode ? 'rgba(155, 89, 255, 0.4)' : 'rgba(124, 58, 237, 0.3)')
    };
  align-items: center;
  justify-content: center;
`;

const ClearButton = styled(Pressable) <{ disabled: boolean; darkMode: boolean }>`
  width: ${props => (props.boardSize - 60) / 5}px;
  height: 50px;
  margin: 5px;
  border-radius: 12px;
  background-color: ${props => props.disabled
        ? (props.darkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.5)')
        : (props.darkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(220, 38, 38, 0.15)')
    };
  border-width: 2px;
  border-color: ${props => props.disabled
        ? (props.darkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.8)')
        : (props.darkMode ? 'rgba(239, 68, 68, 0.4)' : 'rgba(220, 38, 38, 0.3)')
    };
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text<{ disabled: boolean; darkMode: boolean }>`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.disabled
        ? (props.darkMode ? '#6b7280' : '#9ca3af')
        : (props.darkMode ? '#e9d5ff' : '#7c3aed')
    };
`;

const ClearButtonText = styled.Text<{ disabled: boolean; darkMode: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.disabled
        ? (props.darkMode ? '#6b7280' : '#9ca3af')
        : (props.darkMode ? '#fca5a5' : '#dc2626')
    };
`;

function NumberPadButton({
    num,
    disabled,
    darkMode,
    onPress,
    boardSize
}: {
    num: number;
    disabled: boolean;
    darkMode: boolean;
    onPress: () => void;
    boardSize: number;
}) {
    const handlePress = () => {
        if (!disabled) {
            // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onPress();
        }
    };

    if (num === 0) {
        return (
            <ClearButton
                onPress={handlePress}
                disabled={disabled}
                darkMode={darkMode}
                boardSize={boardSize}
            >
                <ClearButtonText disabled={disabled} darkMode={darkMode}>
                    Clear
                </ClearButtonText>
            </ClearButton>
        );
    }

    return (
        <NumberButton
            onPress={handlePress}
            disabled={disabled}
            darkMode={darkMode}
            boardSize={boardSize}
        >
            <ButtonText disabled={disabled} darkMode={darkMode}>
                {num}
            </ButtonText>
        </NumberButton>
    );
}

export default function NumberPad({
    selectedCell,
    onNumberInput,
    boardSize,
    darkMode = false
}: NumberPadProps) {
    const theme = getTheme(darkMode);

    return (
        <Container boardSize={boardSize}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                <NumberPadButton
                    key={num}
                    num={num}
                    disabled={!selectedCell}
                    darkMode={darkMode}
                    onPress={() => onNumberInput(num)}
                    boardSize={boardSize}
                />
            ))}
        </Container>
    );
}
