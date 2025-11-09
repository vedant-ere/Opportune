import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  company: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Applied', 'Waiting', 'Interview', 'Accepted', 'Rejected'],
    default: 'Applied'
  },
  applicationDate: {
    type: Date,
    required: true
  },
  followupDate: {
    type: Date
  },
  location: {
    type: String
  },
  salary: {
    type: String
  },
  jobUrl: {
    type: String
  },
  contactPerson: {
    type: String
  },
  contactEmail: {
    type: String
  },
  notes: {
    type: String
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  lastReminderSent: {
    type: Date
  },
  customReminderDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
applicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;
