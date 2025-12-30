const express = require('express');
const path = require('path');
const fs = require('fs');
const { CosmosClient } = require('@azure/cosmos');
const { DefaultAzureCredential } = require('@azure/identity');
const cors = require('cors');
try {
  require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
} catch (e) {
  // Silent fail: In Production (Azure), variables are set in App Settings
}

const app = express();

// Middleware
app.use(cors()); // Enable CORS for React Native
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[Server] ${req.method} ${req.path} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Debug Environment (Masked)
console.log('[Server] Cosmos Endpoint set:', !!process.env.COSMOS_ENDPOINT);
console.log('[Server] Cosmos Key set:', !!process.env.COSMOS_KEY);

// Initialize Cosmos DB client
const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;

if (!endpoint) {
  console.error('[Server] CRITICAL: Missing COSMOS_ENDPOINT!');
}

let cosmosClient;

if (key) {
  console.log('[Server] Authentication: Using COSMOS_KEY (Local/Key Authentication)');
  cosmosClient = new CosmosClient({ endpoint, key });
} else {
  console.log('[Server] Authentication: Using Managed Identity (Azure Production)');
  cosmosClient = new CosmosClient({
    endpoint,
    aadCredentials: new DefaultAzureCredential()
  });
}
const database = cosmosClient.database('SudokuDB');
const container = database.container('Scores');

// Determine the correct static directory
const distPath = path.join(__dirname, '../dist');
const publicPath = path.join(__dirname, 'public');

let staticDir;

// Priority 1: Current directory (Azure Production - where all files are flat)
// Note: In new structure, this might need adjustment if deploying flattened,
// but for now we assume standard node deployment.
if (fs.existsSync(path.join(__dirname, '../index.html'))) {
  // If index.html is in root (parent of backend)
  staticDir = path.join(__dirname, '..');
}
else if (fs.existsSync(path.join(__dirname, 'index.html'))) {
  staticDir = __dirname;
}
// Priority 2: dist/ directory (Local Development - Post Build)
else if (fs.existsSync(path.join(distPath, 'index.html'))) {
  staticDir = distPath;
}
// Priority 3: public/ directory (Local Development - Pre Build / Fallback)
else {
  staticDir = publicPath;
}

const isProduction = staticDir === __dirname;

console.log('Starting server...');
console.log('Environment:', isProduction ? 'Production' : 'Development');
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
      id: `${Date.now()} -${Math.random().toString(36).substr(2, 9)} `,
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

// Serve static files with smart caching strategy
app.use(express.static(staticDir, {
  etag: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('index.html')) {
      // index.html: No Store (Never cache, always download fresh)
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    } else {
      // Assets (JS/CSS/Images): Aggressive Cache (1 year)
      // Expo generates hashed filenames for assets, so they are unique.
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// Handle client-side routing - send all requests to index.html
app.get('*', (req, res) => {
  const indexPath = path.join(staticDir, 'index.html');

  if (fs.existsSync(indexPath)) {
    console.log('Serving index.html for route:', req.path);
    // Explicitly set headers for the catch-all route too
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(indexPath);
  } else {
    console.error('index.html not found at:', indexPath);
    res.status(500).send('Application files not found. Please check deployment.');
  }
});

const port = process.env.PORT || 8080;

// Only listen if running directly (not required as a module)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port} `);
    console.log(`Visit http://localhost:${port}`);
  });
}

module.exports = app;
