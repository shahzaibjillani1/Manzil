import mongoose from 'mongoose';
import { autoSeedIfEmpty } from '../utils/seedRunner.js';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hotel_booking_db';

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[Database] MongoDB connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    await autoSeedIfEmpty();
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection to MongoDB failed: ${error.message}`);
    process.exit(1);
  }
};
