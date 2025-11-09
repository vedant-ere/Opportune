import mongoose from 'mongoose';
import Application from '../models/Application.js';
import User from '../models/User.js';
import { sendEmail } from './emailService.js';

// Check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Check for applications that need follow-up reminders and send emails
 */
export const checkAndSendReminders = async () => {
  try {
    console.log('🔍 Checking for applications requiring reminders...');

    if (!isMongoConnected()) {
      console.log('⚠️  MongoDB not connected. Reminders require database connection.');
      console.log('   Applications are stored locally. Manual reminders can still be sent.');
      return { success: false, message: 'Database not connected' };
    }

    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find applications with custom reminder dates that have passed
    const customRemindersNeedingAlert = await Application.find({
      customReminderDate: {
        $lte: now,
        $exists: true
      },
      status: { $in: ['Applied', 'Waiting', 'Interview'] },
      $or: [
        { reminderSent: false },
        { reminderSent: { $exists: false } }
      ]
    });

    // Find applications with follow-up dates today or tomorrow that haven't been reminded yet
    const followupReminders = await Application.find({
      followupDate: {
        $gte: today,
        $lt: tomorrow
      },
      status: { $in: ['Applied', 'Waiting', 'Interview'] }, // Only active applications
      $or: [
        { reminderSent: false },
        { reminderSent: { $exists: false } }
      ],
      // Exclude apps that have custom reminders set (they'll be handled separately)
      $and: [
        {
          $or: [
            { customReminderDate: { $exists: false } },
            { customReminderDate: null }
          ]
        }
      ]
    });

    // Combine both lists
    const applicationsNeedingReminder = [...customRemindersNeedingAlert, ...followupReminders];

    console.log(`📧 Found ${applicationsNeedingReminder.length} applications needing reminders (${customRemindersNeedingAlert.length} custom, ${followupReminders.length} followup)`);

    // Group applications by user
    const applicationsByUser = {};
    for (const app of applicationsNeedingReminder) {
      if (!applicationsByUser[app.userId]) {
        applicationsByUser[app.userId] = [];
      }
      applicationsByUser[app.userId].push(app);
    }

    // Send reminders for each user
    let sentCount = 0;
    for (const [userId, applications] of Object.entries(applicationsByUser)) {
      try {
        // Get user settings
        const user = await User.findOne({ email: userId });

        // If user doesn't exist or has notifications disabled, skip
        if (!user || !user.notificationSettings?.emailEnabled) {
          console.log(`⏭️  Skipping notifications for ${userId} (disabled or no user)`);
          continue;
        }

        // Send individual reminders for each application
        for (const application of applications) {
          const result = await sendEmail(
            userId, // User's email
            'followupReminder',
            application
          );

          if (result.success) {
            // Mark as reminded
            application.reminderSent = true;
            application.lastReminderSent = new Date();
            await application.save();
            sentCount++;
          }
        }

      } catch (error) {
        console.error(`❌ Error sending reminder to ${userId}:`, error.message);
      }
    }

    console.log(`✅ Successfully sent ${sentCount} reminder emails`);
    return { success: true, count: sentCount };

  } catch (error) {
    console.error('❌ Error in checkAndSendReminders:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send daily digest to users who have it enabled
 */
export const sendDailyDigest = async () => {
  try {
    console.log('📬 Preparing daily digests...');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // Find users with daily digest enabled
    const users = await User.find({
      'notificationSettings.dailyDigest': true,
      'notificationSettings.emailEnabled': true
    });

    let sentCount = 0;
    for (const user of users) {
      try {
        // Get applications needing follow-up in the next 7 days
        const upcomingApplications = await Application.find({
          userId: user.email,
          followupDate: {
            $gte: today,
            $lt: nextWeek
          },
          status: { $in: ['Applied', 'Waiting', 'Interview'] }
        }).sort({ followupDate: 1 });

        if (upcomingApplications.length > 0) {
          const result = await sendEmail(
            user.email,
            'dailyDigest',
            upcomingApplications,
            user.name
          );

          if (result.success) {
            sentCount++;
          }
        }
      } catch (error) {
        console.error(`❌ Error sending digest to ${user.email}:`, error.message);
      }
    }

    console.log(`✅ Successfully sent ${sentCount} daily digest emails`);
    return { success: true, count: sentCount };

  } catch (error) {
    console.error('❌ Error in sendDailyDigest:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Manually trigger a reminder for a specific application
 */
export const sendManualReminder = async (applicationId, userEmail) => {
  try {
    const application = await Application.findById(applicationId);

    if (!application) {
      return { success: false, error: 'Application not found' };
    }

    const result = await sendEmail(userEmail, 'followupReminder', application);

    if (result.success) {
      application.lastReminderSent = new Date();
      await application.save();
    }

    return result;
  } catch (error) {
    console.error('❌ Error sending manual reminder:', error.message);
    return { success: false, error: error.message };
  }
};

export default {
  checkAndSendReminders,
  sendDailyDigest,
  sendManualReminder
};
