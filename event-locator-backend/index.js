const express = require('express');
const app = require('./server'); // Assuming server.js exports the app
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
