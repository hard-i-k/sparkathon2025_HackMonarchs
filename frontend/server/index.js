const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'EcoSmart Shop Backend Server is running!' });
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
try {
  const voiceAssistantRoutes = require('./routes/voiceAssistant');
  app.use('/api/voiceAssistant', voiceAssistantRoutes);
  console.log('✅ Voice Assistant routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading voice assistant routes:', error.message);
}

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Voice Assistant API: http://localhost:${PORT}/api/voiceAssistant/status`);
});

server.on('error', (error) => {
  console.error('❌ Server error:', error.message);
  if (error.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
  }
});
