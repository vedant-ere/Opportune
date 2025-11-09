// Greenhouse Job Scraper
(function() {
  'use strict';

  function extractGreenhouseJobData() {
    const data = {
      company: '',
      position: '',
      location: '',
      salary: '',
      jobUrl: window.location.href
    };

    try {
      // Extract company name from logo alt or title
      const logoImg = document.querySelector('.company-logo img');
      if (logoImg) {
        data.company = logoImg.alt || '';
      }

      // Alternative: from page title or header
      if (!data.company) {
        const titleMatch = document.title.match(/(.+?) - /);
        if (titleMatch) {
          data.company = titleMatch[1].trim();
        }
      }

      // Extract position title
      const positionSelectors = [
        '.app-title',
        'h1.app-title',
        '[class*="job-title"]',
        'h1'
      ];

      for (const selector of positionSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          data.position = element.textContent.trim();
          break;
        }
      }

      // Extract location
      const locationSelectors = [
        '.location',
        '[class*="location"]',
        '.app-title + div'
      ];

      for (const selector of locationSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          const text = element.textContent.trim();
          if (text && text.length < 100) {
            data.location = text;
            break;
          }
        }
      }

      console.log('Greenhouse extraction result:', data);
      return data;

    } catch (error) {
      console.error('Error extracting Greenhouse data:', error);
      return data;
    }
  }

  // Execute extraction
  return extractGreenhouseJobData();
})();
