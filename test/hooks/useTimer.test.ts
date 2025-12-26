import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer, formatTime } from '../../src/game/hooks/useTimer.ts';

describe('useTimer', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should initialize with 0 elapsed time', () => {
        const { result } = renderHook(() => useTimer());
        expect(result.current.elapsedTime).toBe(0);
    });

    it('should increment elapsed time every second', () => {
        const { result } = renderHook(() => useTimer());

        expect(result.current.elapsedTime).toBe(0);

        // Fast-forward 3 seconds
        act(() => {
            vi.advanceTimersByTime(3000);
        });

        expect(result.current.elapsedTime).toBe(3);
    });

    it('should stop timer when stopTimer is called', () => {
        const { result } = renderHook(() => useTimer());

        // Advance 2 seconds
        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(result.current.elapsedTime).toBe(2);

        // Stop the timer
        act(() => {
            result.current.stopTimer();
        });

        // Advance another 3 seconds
        act(() => {
            vi.advanceTimersByTime(3000);
        });

        // Time should still be 2 (not advanced)
        expect(result.current.elapsedTime).toBe(2);
    });

    it('should reset timer to 0', () => {
        const { result } = renderHook(() => useTimer());

        // Advance 5 seconds
        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(result.current.elapsedTime).toBe(5);

        // Reset timer
        act(() => {
            result.current.resetTimer();
        });

        expect(result.current.elapsedTime).toBe(0);
    });

    it('should restart timer after stop', () => {
        const { result } = renderHook(() => useTimer());

        // Advance 2 seconds
        act(() => {
            vi.advanceTimersByTime(2000);
        });

        // Stop timer
        act(() => {
            result.current.stopTimer();
        });

        // Start timer again
        act(() => {
            result.current.startTimer();
        });

        // Advance 1 more second
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        // Should be 3 seconds total
        expect(result.current.elapsedTime).toBe(3);
    });
});

describe('formatTime', () => {
    it('should format seconds correctly for times under 1 minute', () => {
        expect(formatTime(0)).toBe('0:00');
        expect(formatTime(5)).toBe('0:05');
        expect(formatTime(59)).toBe('0:59');
    });

    it('should format minutes and seconds correctly', () => {
        expect(formatTime(60)).toBe('1:00');
        expect(formatTime(90)).toBe('1:30');
        expect(formatTime(125)).toBe('2:05');
        expect(formatTime(599)).toBe('9:59');
    });

    it('should format hours, minutes, and seconds correctly', () => {
        expect(formatTime(3600)).toBe('1:00:00');
        expect(formatTime(3661)).toBe('1:01:01');
        expect(formatTime(7325)).toBe('2:02:05');
    });
});
