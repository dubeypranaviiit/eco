import mongoose from 'mongoose';

const MONGODB_URL: string = process.env.MONGODB_URI || '';

if (!MONGODB_URL) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Global variable for caching the connection
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Use global to maintain a cache of the connection in development
declare global {
  var mongooseCache: MongooseCache;
}

let cached = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function dbConnect(): Promise<mongoose.Connection> {
  if (cached.conn) {
    console.log('Using existing MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Creating new MongoDB connection...');
    
    cached.promise = mongoose
      .connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as mongoose.ConnectOptions)
      .then((mongoose) => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    cached.promise = null; // Reset promise cache on failure
    throw error;
  }

  return cached.conn;
}

export default dbConnect;
