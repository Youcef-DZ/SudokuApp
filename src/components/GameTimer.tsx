import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { getTheme } from '../shared/theme';

interface GameTimerProps {
    elapsedTime: number;
    puzzleId?: number;
    difficulty?: string;
    responsiveCellSize?: number;
    darkMode?: boolean;
}

function formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const InfoContainer = styled.View<{ cellSize: number; darkMode: boolean }>`
  padding: 0px 12px;
  height: 44px;
  border-radius: 6px;
  overflow: hidden;
  justify-content: center;
`;

const InfoText = styled.Text<{ cellSize: number; darkMode: boolean }>`
  font-size: ${props => Math.max(12, props.cellSize * 0.3)}px;
  color: ${props => props.darkMode ? '#a5b4fc' : '#2563eb'};
  font-weight: 600;
`;

const TimerContainer = styled.View<{ cellSize: number }>`
  padding: 0px 12px;
  height: 44px;
  border-radius: 6px;
  overflow: hidden;
  justify-content: center;
`;

const TimerText = styled.Text<{ cellSize: number; darkMode: boolean }>`
  font-size: ${props => Math.max(13, props.cellSize * 0.32)}px;
  color: ${props => props.darkMode ? '#f0abfc' : '#c026d3'};
  font-weight: 700;
`;

export default function GameTimer({
    elapsedTime,
    puzzleId,
    difficulty,
    responsiveCellSize = 50,
    darkMode = false
}: GameTimerProps) {
    const theme = getTheme(darkMode);

    return (
        <Container>
            {/* Puzzle Info */}
            {(difficulty || puzzleId) && (
                <InfoContainer cellSize={responsiveCellSize} darkMode={darkMode}>
                    <LinearGradient
                        colors={theme.gradients.primary}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            opacity: 0.15,
                        }}
                    />
                    <InfoText cellSize={responsiveCellSize} darkMode={darkMode}>
                        {difficulty && <Text style={{ textTransform: 'capitalize' }}>{difficulty}</Text>}
                        {difficulty && puzzleId && <Text> • </Text>}
                        {puzzleId && <Text>#{puzzleId}</Text>}
                    </InfoText>
                </InfoContainer>
            )}

            {/* Timer */}
            <TimerContainer cellSize={responsiveCellSize}>
                <LinearGradient
                    colors={darkMode
                        ? ['rgba(244, 114, 182, 0.15)', 'rgba(192, 38, 211, 0.15)']
                        : ['rgba(244, 114, 182, 0.1)', 'rgba(192, 38, 211, 0.1)']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                />
                <TimerText cellSize={responsiveCellSize} darkMode={darkMode}>
                    ⏱︎ {formatTime(elapsedTime)}
                </TimerText>
            </TimerContainer>
        </Container>
    );
}
