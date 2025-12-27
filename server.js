const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Determine the correct static directory
// Expo export creates files in the current directory when deployed
const staticDir = __dirname;

console.log('Starting server...');
console.log('Serving static files from:', staticDir);
console.log('Files in directory:', fs.readdirSync(staticDir).filter(f => !f.startsWith('node_modules')));

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
