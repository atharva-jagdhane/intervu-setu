import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed Origins (Supports both 5173 and 5174 dev ports, localhost & 127.0.0.1, plus env overrides)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map(url => url.trim()) : [])
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients (curl, Postman, server-to-server where origin is undefined)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for unauthorized origin: ${origin}`));
  },
  credentials: true, // Crucial: Allows HTTP-only cookies to pass across origins
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200
};

// Core Middlewares
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Explicit OPTIONS preflight handler
app.use(express.json());
app.use(cookieParser());

// Root API Endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'IntervuSetu API Server',
    status: 'online',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const isHealthy = dbState === 1;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'degraded',
    service: 'IntervuSetu REST API',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatusMap[dbState] || 'unknown',
      connected: isHealthy,
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null
    }
  });
});

// Authentication Routes
app.use('/api/auth', authRoutes);

// Interview Configuration Routes (Phase 2)
app.use('/api/interview', interviewRoutes);

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found on IntervuSetu API`
  });
});

// Start Server and connect to Database
const startServer = async () => {
  console.log('🚀 Initializing IntervuSetu Backend Service...');
  
  // Connect to MongoDB Atlas
  await connectDB();

  app.listen(PORT, () => {
    console.log(`📡 [Server Listening]: http://localhost:${PORT}`);
    console.log(`🩺 [Health Check]:     http://localhost:${PORT}/api/health`);
    console.log(`🔐 [Auth Endpoints]:   http://localhost:${PORT}/api/auth`);
    console.log(`🌐 [Allowed Origins]: ${allowedOrigins.join(', ')}\n`);
  });
};

// Process Safety Listeners
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ [Server Warning] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('⚠️ [Server Warning] Uncaught Exception:', err.message);
});

startServer();
