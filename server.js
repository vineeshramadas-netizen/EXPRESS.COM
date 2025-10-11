const express = require('express');
const app = express();

// Use the PORT provided by Render or default to 3000 locally
const PORT = process.env.PORT || 3000;

// A simple route to confirm it's running
app.get('/', (req, res) => {
  res.send('✅ Server is running successfully on Render!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
