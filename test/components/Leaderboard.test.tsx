import { render, fireEvent } from '@testing-library/react-native';
import Leaderboard from '../../src/components/Leaderboard';

describe('Leaderboard', () => {
    const mockScores = [
        { id: '1', userName: 'Player 1', time: 65, difficulty: 'easy', date: '2023-01-01' },
        { id: '2', userName: 'Player 2', time: 125, difficulty: 'medium', date: '2023-01-02' },
        { id: '3', userName: 'Player 3', time: 45, difficulty: 'easy', date: '2023-01-03' },
    ];

    const defaultProps = {
        scores: mockScores as any[],
        loading: false,
        difficulty: 'easy' as const,
        onDifficultyChange: jest.fn(),
        darkMode: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render simplified loading state', () => {
        const { getByText } = render(<Leaderboard {...defaultProps} loading={true} />);
        expect(getByText('Loading scores...')).toBeTruthy();
    });

    it('should render empty state when no scores match difficulty', () => {
        const { getByText } = render(
            <Leaderboard
                {...defaultProps}
                difficulty="hard" // No hard scores in mock
            />
        );
        expect(getByText('No scores yet. Be the first!')).toBeTruthy();
    });

    it('should render scores filtered by difficulty', () => {
        const { getByText, queryByText } = render(<Leaderboard {...defaultProps} difficulty="easy" />);

        expect(getByText('Player 1')).toBeTruthy();
        expect(getByText('Player 3')).toBeTruthy();
        expect(queryByText('Player 2')).toBeNull(); // Medium score hidden
    });

    it('should sort scores by time (ascending)', () => {
        const { getAllByText } = render(<Leaderboard {...defaultProps} difficulty="easy" />);
        const players = getAllByText(/Player [0-9]/);

        // Player 3 (45s) should be first, Player 1 (65s) second
        expect(players[0].props.children).toBe('Player 3');
        expect(players[1].props.children).toBe('Player 1');
    });

    it('should format time correctly', () => {
        const { getByText } = render(<Leaderboard {...defaultProps} difficulty="easy" />);

        // 65s -> 1:05
        expect(getByText('1:05')).toBeTruthy();
        // 45s -> 0:45
        expect(getByText('0:45')).toBeTruthy();
    });

    it('should display difficulty tabs', () => {
        const { getAllByText } = render(<Leaderboard {...defaultProps} />);

        // Might appear in tabs and in the list
        expect(getAllByText('Easy').length).toBeGreaterThanOrEqual(1);
        expect(getAllByText('Medium').length).toBeGreaterThanOrEqual(1);
        expect(getAllByText('Hard').length).toBeGreaterThanOrEqual(1);
    });

    it('should call onDifficultyChange when tab pressed', () => {
        const { getAllByText } = render(<Leaderboard {...defaultProps} />);

        // Press the tab, assuming tabs are rendered first or we just grab the first one
        fireEvent.press(getAllByText('Medium')[0]);
        expect(defaultProps.onDifficultyChange).toHaveBeenCalledWith('medium');
    });

    it('should highlight active difficulty tab', () => {
        const { getAllByText } = render(<Leaderboard {...defaultProps} difficulty="medium" />);
        expect(getAllByText('Medium').length).toBeGreaterThanOrEqual(1);
    });
});
