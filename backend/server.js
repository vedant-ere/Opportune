import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cron from 'node-cron';
import notificationRoutes from './routes/notificationRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { checkAndSendReminders } from './services/notificationService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/applications', applicationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected successfully');
    } else {
      console.log('⚠️  MongoDB URI not provided. Running without database.');
      console.log('   Email notifications will work without persistent storage.');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('   Continuing without database connection...');
  }
};

// Schedule notification checker to run every day at 9 AM
cron.schedule('0 9 * * *', () => {
  console.log('🔔 Running scheduled notification check...');
  checkAndSendReminders();
});

// Also check every 6 hours as backup
cron.schedule('0 */6 * * *', () => {
  console.log('🔔 Running periodic notification check...');
  checkAndSendReminders();
});

// Start server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📧 Email notifications enabled`);
    console.log(`⏰ Scheduled reminders active (9 AM daily + every 6 hours)`);
  });
};

startServer();

export default app;
