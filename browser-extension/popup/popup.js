// Set today's date as default
document.getElementById('applicationDate').valueAsDate = new Date();

// Status message helpers
function showStatus(message, type = 'success') {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  statusEl.classList.remove('hidden');

  setTimeout(() => {
    statusEl.classList.add('hidden');
  }, 3000);
}

function showLoading(show) {
  const loading = document.getElementById('loading');
  const content = document.getElementById('mainContent');

  if (show) {
    loading.classList.remove('hidden');
    content.style.display = 'none';
  } else {
    loading.classList.add('hidden');
    content.style.display = 'block';
  }
}

function showDetectedBanner(text) {
  const banner = document.getElementById('detectedBanner');
  const bannerText = document.getElementById('detectedText');
  bannerText.textContent = text;
  banner.classList.remove('hidden');

  setTimeout(() => {
    banner.classList.add('hidden');
  }, 5000);
}

// Extract job details from current page
document.getElementById('extractBtn').addEventListener('click', async () => {
  try {
    showLoading(true);

    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.id) {
      showLoading(false);
      showStatus('Unable to access current tab', 'error');
      return;
    }

    // Check if we're on a supported site
    const url = tab.url || '';
    let scriptFile = null;

    if (url.includes('linkedin.com/jobs')) {
      scriptFile = 'linkedin';
    } else if (url.includes('indeed.com')) {
      scriptFile = 'indeed';
    } else if (url.includes('greenhouse.io')) {
      scriptFile = 'greenhouse';
    }

    if (!scriptFile) {
      showLoading(false);
      showStatus('This site is not supported yet. Please fill the form manually.', 'error');
      return;
    }

    // Execute content script to extract data
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: [`content-scripts/${scriptFile}.js`]
    });

    showLoading(false);

    if (results && results[0] && results[0].result) {
      const data = results[0].result;

      // Fill form with extracted data
      if (data.company) document.getElementById('company').value = data.company;
      if (data.position) document.getElementById('position').value = data.position;
      if (data.location) document.getElementById('location').value = data.location;
      if (data.salary) document.getElementById('salary').value = data.salary;
      if (data.jobUrl) document.getElementById('jobUrl').value = data.jobUrl;

      showDetectedBanner(`Auto-filled from ${scriptFile.charAt(0).toUpperCase() + scriptFile.slice(1)}!`);
    } else {
      showStatus('Could not extract job details. Please fill manually.', 'error');
    }
  } catch (error) {
    console.error('Error extracting data:', error);
    showLoading(false);
    showStatus('Error extracting data: ' + error.message, 'error');
  }
});

// Handle form submission
document.getElementById('applicationForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    id: Date.now(),
    company: document.getElementById('company').value,
    position: document.getElementById('position').value,
    status: document.getElementById('status').value,
    applicationDate: document.getElementById('applicationDate').value,
    location: document.getElementById('location').value || '',
    salary: document.getElementById('salary').value || '',
    jobUrl: document.getElementById('jobUrl').value || '',
    followupDate: document.getElementById('followupDate').value || '',
    contactPerson: document.getElementById('contactPerson').value || '',
    contactEmail: document.getElementById('contactEmail').value || '',
    notes: document.getElementById('notes').value || ''
  };

  try {
    // Get existing applications from localStorage
    const existingApps = JSON.parse(localStorage.getItem('applications') || '[]');

    // Add new application
    existingApps.push(formData);

    // Save back to localStorage
    localStorage.setItem('applications', JSON.stringify(existingApps));

    // Also try to sync with backend if available
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        await fetch('http://localhost:5000/api/applications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...formData,
            userId: userEmail
          })
        });
      }
    } catch (backendError) {
      console.log('Backend sync failed (offline mode):', backendError);
    }

    showStatus('Application added successfully!', 'success');

    // Reset form after 1 second
    setTimeout(() => {
      document.getElementById('applicationForm').reset();
      document.getElementById('applicationDate').valueAsDate = new Date();
    }, 1000);

  } catch (error) {
    console.error('Error saving application:', error);
    showStatus('Error saving application: ' + error.message, 'error');
  }
});

// Auto-extract on load if on supported page
window.addEventListener('load', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = tab?.url || '';

    if (url.includes('linkedin.com/jobs') ||
        url.includes('indeed.com') ||
        url.includes('greenhouse.io')) {
      // Show hint
      showDetectedBanner('Job posting detected! Click "Extract from Page" to auto-fill.');
    }
  } catch (error) {
    console.error('Error checking page:', error);
  }
});
