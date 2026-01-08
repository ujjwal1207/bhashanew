const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const connectDB = require('./config/database');
const voiceRoutes = require('./routes/voiceRoutes');
const authRoutes = require('./routes/authRoutes');
const { protect } = require('./middleware/authMiddleware');

// ---------------- CONFIG ---------------- //

const PORT = process.env.PORT || 3000;
const AUDIO_DIR = path.join(__dirname, 'data', 'audio');

// -------------------------------------- //

const app = express();

// -------- Middleware -------- //

// CORS Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression Middleware (similar to GZip in FastAPI)
app.use(compression({
  threshold: 1000 // minimum size in bytes before compression
}));

// -------- Static Audio Serving -------- //

// Create audio directory if it doesn't exist
if (!fs.existsSync(AUDIO_DIR)) {
  console.warn(`⚠️  ${AUDIO_DIR} directory not found. Creating it...`);
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  console.log(`✅ Created ${AUDIO_DIR} directory`);
}

app.use('/data/audio', express.static(AUDIO_DIR));

// -------- Serve Index HTML -------- //

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
} else {
  // Serve old index.html in development
  app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    
    if (!fs.existsSync(indexPath)) {
      return res.status(404).json({ error: 'index.html not found' });
    }
    
    res.sendFile(indexPath);
  });
}

// -------- API Routes -------- //

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Voice routes (protected)
app.use('/api', protect, voiceRoutes);

// -------- Error Handling Middleware -------- //

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// -------- 404 Handler -------- //

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// -------- Connect to Database & Start Server -------- //

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
      console.log(`📁 Audio directory: ${AUDIO_DIR}`);
      console.log(`🌐 API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
