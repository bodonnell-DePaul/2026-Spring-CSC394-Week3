// ---------------------------------------------------------------------------
// app.js — Express application (separated from server.js for testing)
// ---------------------------------------------------------------------------

const express = require('express');
const cors = require('cors');
const studentRoutes = require('./routes/students');
const groupRoutes = require('./routes/groups');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// ---- Middleware ------------------------------------------------------------
app.use(cors());
app.use(express.json());

// Serve the frontend
app.use(express.static('src/public'));

// ---- Routes ----------------------------------------------------------------
app.use('/api/students', studentRoutes);
app.use('/api/groups', groupRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---- Error handling (must be last) -----------------------------------------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
