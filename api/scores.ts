/**
 * API endpoint for Cosmos DB scores
 * Handles GET (fetch scores) and POST (save score)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { CosmosDB } from '../../src/data/CosmosDB';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            // Fetch scores
            const { difficulty, limit } = req.query;

            if (difficulty && typeof difficulty === 'string') {
                const validDiff = difficulty as 'easy' | 'medium' | 'hard';
                const topLimit = limit ? parseInt(limit as string, 10) : 20;
                const scores = await CosmosDB.getTopScores(validDiff, topLimit);
                return res.status(200).json(scores);
            }

            // Get all scores
            const scores = await CosmosDB.getScores();
            return res.status(200).json(scores);

        } else if (req.method === 'POST') {
            // Save new score
            const { userName, time, difficulty } = req.body;

            if (!userName || !time || !difficulty) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const newScore = await CosmosDB.saveScore({
                userName,
                time,
                difficulty,
                date: new Date().toISOString()
            });

            return res.status(201).json(newScore);

        } else {
            res.setHeader('Allow', ['GET', 'POST']);
            return res.status(405).json({ error: `Method ${req.method} not allowed` });
        }

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : 'Internal server error'
        });
    }
}
