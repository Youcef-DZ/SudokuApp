const express = require('express');
const path = require('path');
const fs = require('fs');
const { CosmosClient } = require('@azure/cosmos');
require('dotenv').config({ path: '.env.local' });

const app = express();

// Middleware
app.use(express.json());

// Initialize Cosmos DB client
const cosmosClient = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY
});
const database = cosmosClient.database('SudokuDB');
const container = database.container('Scores');

// Determine the correct static directory
// In development: serve from dist/ after expo export
// In production (Azure): serve from root (files are copied there)
const isDevelopment = fs.existsSync(path.join(__dirname, 'dist', 'index.html'));
const staticDir = isDevelopment ? path.join(__dirname, 'dist') : __dirname;

console.log('Starting server...');
console.log('Environment:', isDevelopment ? 'Development' : 'Production');
console.log('Serving static files from:', staticDir);
console.log('Files in directory:', fs.readdirSync(staticDir).filter(f => !f.startsWith('node_modules')).slice(0, 10));

// API Routes
// GET /api/scores - Fetch scores (optionally filtered by difficulty)
app.get('/api/scores', async (req, res) => {
  try {
    const { difficulty, limit } = req.query;

    let query = 'SELECT * FROM c';
    const parameters = [];

    if (difficulty) {
      query += ' WHERE c.difficulty = @difficulty';
      parameters.push({ name: '@difficulty', value: difficulty });
    }

    query += ' ORDER BY c.time ASC';

    if (limit) {
      query = `SELECT TOP ${parseInt(limit)} * FROM c` + query.substring(14); // Replace SELECT *
    }

    const { resources } = await container.items.query({ query, parameters }).fetchAll();
    res.json(resources);
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/scores - Save a new score
app.post('/api/scores', async (req, res) => {
  try {
    const { userName, time, difficulty } = req.body;

    if (!userName || !time || !difficulty) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newScore = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userName,
      time,
      difficulty,
      date: new Date().toISOString()
    };

    const { resource } = await container.items.create(newScore);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/puzzles - Fetch puzzles (optionally filtered by difficulty)
app.get('/api/puzzles', async (req, res) => {
  try {
    const { difficulty } = req.query;
    const puzzlesContainer = database.container('Puzzles');

    let query = 'SELECT * FROM c';
    const parameters = [];

    if (difficulty) {
      query += ' WHERE c.difficulty = @difficulty';
      parameters.push({ name: '@difficulty', value: difficulty });
    }

    const { resources } = await puzzlesContainer.items.query({ query, parameters }).fetchAll();
    res.json(resources);
  } catch (error) {
    console.error('Error fetching puzzles:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/puzzles/random - Get random puzzle by difficulty
app.get('/api/puzzles/random', async (req, res) => {
  try {
    const { difficulty } = req.query;

    if (!difficulty) {
      return res.status(400).json({ error: 'Missing difficulty parameter' });
    }

    const puzzlesContainer = database.container('Puzzles');
    const query = 'SELECT * FROM c WHERE c.difficulty = @difficulty';
    const parameters = [{ name: '@difficulty', value: difficulty }];

    const { resources } = await puzzlesContainer.items.query({ query, parameters }).fetchAll();

    if (resources.length === 0) {
      return res.status(404).json({ error: 'No puzzles found for this difficulty' });
    }

    // Return random puzzle
    const randomIndex = Math.floor(Math.random() * resources.length);
    res.json(resources[randomIndex]);
  } catch (error) {
    console.error('Error fetching random puzzle:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve static files
app.use(express.static(staticDir, {
  maxAge: '1d',
  etag: true
}));

// Handle client-side routing - send all requests to index.html
app.get('*', (req, res) => {
  const indexPath = path.join(staticDir, 'index.html');

  if (fs.existsSync(indexPath)) {
    console.log('Serving index.html for route:', req.path);
    res.sendFile(indexPath);
  } else {
    console.error('index.html not found at:', indexPath);
    res.status(500).send('Application files not found. Please check deployment.');
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Visit http://localhost:${port}`);
});
