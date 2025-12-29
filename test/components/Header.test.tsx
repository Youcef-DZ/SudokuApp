import { render, fireEvent } from '@testing-library/react-native';
import Header from '../../src/components/Header';

// Mock child components
jest.mock('../../src/components/GameTimer', () => 'GameTimer');
jest.mock('../../src/components/ThemeToggle', () => 'ThemeToggle');

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
        expect(getByText('Login')).toBeTruthy();
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

    describe('Authentication State', () => {
        it('should show Login button when not authenticated', () => {
            const { getByText } = render(<Header {...defaultProps} isAuthenticated={false} />);

            const loginBtn = getByText('Login');
            expect(loginBtn).toBeTruthy();

            fireEvent.press(loginBtn);
            expect(defaultProps.onLogin).toHaveBeenCalledTimes(1);
        });

        it('should show User Name when authenticated', () => {
            const { getByText, queryByText } = render(
                <Header
                    {...defaultProps}
                    isAuthenticated={true}
                    userName="TestUser"
                />
            );

            expect(queryByText('Login')).toBeNull();
            expect(getByText('TestUser')).toBeTruthy();
        });

        it('should call onLogout when User Name is pressed', () => {
            const { getByText } = render(
                <Header
                    {...defaultProps}
                    isAuthenticated={true}
                    userName="TestUser"
                />
            );

            fireEvent.press(getByText('TestUser'));
            expect(defaultProps.onLogout).toHaveBeenCalledTimes(1);
        });
    });
});
