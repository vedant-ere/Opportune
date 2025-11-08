import { useState, useEffect } from 'react';
import Toast from './Toast';

const NotificationSettings = ({ userEmail, onClose }) => {
  const [settings, setSettings] = useState({
    emailEnabled: true,
    reminderDaysBefore: 1,
    dailyDigest: false,
    digestTime: '09:00'
  });
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [emailConfigured, setEmailConfigured] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    loadSettings();
    verifyEmailConfig();
  }, [userEmail]);

  const verifyEmailConfig = async () => {
    try {
      const response = await fetch(`${API_URL}/notifications/verify`);
      const data = await response.json();
      setEmailConfigured(data.verified);
    } catch (error) {
      console.error('Error verifying email config:', error);
      setEmailConfigured(false);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/notifications/settings/${userEmail}`);
      const data = await response.json();

      if (data.success) {
        setSettings(data.settings);
        setUserName(data.name);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setToast({ message: 'Failed to load settings', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/notifications/settings/${userEmail}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notificationSettings: settings,
          name: userName
        })
      });

      const data = await response.json();

      if (data.success) {
        setToast({ message: 'Settings saved successfully!', type: 'success' });
        setTimeout(() => {
          onClose?.();
        }, 1500);
      } else {
        setToast({ message: 'Failed to save settings', type: 'error' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setToast({ message: 'Failed to save settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-[#0a0a0a] rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white dark:bg-[#0a0a0a] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800 shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Email Notification Settings
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Configure how you receive application reminders
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Email Status Banner */}
            {!emailConfigured && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                      Email Service Not Configured
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Please set up email credentials in the .env file to enable notifications.
                      See .env.example for instructions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* User Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Enable Notifications */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <input
                type="checkbox"
                id="emailEnabled"
                checked={settings.emailEnabled}
                onChange={(e) => handleChange('emailEnabled', e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <label htmlFor="emailEnabled" className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                  Enable Email Notifications
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Receive email reminders for follow-ups and application updates
                </p>
              </div>
            </div>

            {/* Reminder Settings */}
            {settings.emailEnabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Send Reminder Before Follow-up Date
                  </label>
                  <select
                    value={settings.reminderDaysBefore}
                    onChange={(e) => handleChange('reminderDaysBefore', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100"
                  >
                    <option value={0}>On the follow-up date</option>
                    <option value={1}>1 day before</option>
                    <option value={2}>2 days before</option>
                    <option value={3}>3 days before</option>
                    <option value={7}>1 week before</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    You'll receive an email reminder this many days before your follow-up date
                  </p>
                </div>

                {/* Daily Digest */}
                <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="dailyDigest"
                      checked={settings.dailyDigest}
                      onChange={(e) => handleChange('dailyDigest', e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <label htmlFor="dailyDigest" className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                        Daily Digest Email
                      </label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Get a summary of upcoming follow-ups in a single daily email
                      </p>
                    </div>
                  </div>

                  {settings.dailyDigest && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Digest Time
                      </label>
                      <input
                        type="time"
                        value={settings.digestTime}
                        onChange={(e) => handleChange('digestTime', e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                    How it works
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1 list-disc list-inside">
                    <li>Automated reminders are checked daily at 9 AM and every 6 hours</li>
                    <li>Each application gets one reminder email before the follow-up date</li>
                    <li>You can manually trigger reminders from application cards</li>
                    <li>All data is securely stored and never shared</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white dark:border-black"></div>
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default NotificationSettings;
