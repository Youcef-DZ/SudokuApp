// Serverless adapter for Vercel
// This bridges Vercel's serverless environment with our existing Express app in backend/server.js
const app = require('../backend/server');

module.exports = app;
