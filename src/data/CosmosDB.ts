import { CosmosClient, Container } from '@azure/cosmos';
import type { ScoreData } from './Database';

const endpoint = process.env.COSMOS_ENDPOINT || '';
const key = process.env.COSMOS_KEY || '';

const client = new CosmosClient({ endpoint, key });
const database = client.database('SudokuDB');
const container: Container = database.container('Scores');

export const CosmosDB = {
    /**
     * Save a new score to the leaderboard
     */
    async saveScore(score: Omit<ScoreData, 'id'>): Promise<ScoreData> {
        const newScore = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ...score,
            date: new Date().toISOString()
        };

        const { resource } = await container.items.create(newScore);
        return resource as ScoreData;
    },

    /**
     * Get all scores, optionally filtered by difficulty
     */
    async getScores(difficulty?: 'easy' | 'medium' | 'hard'): Promise<ScoreData[]> {
        const querySpec = {
            query: difficulty
                ? 'SELECT * FROM c WHERE c.difficulty = @difficulty ORDER BY c.time ASC'
                : 'SELECT * FROM c ORDER BY c.time ASC',
            parameters: difficulty ? [{ name: '@difficulty', value: difficulty }] : []
        };

        const { resources } = await container.items.query<ScoreData>(querySpec).fetchAll();
        return resources;
    },

    /**
     * Get top N scores for a specific difficulty
     */
    async getTopScores(difficulty: 'easy' | 'medium' | 'hard', limit: number = 20): Promise<ScoreData[]> {
        const querySpec = {
            query: 'SELECT TOP @limit * FROM c WHERE c.difficulty = @difficulty ORDER BY c.time ASC',
            parameters: [
                { name: '@limit', value: limit },
                { name: '@difficulty', value: difficulty }
            ]
        };

        const { resources } = await container.items.query<ScoreData>(querySpec).fetchAll();
        return resources;
    },

    /**
     * Delete a score by ID
     */
    async deleteScore(id: string, difficulty: 'easy' | 'medium' | 'hard'): Promise<void> {
        await container.item(id, difficulty).delete();
    },

    /**
     * Get user's personal best for a difficulty
     */
    async getUserBest(userName: string, difficulty: 'easy' | 'medium' | 'hard'): Promise<ScoreData | null> {
        const querySpec = {
            query: 'SELECT TOP 1 * FROM c WHERE c.userName = @userName AND c.difficulty = @difficulty ORDER BY c.time ASC',
            parameters: [
                { name: '@userName', value: userName },
                { name: '@difficulty', value: difficulty }
            ]
        };

        const { resources } = await container.items.query<ScoreData>(querySpec).fetchAll();
        return resources[0] || null;
    }
};
