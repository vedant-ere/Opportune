# Opportune - Job Application Tracker

A modern, feature-rich web application to track and manage your job search with automated email notifications and browser extension for quick-add from job sites.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Core Features
- 📊 **Dual View Modes** - Switch between Grid and Kanban board layouts
- 📈 **Statistics Dashboard** - Track response rate, interviews, and success metrics
- 🎨 **Dark Mode** - Beautiful light and dark themes
- 💾 **Export/Import** - Save your data as JSON or CSV
- 🔍 **Search & Filter** - Find applications by company, position, or status
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

### 🆕 New Advanced Features

#### 📧 Email Notifications & Reminders
- **Automated Follow-up Reminders** - Get email reminders before follow-up dates
- **Daily Digest** - Optional summary of upcoming follow-ups
- **Beautiful HTML Emails** - Professional, branded email templates
- **Smart Scheduling** - Reminders checked daily at 9 AM and every 6 hours
- **Customizable Settings** - Configure reminder timing and preferences

#### 🔌 Browser Extension
- **One-Click Add** - Add applications directly from job sites
- **Auto-Extract Details** - Automatically fills company, position, location, and salary
- **Supported Sites**:
  - ✅ LinkedIn Jobs
  - ✅ Indeed
  - ✅ Greenhouse
  - 🚧 More coming soon
- **Works Offline** - Data saved locally even without internet

## 🚀 Quick Start

### Basic Setup (No Email)

```bash
# Install dependencies
npm install

# Run frontend
npm run dev
```

Visit `http://localhost:5173` and start tracking applications!

### Full Setup (With Email Notifications)

See the **[Complete Setup Guide](SETUP_GUIDE.md)** for detailed instructions on:
- Setting up email notifications with Gmail
- Installing the browser extension
- Configuring MongoDB (optional)

**Quick Version:**

1. Create `.env` file (copy from `.env.example`)
2. Add your Gmail credentials
3. Run both frontend and backend:
   ```bash
   npm run dev:full
   ```

## 📚 Documentation

- **[Setup Guide](SETUP_GUIDE.md)** - Complete setup instructions with troubleshooting
- **[Browser Extension Guide](browser-extension/README.md)** - Extension installation and usage

## 🛠 Technologies

### Frontend
- **React 19** - Modern UI library with latest hooks
- **Vite 6** - Lightning-fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Hooks** - State management

### Backend (Optional)
- **Express.js** - Web server framework
- **Nodemailer** - Email sending service
- **Node-cron** - Scheduled task runner
- **Mongoose** - MongoDB object modeling (optional)

### Browser Extension
- **Manifest V3** - Latest extension standard
- **Content Scripts** - Job site data extraction
- **Service Workers** - Background processing

## 📁 Project Structure

```
opportune/
├── backend/                    # Express backend for email notifications
│   ├── server.js              # Main server file
│   ├── models/                # MongoDB models (User, Application)
│   ├── routes/                # API routes (notifications, applications)
│   ├── services/              # Email and notification services
│   └── config/                # Configuration files
│
├── browser-extension/         # Chrome/Firefox extension
│   ├── manifest.json          # Extension configuration
│   ├── popup/                 # Extension popup UI
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   ├── content-scripts/       # Job site scrapers
│   │   ├── linkedin.js
│   │   ├── indeed.js
│   │   └── greenhouse.js
│   └── background.js          # Service worker
│
├── src/                       # React frontend
│   ├── components/            # Reusable UI components
│   │   ├── ApplicationForm.jsx
│   │   ├── KanbanBoard.jsx
│   │   ├── MainCard.jsx
│   │   ├── Statistics.jsx
│   │   ├── NotificationSettings.jsx  # NEW
│   │   ├── Toast.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── ...
│   ├── pages/                 # Page components
│   │   └── LandingPage.jsx
│   ├── context/               # React context providers
│   │   └── ThemeContext.jsx
│   ├── App.jsx                # Main app component
│   └── main.jsx               # Entry point
│
├── .env.example               # Example environment variables
├── .env                       # Your environment variables (create this)
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind configuration
├── README.md                  # This file
└── SETUP_GUIDE.md            # Detailed setup instructions
```

## Usage

### Adding an Application

#### Method 1: From the Dashboard
1. Click **"New Application"**
2. Fill in job details
3. Set a follow-up date (optional)
4. Click **"Save"**

#### Method 2: Using Browser Extension
1. Go to a job posting on LinkedIn or Indeed
2. Click the Opportune extension icon
3. Click **"Extract from Page"**
4. Review and adjust details
5. Click **"Add to Tracker"**

### Setting Up Email Notifications
1. Click the **bell icon** in the header
2. Enter your email address
3. Configure notification preferences:
   - Enable/disable email notifications
   - Set reminder timing (1-7 days before)
   - Enable daily digest (optional)
4. Save settings

### Managing Applications
- **Edit**: Click the edit icon on any application card
- **Delete**: Click the delete icon and confirm
- **Change Status**: Drag cards between columns in Kanban view
- **Search**: Use the search bar to find applications
- **Filter**: Filter by status or sort by date/company

### Exporting Data
1. Click **"Export"** button
2. Choose format:
   - **JSON** - Full backup with all data
   - **CSV** - Spreadsheet format for Excel

##  Application Statuses

- **Applied** - Application submitted
- **Waiting** - Awaiting response
- **Interview** - Interview scheduled or completed
- **Accepted** - Offer received
- **Rejected** - Application declined

##  Available Scripts

```bash
# Development
npm run dev              # Run frontend only
npm run server           # Run backend only
npm run dev:full         # Run both frontend and backend

# Production
npm run build            # Build frontend for production
npm run preview          # Preview production build

# Other
npm run lint             # Run ESLint code linting
```

##  API Endpoints

The backend provides these endpoints:

### Notifications
- `GET /api/notifications/settings/:email` - Get user notification settings
- `PUT /api/notifications/settings/:email` - Update notification settings
- `POST /api/notifications/check` - Manually trigger reminder check
- `GET /api/notifications/verify` - Verify email configuration

### Applications (Optional - for database sync)
- `GET /api/applications/:userId` - Get all applications for a user
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application
- `POST /api/applications/sync` - Bulk sync applications

##  Security & Privacy

- **Local-First**: All data stored locally in your browser by default
- **Optional Backend**: Email and database features are completely optional
- **No Tracking**: No analytics or third-party tracking
- **Open Source**: Full transparency - review the code yourself
- **Your Credentials**: Email credentials stored in `.env` (never committed)
- **App Passwords**: Uses Gmail App Passwords for enhanced security

##  Troubleshooting

### Email notifications not working
- Verify `.env` file exists and has correct Gmail credentials
- Ensure 2-Step Verification is enabled on Google account
- Check that you're using an App Password, not your regular password
- Restart the backend server after changing `.env`

### Extension not extracting data
- Make sure you're on a job posting page (not search results)
- Wait for page to fully load before clicking "Extract"
- Some sites have anti-scraping measures - fill manually if needed

### Applications not syncing
- Refresh the dashboard page
- Check browser console for errors (F12)
- Ensure localStorage is enabled in browser settings

For more troubleshooting help, see the [Setup Guide](SETUP_GUIDE.md).

##  License

MIT License - feel free to use this project for personal or commercial purposes.

##  Roadmap

### Coming Soon
- [ ] Interview preparation notes
- [ ] Resume version tracking
- [ ] Calendar integration
- [ ] Analytics dashboard with charts
- [ ] Application templates
- [ ] More job site support (Glassdoor, ZipRecruiter)
- [ ] Mobile app
- [ ] Collaboration features

##  Feedback

Found a bug? Have a feature request? Open an issue or submit a pull request!

---


Track smarter. Land faster.
