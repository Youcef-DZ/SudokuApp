import { View, Pressable } from 'react-native';
import styled from 'styled-components/native';
import type { ScoreData } from '../data/Database';

interface LeaderboardProps {
    scores: ScoreData[];
    loading: boolean;
    difficulty: 'easy' | 'medium' | 'hard';
    onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
    darkMode: boolean;
}

const FilterRow = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-bottom: 16px;
  justify-content: center;
`;

const FilterButton = styled(Pressable) <{ active: boolean; darkMode: boolean }>`
  padding: 8px 16px;
  border-radius: 8px;
  background-color: ${props => props.active
        ? (props.darkMode ? 'rgba(124, 58, 237, 0.3)' : 'rgba(124, 58, 237, 0.2)')
        : (props.darkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(229, 231, 235, 0.5)')
    };
  border: 1px solid ${props => props.active
        ? (props.darkMode ? '#9333ea' : '#7c3aed')
        : (props.darkMode ? '#374151' : '#d1d5db')
    };
`;

const FilterText = styled.Text<{ active: boolean; darkMode: boolean }>`
  color: ${props => props.active
        ? (props.darkMode ? '#e9d5ff' : '#7c3aed')
        : (props.darkMode ? '#9ca3af' : '#6b7280')
    };
  font-weight: ${props => props.active ? '600' : '400'};
`;

const ScoreRow = styled.View<{ darkMode: boolean; isHeader?: boolean }>`
  flex-direction: row;
  padding: 12px 0;
  border-bottom-width: ${props => props.isHeader ? '2px' : '1px'};
  border-bottom-color: ${props => props.darkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.8)'};
`;

const ScoreText = styled.Text<{ darkMode: boolean; bold?: boolean; flex: number }>`
  flex: ${props => props.flex};
  color: ${props => props.darkMode ? '#e5e7eb' : '#1f2937'};
  font-weight: ${props => props.bold ? '700' : '400'};
  text-align: left;
`;

const LoadingText = styled.Text<{ darkMode: boolean }>`
  color: ${props => props.darkMode ? '#9ca3af' : '#6b7280'};
  text-align: center;
  margin: 20px 0;
`;

const EmptyText = styled.Text<{ darkMode: boolean }>`
  color: ${props => props.darkMode ? '#9ca3af' : '#6b7280'};
  text-align: center;
  margin: 20px 0;
`;

const ScrollContainer = styled.ScrollView`
  max-height: 300px;
`;

export default function Leaderboard({ scores, loading, difficulty, onDifficultyChange, darkMode }: LeaderboardProps) {
    const filteredScores = scores
        .filter(score => score.difficulty === difficulty)
        .sort((a, b) => a.time - b.time)
        .slice(0, 20);

    return (
        <View style={{ width: '90%' }}>
            <FilterRow>
                {(['easy', 'medium', 'hard'] as const).map(diff => (
                    <FilterButton
                        key={diff}
                        active={difficulty === diff}
                        darkMode={darkMode}
                        onPress={() => onDifficultyChange(diff)}
                    >
                        <FilterText active={difficulty === diff} darkMode={darkMode}>
                            {diff.charAt(0).toUpperCase() + diff.slice(1)}
                        </FilterText>
                    </FilterButton>
                ))}
            </FilterRow>

            {loading ? (
                <LoadingText darkMode={darkMode}>Loading scores...</LoadingText>
            ) : (
                <>
                    <ScoreRow darkMode={darkMode} isHeader>
                        <ScoreText darkMode={darkMode} bold flex={0.7}>#</ScoreText>
                        <ScoreText darkMode={darkMode} bold flex={2.3}>Player</ScoreText>
                        <ScoreText darkMode={darkMode} bold flex={1.3}>Time</ScoreText>
                        <ScoreText darkMode={darkMode} bold flex={1.7}>Date</ScoreText>
                    </ScoreRow>

                    <ScrollContainer key="scroll-container">
                        {filteredScores.length === 0 ? (
                            <EmptyText darkMode={darkMode}>
                                No scores yet. Be the first!
                            </EmptyText>
                        ) : (
                            <>
                                {filteredScores.map((score, index) => {
                                    const key = score.id || `${score.userName}-${score.time}-${index}`;
                                    const minutes = Math.floor(score.time / 60);
                                    const seconds = score.time % 60;
                                    const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                                    const dateStr = score.date ? new Date(score.date).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    }) : '-';

                                    return (
                                        <ScoreRow key={key} darkMode={darkMode}>
                                            <ScoreText darkMode={darkMode} flex={0.7}>{index + 1}</ScoreText>
                                            <ScoreText darkMode={darkMode} flex={2.3} numberOfLines={1} ellipsizeMode="tail">{score.userName}</ScoreText>
                                            <ScoreText darkMode={darkMode} flex={1.3}>{timeStr}</ScoreText>
                                            <ScoreText darkMode={darkMode} flex={1.7}>{dateStr}</ScoreText>
                                        </ScoreRow>
                                    );
                                })}
                            </>
                        )}
                    </ScrollContainer>
                </>
            )}
        </View>
    );
}
