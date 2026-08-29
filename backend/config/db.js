import mongoose from 'mongoose';
import User from '../models/User.js';

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    const connUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/luxestore';
    
    // Attempt standard connection
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 2500 // Quick timeout to fallback if local mongod is not active
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Local MongoDB connection failed (${error.message}). Starting in-memory Mongo server fallback...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          launchTimeout: 120000
        },
        binary: {
          timeout: 120000
        }
      });
      const uri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`In-Memory MongoDB Server Connected: ${conn.connection.host}`);
    } catch (fallbackError) {
      console.error(`MongoDB Connection Error: ${fallbackError.message}`);
      process.exit(1);
    }
  }

  // Auto-seed database if empty
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const { seedDatabase } = await import('../utils/seeder.js');
      await seedDatabase();
    }
  } catch (seedErr) {
    console.warn('Auto-seed check notice:', seedErr.message);
  }
};
