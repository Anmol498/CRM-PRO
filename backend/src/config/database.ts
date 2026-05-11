import mongoose from 'mongoose';
import { env } from './env';

/**
 * Strips any embedded database name from the MongoDB URI to ensure
 * the dbName option is the single source of truth.
 */
function sanitizeMongoURI(uri: string): string {
  try {
    const url = new URL(uri);
    url.pathname = '/';
    return url.toString();
  } catch {
    return uri;
  }
}

export const connectDatabase = async () => {
  try {
    const safeURI = sanitizeMongoURI(env.MONGODB_URI);
    
    const conn = await mongoose.connect(safeURI, {
      dbName: env.DB_NAME,
      maxPoolSize: 25,
      minPoolSize: 5,
      waitQueueTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      autoIndex: false,
    });

    const connectedDB = conn.connection.name;

    // Runtime assertion: Ensure we connected to the intended database
    if (connectedDB !== env.DB_NAME) {
      console.error(`❌ FATAL: Connected to database "${connectedDB}" but expected "${env.DB_NAME}". Refusing to start.`);
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`✅ MongoDB Connected: ${conn.connection.host} | Database: ${connectedDB}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};




