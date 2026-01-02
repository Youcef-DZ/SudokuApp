import { render, fireEvent } from '@testing-library/react-native';
import Header from '../../src/components/Header';

// Mock child components
jest.mock('../../src/components/GameTimer', () => 'GameTimer');
jest.mock('../../src/components/SettingsModal', () => 'SettingsModal');

describe('Header', () => {
    const defaultProps = {
        onNewGame: jest.fn(),
        onLogin: jest.fn(),
        onLogout: jest.fn(),
        onToggleTheme: jest.fn(),
        onShowLeaderboard: jest.fn(),
        responsiveCellSize: 40,
        darkMode: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render simple title layout when showTimer is false', () => {
        const { getByText, queryByText } = render(
            <Header
                {...defaultProps}
                title="Sudoku"
                showTimer={false}
                showNewGameButton={false}
            />
        );

        expect(getByText('Sudoku')).toBeTruthy();
        expect(queryByText('New Game')).toBeNull();
    });

    it('should render full game layout with buttons', () => {
        const { getByText } = render(<Header {...defaultProps} />);

        expect(getByText('New Game')).toBeTruthy();
        expect(getByText('🏆')).toBeTruthy(); // Leaderboard icon
        // Settings icon is rendered by Ionicons mock as string 'Ionicons'
        // But the button wraps it. We can check if SettingsModal is present based on state, 
        // but easier to check if Settings button exists. 
        // Since we mock Ionicons as 'Ionicons', we can probably find it?
        // Actually, just checking that it doesn't crash is good, but let's check for SettingsModal being rendered 
        // (starts hidden/visible based on state, but component should be in tree).
    });

    it('should call onNewGame when New Game button is pressed', () => {
        const { getByText } = render(<Header {...defaultProps} />);

        fireEvent.press(getByText('New Game'));
        expect(defaultProps.onNewGame).toHaveBeenCalledTimes(1);
    });

    it('should call onShowLeaderboard when trophy button is pressed', () => {
        const { getByText } = render(<Header {...defaultProps} />);

        fireEvent.press(getByText('🏆'));
        expect(defaultProps.onShowLeaderboard).toHaveBeenCalledTimes(1);
    });
});
