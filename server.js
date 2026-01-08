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
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : [];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    // If no CORS_ORIGINS set, allow all (development)
    if (allowedOrigins.length === 0) return callback(null, true);
    
    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: false,
  allowedHeaders: ['Content-Type', 'Authorization']
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

// Serve React app in production (if public folder exists)
if (process.env.NODE_ENV === 'production') {
  const publicDir = path.join(__dirname, 'public');
  
  if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
    
    app.get('/', (req, res) => {
      res.sendFile(path.join(publicDir, 'index.html'));
    });
  } else {
    // API-only mode
    app.get('/', (req, res) => {
      res.json({
        message: 'RSML Speech Annotator API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
          auth: {
            register: 'POST /api/auth/register',
            login: 'POST /api/auth/login',
            me: 'GET /api/auth/me (protected)'
          },
          admin: {
            pendingUsers: 'GET /api/auth/pending-users (admin)',
            approve: 'PUT /api/auth/approve/:userId (admin)',
            reject: 'DELETE /api/auth/reject/:userId (admin)'
          },
          data: {
            batches: 'GET /api/batches (protected)',
            files: 'GET /api/batch/:batch/files (protected)',
            segments: 'GET /api/batch/:batch/file/:file (protected)',
            save: 'POST /api/save (protected)'
          }
        },
        docs: 'https://github.com/yourusername/bhashanew'
      });
    });
  }
} else {
  // Development mode
  app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    
    if (!fs.existsSync(indexPath)) {
      return res.json({
        message: 'RSML Speech Annotator API - Development',
        status: 'running',
        note: 'Frontend running separately on Vite dev server'
      });
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
