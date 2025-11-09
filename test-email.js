import dotenv from 'dotenv';
import { sendEmail } from './backend/services/emailService.js';

dotenv.config();

// Test sending an email reminder
const testEmail = async () => {
  console.log('🧪 Testing email notification...\n');

  // Check environment variables
  console.log('📧 Email Configuration:');
  console.log(`   EMAIL_SERVICE: ${process.env.EMAIL_SERVICE}`);
  console.log(`   EMAIL_USER: ${process.env.EMAIL_USER}`);
  console.log(`   EMAIL_APP_PASSWORD: ${process.env.EMAIL_APP_PASSWORD ? '***' + process.env.EMAIL_APP_PASSWORD.slice(-4) : 'NOT SET'}`);
  console.log('');

  // Test application data
  const testApplication = {
    company: 'Test Company',
    position: 'Software Engineer',
    status: 'Applied',
    applicationDate: new Date(),
    followupDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    location: 'Remote',
    salary: '$100,000',
    jobUrl: 'https://example.com/job',
    contactPerson: 'John Doe',
    contactEmail: 'john@example.com',
    notes: 'This is a test reminder email'
  };

  console.log('📨 Sending test email to:', process.env.EMAIL_USER);
  console.log('');

  try {
    const result = await sendEmail(
      process.env.EMAIL_USER, // Send to yourself
      'followupReminder',
      testApplication
    );

    if (result.success) {
      console.log('✅ SUCCESS! Email sent successfully!');
      console.log(`   Message ID: ${result.messageId}`);
      console.log('');
      console.log('📬 Check your inbox at:', process.env.EMAIL_USER);
      console.log('   (May take a few seconds to arrive)');
    } else {
      console.log('❌ FAILED to send email');
      console.log(`   Error: ${result.error || result.message}`);
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('   1. Check EMAIL_APP_PASSWORD has no spaces');
    console.log('   2. Make sure 2-Step Verification is enabled in Google');
    console.log('   3. Generate new App Password if needed');
    console.log('   4. Verify EMAIL_USER is correct');
  }
};

testEmail();
