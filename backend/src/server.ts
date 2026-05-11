import express from 'express';
import http from 'http';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import cluster from 'cluster';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import router from './routes';
import { errorMiddleware } from './middleware/error.middleware';
import { startSSEHeartbeat, shutdownSSE } from './sse/sse.handler';
import { initJobs } from './jobs';
import { warmAfterStart } from './utils/startup.utils';

import logger from './utils/logger';

const app = express();
const server = http.createServer(app);

// Security Middleware
app.use(helmet());
app.use(cookieParser());
app.use(compression());
app.use(express.json());

// CORS configuration - User requested to keep it open (*) but allow credentials for cookies
app.use(cors({
  origin: (_origin, callback) => callback(null, true), 
  credentials: true,
}));

if (env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  // Combined format for production, safer than custom tokens
  app.use(morgan('combined'));
}

// Routes
app.use('/api', router);

// Error Handler
app.use(errorMiddleware);

// Initialization logic
const startServer = async () => {
  try {
    if (cluster.isPrimary) {
      const numWorkers = parseInt(env.WEB_CONCURRENCY) || 1;
      logger.info(`[PRIMARY] ${process.pid} is running. Forking ${numWorkers} workers...`);

      for (let i = 0; i < numWorkers; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker) => {
        logger.info(`[WORKER] ${worker.process.pid} died. Restarting...`);
        cluster.fork();
      });

      logger.info('🚀 Primary cluster manager initialized.');
    } else {
      // WORKER branch: Connect DB, Start Server, then warm in background
      await connectDatabase();
      
      server.listen(Number(env.PORT), '0.0.0.0', () => {
        logger.info(`[WORKER] ${process.pid} started on port ${env.PORT}`);
        
        // Non-blocking background tasks
        warmAfterStart();
        initJobs();
        startSSEHeartbeat();
      });
    }
  } catch (err) {
    logger.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
const handleShutdown = async (signal: string) => {
  logger.info(`[${signal}] Received. Shutting down gracefully...`);
  shutdownSSE();
  process.exit(0);
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
