import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { verifyEmailConfig } from '../services/emailService.js';
import { checkAndSendReminders, sendManualReminder } from '../services/notificationService.js';

const router = express.Router();

// In-memory storage for when MongoDB is not available
let inMemoryUsers = new Map();

// Check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Get user notification settings
router.get('/settings/:email', async (req, res) => {
  try {
    const { email } = req.params;

    if (isMongoConnected()) {
      // Use MongoDB
      let user = await User.findOne({ email });

      if (!user) {
        // Create default settings for new user
        user = new User({
          email,
          name: email.split('@')[0],
          notificationSettings: {
            emailEnabled: true,
            reminderDaysBefore: 1,
            dailyDigest: false,
            digestTime: '09:00'
          }
        });
        await user.save();
      }

      res.json({
        success: true,
        settings: user.notificationSettings,
        name: user.name
      });
    } else {
      // Use in-memory storage
      let user = inMemoryUsers.get(email);

      if (!user) {
        user = {
          email,
          name: email.split('@')[0],
          notificationSettings: {
            emailEnabled: true,
            reminderDaysBefore: 1,
            dailyDigest: false,
            digestTime: '09:00'
          }
        };
        inMemoryUsers.set(email, user);
      }

      res.json({
        success: true,
        settings: user.notificationSettings,
        name: user.name
      });
    }
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update user notification settings
router.put('/settings/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { notificationSettings, name } = req.body;

    if (isMongoConnected()) {
      // Use MongoDB
      let user = await User.findOne({ email });

      if (!user) {
        user = new User({
          email,
          name: name || email.split('@')[0],
          notificationSettings
        });
      } else {
        user.notificationSettings = { ...user.notificationSettings, ...notificationSettings };
        if (name) user.name = name;
      }

      await user.save();

      res.json({
        success: true,
        message: 'Notification settings updated successfully',
        settings: user.notificationSettings
      });
    } else {
      // Use in-memory storage
      let user = inMemoryUsers.get(email);

      if (!user) {
        user = {
          email,
          name: name || email.split('@')[0],
          notificationSettings
        };
      } else {
        user.notificationSettings = { ...user.notificationSettings, ...notificationSettings };
        if (name) user.name = name;
      }

      inMemoryUsers.set(email, user);

      res.json({
        success: true,
        message: 'Notification settings updated successfully (in-memory)',
        settings: user.notificationSettings
      });
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Manually trigger reminder check
router.post('/check', async (req, res) => {
  try {
    const result = await checkAndSendReminders();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send manual reminder for specific application
router.post('/send/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ success: false, error: 'User email is required' });
    }

    const result = await sendManualReminder(applicationId, userEmail);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify email configuration
router.get('/verify', async (req, res) => {
  try {
    const result = await verifyEmailConfig();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
