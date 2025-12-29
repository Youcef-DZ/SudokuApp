import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
// import * as Haptics from 'expo-haptics'; // Breaks React Native Web
import { getTheme } from '../shared/theme';
import ThemeToggle from './ThemeToggle';
import GameTimer from './GameTimer';

interface GameHeaderProps {
    onNewGame?: (difficulty?: string) => void;
    onLogin?: () => void;
    onLogout?: () => void;
    primaryColor?: string;
    responsiveCellSize?: number;
    isAuthenticated?: boolean;
    userName?: string;
    userEmail?: string;
    elapsedTime?: number;
    darkMode?: boolean;
    onToggleTheme?: () => void;
    title?: string;
    showTimer?: boolean;
    showNewGameButton?: boolean;
    showDivider?: boolean;
    puzzleId?: number;
    difficulty?: string;
    onShowLeaderboard?: () => void;
}

const Container = styled.View`
  padding: 16px 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const GameContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-horizontal: 4px;
  min-height: 60px;
`;

const LeftSection = styled.View`
  flex: 0.8;
  align-items: flex-start;
`;

const CenterSection = styled.View`
  flex: 1.4;
  align-items: center;
`;

const RightSection = styled.View`
  flex: 0.8;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
`;

const Title = styled.Text<{ darkMode: boolean }>`
  font-weight: 700;
  font-size: 24px;
  letter-spacing: 0.5px;
`;

const VersionText = styled.Text<{ darkMode: boolean }>`
  font-size: 10px;
  color: ${props => props.darkMode ? '#64748b' : '#94a3b8'};
  position: absolute;
  bottom: -4px;
  right: -5px;
  font-weight: 700;
`;


const NewGameButton = styled(Pressable) <{ cellSize: number; darkMode: boolean }>`
  padding: 0px 12px;
  height: 44px;
  border-radius: 12px;
  background-color: ${props => props.darkMode ? 'rgba(34, 197, 94, 0.15)' : 'rgba(22, 163, 74, 0.15)'};
  border-width: 2px;
  border-color: ${props => props.darkMode ? 'rgba(34, 197, 94, 0.4)' : 'rgba(22, 163, 74, 0.3)'};
  align-items: center;
  justify-content: center;
`;

const NewGameText = styled.Text<{ cellSize: number; darkMode: boolean }>`
  font-size: ${props => Math.max(14, props.cellSize * 0.32)}px;
  font-weight: 600;
  color: ${props => props.darkMode ? '#4ade80' : '#16a34a'};
`;

const LeaderboardButton = styled(Pressable) <{ cellSize: number; darkMode: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: ${props => props.darkMode ? 'rgba(251, 191, 36, 0.15)' : 'rgba(124, 58, 237, 0.15)'};
  border-width: 2px;
  border-color: ${props => props.darkMode ? 'rgba(251, 191, 36, 0.4)' : 'rgba(124, 58, 237, 0.3)'};
  align-items: center;
  justify-content: center;
`;

const ButtonEmoji = styled.Text<{ cellSize: number }>`
  font-size: ${props => Math.max(16, props.cellSize * 0.36)}px;
`;


const LoginButton = styled(Pressable) <{ cellSize: number; darkMode: boolean }>`
  padding: 0px 12px;
  height: 44px;
  border-radius: 12px;
  background-color: ${props => props.darkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.15)'};
  border-width: 2px;
  border-color: ${props => props.darkMode ? 'rgba(59, 130, 246, 0.4)' : 'rgba(37, 99, 235, 0.3)'};
  align-items: center;
  justify-content: center;
`;

const LoginText = styled.Text<{ cellSize: number; darkMode: boolean }>`
  font-size: ${props => Math.max(14, props.cellSize * 0.32)}px;
  font-weight: 600;
  color: ${props => props.darkMode ? '#60a5fa' : '#2563eb'};
`;

const UserText = styled.Text<{ cellSize: number; darkMode: boolean }>`  
  font-size: ${props => Math.max(14, props.cellSize * 0.32)}px;
  font-weight: 600;
  color: ${props => props.darkMode ? '#a5f3fc' : '#0891b2'};
`;

export default function GameHeader({
    onNewGame,
    onLogin,
    onLogout,
    responsiveCellSize = 50,
    isAuthenticated = false,
    userName,
    userEmail,
    elapsedTime = 0,
    darkMode = false,
    onToggleTheme,
    title,
    showTimer = true,
    showNewGameButton = true,
    puzzleId,
    difficulty,
    onShowLeaderboard
}: GameHeaderProps) {
    const theme = getTheme(darkMode);

    // Simple layout for pages without game controls
    if (!showTimer && !showNewGameButton && title) {
        return (
            <Container>
                <LinearGradient
                    colors={theme.gradients.primary as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1 }}
                />
                <TitleContainer>
                    <Title darkMode={darkMode}>Sudoku</Title>
                    <VersionText darkMode={darkMode}>v1.1</VersionText>
                </TitleContainer>
                <RightSection>
                    {onToggleTheme && (
                        <ThemeToggle
                            darkMode={darkMode}
                            onToggle={onToggleTheme}
                            responsiveCellSize={responsiveCellSize}
                        />
                    )}
                    {isAuthenticated ? (
                        <Pressable onPress={onLogout}>
                            <UserText cellSize={responsiveCellSize} darkMode={darkMode}>
                                {userName || userEmail}
                            </UserText>
                        </Pressable>
                    ) : (
                        <LoginButton
                            cellSize={responsiveCellSize}
                            darkMode={darkMode}
                            onPress={() => {
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                onLogin?.();
                            }}
                        >
                            <LoginText cellSize={responsiveCellSize} darkMode={darkMode}>Login</LoginText>
                        </LoginButton>
                    )}
                </RightSection>
            </Container>
        );
    }

    // Full game layout
    return (
        <GameContainer>
            <LeftSection>
                {showNewGameButton && onNewGame && (
                    <NewGameButton
                        cellSize={responsiveCellSize}
                        darkMode={darkMode}
                        onPress={() => {
                            // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            onNewGame();
                        }}
                    >
                        <NewGameText cellSize={responsiveCellSize} darkMode={darkMode}>
                            New Game
                        </NewGameText>
                    </NewGameButton>
                )}
            </LeftSection>

            <CenterSection>
                {showTimer && (
                    <GameTimer
                        elapsedTime={elapsedTime}
                        puzzleId={puzzleId}
                        difficulty={difficulty}
                        responsiveCellSize={responsiveCellSize}
                        darkMode={darkMode}
                    />
                )}
            </CenterSection>

            <RightSection>
                {onShowLeaderboard && (
                    <LeaderboardButton
                        cellSize={responsiveCellSize}
                        darkMode={darkMode}
                        onPress={() => {
                            // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            onShowLeaderboard();
                        }}
                    >
                        <ButtonEmoji cellSize={responsiveCellSize}>🏆</ButtonEmoji>
                    </LeaderboardButton>
                )}
                {onToggleTheme && (
                    <ThemeToggle
                        darkMode={darkMode}
                        onToggle={onToggleTheme}
                        responsiveCellSize={responsiveCellSize}
                    />
                )}
                {isAuthenticated ? (
                    <Pressable onPress={onLogout}>
                        <UserText cellSize={responsiveCellSize} darkMode={darkMode}>
                            {userName || 'User'}
                        </UserText>
                    </Pressable>
                ) : (
                    onLogin && (
                        <LoginButton
                            cellSize={responsiveCellSize}
                            darkMode={darkMode}
                            onPress={() => {
                                // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                onLogin();
                            }}
                        >
                            <LoginText cellSize={responsiveCellSize} darkMode={darkMode}>Login</LoginText>
                        </LoginButton>
                    )
                )}
            </RightSection>
        </GameContainer>
    );
}
