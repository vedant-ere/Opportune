# Opportune Browser Extension

One-click job application tracking from LinkedIn, Indeed, and other job sites.

## Features

- **Auto-extract job details** from LinkedIn, Indeed, and Greenhouse
- **Quick-add interface** with pre-filled information
- **Instant sync** with Opportune dashboard
- **Works offline** - data saved locally

## Supported Job Sites

✅ LinkedIn Jobs
✅ Indeed
✅ Greenhouse (and any site using Greenhouse)
🚧 More coming soon (Glassdoor, ZipRecruiter, etc.)

## Installation

### Chrome/Edge (Developer Mode)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `browser-extension` folder
5. The Opportune extension icon should appear in your toolbar

### Firefox (Developer Mode)

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select the `manifest.json` file from the `browser-extension` folder
4. The extension will be loaded temporarily

## Usage

### Method 1: Auto-Extract from Job Page

1. Navigate to a job posting on LinkedIn or Indeed
2. Click the Opportune extension icon
3. Click "Extract from Page" to auto-fill job details
4. Review and edit any fields
5. Click "Add to Tracker"

### Method 2: Manual Entry

1. Click the Opportune extension icon from any page
2. Fill in the job details manually
3. Click "Add to Tracker"

## Icons

The extension requires icon files in the `icons` folder:
- `icon16.png` - 16x16 pixels
- `icon32.png` - 32x32 pixels
- `icon48.png` - 48x48 pixels
- `icon128.png` - 128x128 pixels

You can create these using any image editor. A simple design with the Opportune logo works best.

## Development

### Project Structure

```
browser-extension/
├── manifest.json           # Extension configuration
├── background.js           # Service worker for background tasks
├── popup/
│   ├── popup.html         # Extension popup UI
│   ├── popup.css          # Popup styles
│   └── popup.js           # Popup logic
├── content-scripts/
│   ├── linkedin.js        # LinkedIn scraper
│   ├── indeed.js          # Indeed scraper
│   └── greenhouse.js      # Greenhouse scraper
└── icons/                 # Extension icons
```

### Testing

1. Make changes to any file
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Opportune extension card
4. Test the extension on a job posting

### Adding Support for New Job Sites

1. Create a new content script in `content-scripts/[sitename].js`
2. Add the site's URL pattern to `manifest.json` under `content_scripts`
3. Implement the extraction logic following the pattern in existing scripts
4. Update the `popup.js` to handle the new site

## Permissions Explained

- **activeTab**: Access current tab to extract job details
- **storage**: Save applications locally
- **scripting**: Inject content scripts for data extraction
- **host_permissions**: Access specific job sites for scraping

## Privacy

- All data is stored locally in your browser
- No data is collected or transmitted to third parties
- Optional sync with your Opportune backend (localhost by default)
- You control all your data

## Troubleshooting

### Extension doesn't detect job details

- Make sure you're on a supported job site
- The page must be fully loaded before clicking "Extract"
- Some sites have dynamic content that may need a page refresh

### "Add to Tracker" doesn't work

- Check that the Opportune dashboard is running at `http://localhost:5173`
- Ensure localStorage is enabled in your browser
- Check browser console for errors (F12)

### Extension icon doesn't show

- Pin the extension by clicking the puzzle icon in Chrome
- Select "Opportune" and click the pin icon

## Contributing

Found a bug or want to add support for a new job site? Contributions are welcome!

1. Test the extension thoroughly
2. Document any new features
3. Submit improvements

## License

Part of the Opportune Application Tracker project.
