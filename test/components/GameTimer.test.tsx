import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GameTimer from '../../src/framer/components/GameTimer.tsx';

describe('GameTimer', () => {
    it('should render timer with formatted time', () => {
        render(<GameTimer elapsedTime={125} darkMode={false} />);

        const timer = screen.getByText('⏱︎');
        expect(timer).toBeInTheDocument();
        expect(screen.getByText('2:05')).toBeInTheDocument();
    });

    it('should display puzzle ID when provided', () => {
        render(<GameTimer elapsedTime={0} puzzleId={42} darkMode={false} />);

        expect(screen.getByText('#42')).toBeInTheDocument();
    });

    it('should display difficulty when provided', () => {
        render(<GameTimer elapsedTime={0} difficulty="medium" darkMode={false} />);

        expect(screen.getByText('medium')).toBeInTheDocument();
    });

    it('should display both difficulty and puzzle ID with separator', () => {
        render(<GameTimer elapsedTime={0} difficulty="hard" puzzleId={10} darkMode={false} />);

        expect(screen.getByText('hard')).toBeInTheDocument();
        expect(screen.getByText('#10')).toBeInTheDocument();
        expect(screen.getByText('•')).toBeInTheDocument();
    });

    it('should format time correctly for different durations', () => {
        const { rerender } = render(<GameTimer elapsedTime={0} darkMode={false} />);
        expect(screen.getByText('0:00')).toBeInTheDocument();

        rerender(<GameTimer elapsedTime={65} darkMode={false} />);
        expect(screen.getByText('1:05')).toBeInTheDocument();

        rerender(<GameTimer elapsedTime={3661} darkMode={false} />);
        expect(screen.getByText('1:01:01')).toBeInTheDocument();
    });
});
