import { render } from '@testing-library/react-native';
import GameTimer from '../../src/components/GameTimer';

describe('GameTimer', () => {
    it('should render timer with formatted time', () => {
        const { getByText } = render(<GameTimer elapsedTime={125} darkMode={false} />);

        expect(getByText(/⏱︎/)).toBeTruthy();
        expect(getByText(/2:05/)).toBeTruthy();
    });

    it('should display puzzle ID when provided', () => {
        const { getByText } = render(<GameTimer elapsedTime={0} puzzleId={42} darkMode={false} />);

        expect(getByText(/#42/)).toBeTruthy();
    });

    it('should display difficulty when provided', () => {
        const { getByText } = render(<GameTimer elapsedTime={0} difficulty="medium" darkMode={false} />);

        expect(getByText(/medium/i)).toBeTruthy();
    });

    it('should display both difficulty and puzzle ID with separator', () => {
        const { getByText } = render(<GameTimer elapsedTime={0} difficulty="hard" puzzleId={10} darkMode={false} />);

        expect(getByText(/hard/i)).toBeTruthy();
        expect(getByText(/#10/)).toBeTruthy();
        expect(getByText(/•/)).toBeTruthy();
    });

    it('should format time correctly for different durations', () => {
        const { getByText, rerender } = render(<GameTimer elapsedTime={0} darkMode={false} />);
        expect(getByText(/0:00/)).toBeTruthy();

        rerender(<GameTimer elapsedTime={65} darkMode={false} />);
        expect(getByText(/1:05/)).toBeTruthy();

        rerender(<GameTimer elapsedTime={3661} darkMode={false} />);
        expect(getByText(/1:01:01/)).toBeTruthy();
    });
});
