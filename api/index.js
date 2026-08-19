const express = require('express');
const path = require('path');
const app = express();

// Serve static assets from /public folder
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// Serve participants.js from root
app.use('/participants.js', express.static(path.join(__dirname, '..', 'participants.js')));

// Details page
app.get('/details', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'details.html'));
});

// Search / results with optional ?q= param
app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Serve index.html for clean BIB-based URL paths
app.get(['/app/:id', '/:id'], (req, res) => {
  // Avoid catching static file requests
  const id = req.params.id;
  if (id.includes('.') || id === 'public' || id === 'api') {
    return res.status(404).send('Not found');
  }
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Default root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

module.exports = app;
