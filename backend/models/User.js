import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false // Don't include password in queries by default
  },
  name: {
    type: String,
    required: true
  },
  notificationSettings: {
    emailEnabled: {
      type: Boolean,
      default: true
    },
    reminderDaysBefore: {
      type: Number,
      default: 1 // Send reminder 1 day before follow-up date
    },
    dailyDigest: {
      type: Boolean,
      default: false
    },
    digestTime: {
      type: String,
      default: '09:00' // Time for daily digest (HH:MM format)
    }
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

export default User;
