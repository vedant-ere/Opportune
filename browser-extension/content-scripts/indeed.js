// Indeed Job Scraper
(function() {
  'use strict';

  function extractIndeedJobData() {
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
        '[data-testid="inlineHeader-companyName"]',
        '[data-company-name="true"]',
        '.icl-u-lg-mr--sm.icl-u-xs-mr--xs',
        '.jobsearch-InlineCompanyRating-companyHeader',
        '[class*="companyName"]'
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
        '[data-testid="jobsearch-JobInfoHeader-title"]',
        '.jobsearch-JobInfoHeader-title',
        'h1.icl-u-xs-mb--xs',
        'h1[class*="title"]'
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
        '[data-testid="inlineHeader-companyLocation"]',
        '[data-testid="job-location"]',
        '.jobsearch-JobInfoHeader-subtitle div',
        '[class*="companyLocation"]'
      ];

      for (const selector of locationSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          const text = element.textContent.trim();
          // Filter out non-location text
          if (text && !text.includes('•') && text.length < 100) {
            data.location = text;
            break;
          }
        }
      }

      // Extract salary
      const salarySelectors = [
        '[data-testid="attribute_snippet_testid"]',
        '#salaryInfoAndJobType',
        '.jobsearch-JobMetadataHeader-item',
        '[class*="salary"]'
      ];

      for (const selector of salarySelectors) {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
          const text = element.textContent.trim();
          if (text.includes('$') || text.includes('year') || text.includes('hour')) {
            data.salary = text;
            break;
          }
        }
        if (data.salary) break;
      }

      // Alternative salary extraction from metadata
      if (!data.salary) {
        const metadataItems = document.querySelectorAll('.jobsearch-JobMetadataHeader-item');
        metadataItems.forEach(item => {
          const text = item.textContent.trim();
          if (text.match(/\$[\d,]+/) || text.toLowerCase().includes('salary')) {
            data.salary = text;
          }
        });
      }

      console.log('Indeed extraction result:', data);
      return data;

    } catch (error) {
      console.error('Error extracting Indeed data:', error);
      return data;
    }
  }

  // Execute extraction
  return extractIndeedJobData();
})();
