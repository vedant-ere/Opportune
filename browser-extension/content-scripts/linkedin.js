// LinkedIn Job Scraper
(function() {
  'use strict';

  function extractLinkedInJobData() {
    const data = {
      company: '',
      position: '',
      location: '',
      salary: '',
      jobUrl: window.location.href
    };

    try {
      // Extract company name
      const companySelectors = [
        '.job-details-jobs-unified-top-card__company-name',
        '.jobs-unified-top-card__company-name',
        '[data-job-details="companyName"]',
        '.topcard__org-name-link',
        '.job-details-jobs-unified-top-card__primary-description-without-tagline a'
      ];

      for (const selector of companySelectors) {
        const element = document.querySelector(selector);
        if (element) {
          data.company = element.textContent.trim();
          break;
        }
      }

      // Extract position title
      const positionSelectors = [
        '.job-details-jobs-unified-top-card__job-title',
        '.jobs-unified-top-card__job-title',
        '[data-job-details="jobTitle"]',
        '.topcard__title',
        'h1.t-24'
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
        '.job-details-jobs-unified-top-card__primary-description-without-tagline',
        '.jobs-unified-top-card__bullet',
        '[data-job-details="location"]',
        '.topcard__flavor--bullet'
      ];

      for (const selector of locationSelectors) {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
          const text = element.textContent.trim();
          // Check if it looks like a location (has city/state patterns)
          if (text && !text.includes('employees') && !text.includes('·') && text.length < 100) {
            data.location = text;
            break;
          }
        }
        if (data.location) break;
      }

      // Extract salary (if visible)
      const salarySelectors = [
        '[class*="salary"]',
        '[class*="compensation"]',
        '.mt4 .t-14'
      ];

      for (const selector of salarySelectors) {
        const element = document.querySelector(selector);
        if (element) {
          const text = element.textContent.trim();
          if (text.includes('$') || text.includes('K') || text.toLowerCase().includes('salary')) {
            data.salary = text;
            break;
          }
        }
      }

      console.log('LinkedIn extraction result:', data);
      return data;

    } catch (error) {
      console.error('Error extracting LinkedIn data:', error);
      return data;
    }
  }

  // Execute extraction
  return extractLinkedInJobData();
})();
