/**
 * React Hook for Cosmos DB Scores
 * 
 * This replaces the Notion-based score fetching with Cosmos DB
 */

import { useState, useEffect } from 'react';
import type { ScoreData } from '../data/Database';
import { API_BASE_URL } from '../data/Database';

interface UseCosmosScoresReturn {
    scores: ScoreData[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    saveScore: (score: Omit<ScoreData, 'id' | 'date'>) => Promise<void>;
}

export function useCosmosScores(difficulty?: 'easy' | 'medium' | 'hard'): UseCosmosScoresReturn {
    const [scores, setScores] = useState<ScoreData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchScores = async () => {
        try {
            setLoading(true);
            setError(null);

            const endpoint = difficulty
                ? `${API_BASE_URL}/api/scores?difficulty=${difficulty}`
                : `${API_BASE_URL}/api/scores`;

            const response = await fetch(endpoint);

            if (!response.ok) {
                throw new Error(`Failed to fetch scores: ${response.statusText}`);
            }

            const data = await response.json();
            setScores(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch scores');
            console.error('Error fetching scores:', err);
        } finally {
            setLoading(false);
        }
    };

    const saveScore = async (score: Omit<ScoreData, 'id' | 'date'>) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/scores`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(score)
            });

            if (!response.ok) {
                throw new Error(`Failed to save score: ${response.statusText}`);
            }

            // Refetch to update leaderboard
            await fetchScores();
        } catch (err) {
            console.error('Error saving score:', err);
            throw err;
        }
    };

    useEffect(() => {
        fetchScores();
    }, [difficulty]);

    return {
        scores,
        loading,
        error,
        refetch: fetchScores,
        saveScore
    };
}
