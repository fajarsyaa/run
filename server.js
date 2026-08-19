const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from /public folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve participants.js from root
app.use('/participants.js', express.static(path.join(__dirname, 'participants.js')));

// Details page
app.get('/details', (req, res) => {
  res.sendFile(path.join(__dirname, 'details.html'));
});

// Search / results with optional ?q= param
app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve index.html for clean BIB-based URL paths
app.get(['/app/:id', '/:id'], (req, res) => {
  const id = req.params.id;
  if (id.includes('.') || id === 'public' || id === 'api') {
    return res.status(404).send('Not found');
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Default root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`  Results : http://localhost:${PORT}/`);
    console.log(`  Details : http://localhost:${PORT}/details`);
    console.log(`  Runner  : http://localhost:${PORT}/app/1011`);
  });
}

module.exports = app;
