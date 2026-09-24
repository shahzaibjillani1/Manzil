/**
 * Admin User Creation Utility
 * Usage: node utils/createAdmin.js
 *
 * Creates a platform admin account: admin@quickstay.com / admin123
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const ADMIN_DATA = {
  name: 'System Admin',
  email: 'admin@quickstay.com',
  password: 'admin123',
  role: 'admin',
};

const createAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotel_booking_db';
    await mongoose.connect(mongoUri);
    console.log('[DB] Connected to MongoDB');

    const existing = await User.findOne({ email: ADMIN_DATA.email });
    if (existing) {
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log(`[Admin] Existing user "${existing.email}" upgraded to admin role.`);
      } else {
        console.log(`[Admin] Admin user "${existing.email}" already exists. No action needed.`);
      }
    } else {
      const admin = await User.create(ADMIN_DATA);
      console.log(`[Admin] Admin user created successfully:`);
      console.log(`  Email:    ${admin.email}`);
      console.log(`  Password: admin123`);
      console.log(`  Role:     ${admin.role}`);
    }

    await mongoose.disconnect();
    console.log('[DB] Disconnected. Done.');
    process.exit(0);
  } catch (error) {
    console.error('[Error]', error.message);
    process.exit(1);
  }
};

createAdmin();
