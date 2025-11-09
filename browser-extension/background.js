// Background service worker for the extension

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Opportune Extension installed!');

    // Open welcome page or set default settings
    chrome.storage.local.set({
      appUrl: 'http://localhost:5173',
      apiUrl: 'http://localhost:5000/api'
    });
  } else if (details.reason === 'update') {
    console.log('Opportune Extension updated!');
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveApplication') {
    // Handle saving application
    saveApplicationToLocalStorage(request.data)
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }));

    return true; // Keep message channel open for async response
  }

  if (request.action === 'getSettings') {
    chrome.storage.local.get(['appUrl', 'apiUrl'], (result) => {
      sendResponse(result);
    });

    return true;
  }
});

// Function to save application data
async function saveApplicationToLocalStorage(applicationData) {
  try {
    // Get existing applications
    const result = await chrome.storage.local.get(['applications']);
    const applications = result.applications || [];

    // Add new application
    applications.push({
      ...applicationData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    });

    // Save back to storage
    await chrome.storage.local.set({ applications });

    // Try to sync with backend if available
    try {
      const settings = await chrome.storage.local.get(['apiUrl', 'userEmail']);
      if (settings.apiUrl && settings.userEmail) {
        await fetch(`${settings.apiUrl}/applications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...applicationData,
            userId: settings.userEmail
          })
        });
      }
    } catch (backendError) {
      console.log('Backend sync failed (offline mode):', backendError);
    }

    return true;
  } catch (error) {
    console.error('Error saving application:', error);
    throw error;
  }
}

// Context menu for quick add (optional enhancement)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'addToOpportune',
    title: 'Add to Opportune Tracker',
    contexts: ['page', 'selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'addToOpportune') {
    // Open extension popup
    chrome.action.openPopup();
  }
});

console.log('Opportune Extension background service worker loaded');
