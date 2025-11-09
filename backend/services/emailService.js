import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter with Gmail or custom SMTP
const createTransporter = () => {
  // Check if using Gmail
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD // Gmail App Password
      }
    });
  }

  // Custom SMTP configuration
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Email templates
const emailTemplates = {
  followupReminder: (application) => ({
    subject: `Follow-up Reminder: ${application.company} - ${application.position}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
            .application-card { background: #f9fafb; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .label { font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
            .value { color: #111827; font-size: 16px; margin-top: 5px; }
            .status-badge { display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
            .status-waiting { background: #fef3c7; color: #92400e; }
            .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; font-weight: 600; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;"> Follow-up Reminder</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">It's time to follow up on your application!</p>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>This is a friendly reminder that you have a follow-up scheduled for <strong>${new Date(application.followupDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>.</p>

              <div class="application-card">
                <div style="margin-bottom: 15px;">
                  <div class="label">Company</div>
                  <div class="value">${application.company}</div>
                </div>
                <div style="margin-bottom: 15px;">
                  <div class="label">Position</div>
                  <div class="value">${application.position}</div>
                </div>
                <div style="margin-bottom: 15px;">
                  <div class="label">Status</div>
                  <div><span class="status-badge status-waiting">${application.status}</span></div>
                </div>
                ${application.location ? `
                <div style="margin-bottom: 15px;">
                  <div class="label">Location</div>
                  <div class="value">${application.location}</div>
                </div>
                ` : ''}
                ${application.contactPerson ? `
                <div style="margin-bottom: 15px;">
                  <div class="label">Contact Person</div>
                  <div class="value">${application.contactPerson}${application.contactEmail ? ` (${application.contactEmail})` : ''}</div>
                </div>
                ` : ''}
                ${application.notes ? `
                <div>
                  <div class="label">Your Notes</div>
                  <div class="value">${application.notes}</div>
                </div>
                ` : ''}
              </div>

              <p><strong>Suggested follow-up actions:</strong></p>
              <ul>
                <li>Send a polite follow-up email to check on your application status</li>
                <li>Reiterate your interest in the position</li>
                <li>Mention any recent relevant achievements or projects</li>
                <li>Ask if they need any additional information</li>
              </ul>

              ${application.jobUrl ? `
                <a href="${application.jobUrl}" class="cta-button" style="color: white;">View Job Posting</a>
              ` : ''}
            </div>
            <div class="footer">
              <p>You're receiving this email because you set up follow-up reminders in <strong>Opportune</strong> Application Tracker.</p>
              <p style="margin-top: 10px;">Good luck with your job search! 🚀</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  dailyDigest: (applications, userName) => ({
    subject: `Daily Application Digest - ${applications.length} Follow-ups`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
            .app-item { background: #f9fafb; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
            .company { font-weight: 700; color: #111827; font-size: 16px; }
            .position { color: #6b7280; font-size: 14px; }
            .date { color: #9ca3af; font-size: 12px; margin-top: 5px; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;"> Daily Application Digest</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your follow-ups for today</p>
            </div>
            <div class="content">
              <p>Hi ${userName || 'there'},</p>
              <p>You have <strong>${applications.length}</strong> application${applications.length > 1 ? 's' : ''} requiring follow-up today:</p>

              ${applications.map(app => `
                <div class="app-item">
                  <div class="company">${app.company}</div>
                  <div class="position">${app.position}</div>
                  <div class="date">Follow-up: ${new Date(app.followupDate).toLocaleDateString()}</div>
                </div>
              `).join('')}

              <p style="margin-top: 20px;">Stay proactive and follow up on these applications to increase your chances!</p>
            </div>
            <div class="footer">
              <p>Sent by <strong>Opportune</strong> Application Tracker</p>
            </div>
          </div>
        </body>
      </html>
    `
  })
};

// Send email function
export const sendEmail = async (to, template, data) => {
  try {
    if (!process.env.EMAIL_USER) {
      console.log(' Email not configured. Skipping email send.');
      return { success: false, message: 'Email service not configured' };
    }

    const transporter = createTransporter();
    const emailContent = emailTemplates[template](data);

    const mailOptions = {
      from: `"Opportune - Application Tracker" <${process.env.EMAIL_USER}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(' Error sending email:', error.message);
    return { success: false, error: error.message };
  }
};

// Verify email configuration
export const verifyEmailConfig = async () => {
  try {
    if (!process.env.EMAIL_USER) {
      return { verified: false, message: 'Email credentials not configured' };
    }

    const transporter = createTransporter();
    await transporter.verify();
    console.log(' Email service verified successfully');
    return { verified: true, message: 'Email service is ready' };
  } catch (error) {
    console.error(' Email verification failed:', error.message);
    return { verified: false, message: error.message };
  }
};

export default { sendEmail, verifyEmailConfig };
