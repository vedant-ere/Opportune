import express from 'express';
import Application from '../models/Application.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all applications for a user
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    // Use email from JWT token for security
    const userId = req.user.email;
    const applications = await Application.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new application
router.post('/', authenticateToken, async (req, res) => {
  try {
    const applicationData = req.body;
    // Override userId with authenticated user's email
    applicationData.userId = req.user.email;
    const application = new Application(applicationData);
    await application.save();
    res.status(201).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update application
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Verify user owns this application
    const existingApp = await Application.findById(id);
    if (!existingApp) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    if (existingApp.userId !== req.user.email) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    // Reset reminder if follow-up date or custom reminder date changes
    if (updates.followupDate || updates.customReminderDate) {
      updates.reminderSent = false;
      updates.lastReminderSent = null;
    }

    const application = await Application.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Set custom reminder for an application
router.post('/:id/reminder', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { customReminderDate } = req.body;

    if (!customReminderDate) {
      return res.status(400).json({ success: false, error: 'customReminderDate is required' });
    }

    const application = await Application.findByIdAndUpdate(
      id,
      {
        customReminderDate: new Date(customReminderDate),
        reminderSent: false,
        lastReminderSent: null
      },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Remove custom reminder from an application
router.delete('/:id/reminder', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findByIdAndUpdate(
      id,
      {
        customReminderDate: null,
        reminderSent: false
      },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete application
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify user owns this application
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    if (application.userId !== req.user.email) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    await Application.findByIdAndDelete(id);
    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Bulk sync applications (for migration from localStorage)
router.post('/sync', authenticateToken, async (req, res) => {
  try {
    const { applications } = req.body;

    // Use authenticated user's email
    const userId = req.user.email;

    if (!applications || !Array.isArray(applications)) {
      return res.status(400).json({
        success: false,
        error: 'applications array is required'
      });
    }

    const results = {
      created: 0,
      updated: 0,
      errors: []
    };

    for (const appData of applications) {
      try {
        // Check if application already exists (by userId and id)
        if (appData.id) {
          const existing = await Application.findOne({
            userId,
            _id: appData.id
          });

          if (existing) {
            // Update existing
            await Application.findByIdAndUpdate(appData.id, { ...appData, userId });
            results.updated++;
          } else {
            // Create new with specific ID
            const newApp = new Application({ ...appData, _id: appData.id, userId });
            await newApp.save();
            results.created++;
          }
        } else {
          // Create new without ID
          const newApp = new Application({ ...appData, userId });
          await newApp.save();
          results.created++;
        }
      } catch (error) {
        results.errors.push({
          application: appData,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: 'Sync completed',
      results
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
