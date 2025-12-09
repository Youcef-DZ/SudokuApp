import { useState, useEffect, useRef } from 'react';

interface UseTimerReturn {
    elapsedTime: number;
    startTimer: () => void;
    stopTimer: () => void;
    resetTimer: () => void;
}

/**
 * Custom hook to manage game timer
 * Tracks elapsed time in seconds and provides controls
 */
export function useTimer(): UseTimerReturn {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [startTime, setStartTime] = useState<number>(Date.now());
    const [isRunning, setIsRunning] = useState(true);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (!isRunning) return;

        const timer = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        timerRef.current = timer as unknown as number;

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [startTime, isRunning]);

    const startTimer = () => {
        setIsRunning(true);
        setStartTime(Date.now() - elapsedTime * 1000); // Continue from current time
    };

    const stopTimer = () => {
        setIsRunning(false);
    };

    const resetTimer = () => {
        setElapsedTime(0);
        setStartTime(Date.now());
        setIsRunning(true);
    };

    return {
        elapsedTime,
        startTimer,
        stopTimer,
        resetTimer
    };
}

/**
 * Format seconds into MM:SS or H:MM:SS format
 */
export function formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
