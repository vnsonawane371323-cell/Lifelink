// ============================================================
//  Email Service - LifeLink
//  Handles email notifications using SendGrid
// ============================================================

const sgMail = require('@sendgrid/mail');

const sendgridApiKey = process.env.SENDGRID_API_KEY;
const emailFrom = process.env.EMAIL_FROM;

if (sendgridApiKey) {
  sgMail.setApiKey(sendgridApiKey);
} else {
  console.warn('SENDGRID_API_KEY is not configured. Email sending is disabled.');
}

/**
 * Send an email via SendGrid.
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @param {string} [html]
 * @returns {Promise<{success: boolean, message?: string, data?: unknown}>}
 */
const sendEmail = async (to, subject, text, html) => {
  try {
    if (!sendgridApiKey || !emailFrom) {
      const message = 'SendGrid is not configured. Set SENDGRID_API_KEY and EMAIL_FROM.';
      console.error('SendGrid email failed:', message);
      return { success: false, message };
    }

    if (!to || !subject || !text) {
      const message = 'Missing required email parameters (to, subject, text).';
      console.error('SendGrid email failed:', message);
      return { success: false, message };
    }

    const msg = {
      to,
      from: emailFrom,
      subject,
      text,
      html,
    };

    const [response] = await sgMail.send(msg);
    console.log('SendGrid email sent successfully');
    return {
      success: true,
      data: {
        statusCode: response.statusCode,
      },
    };
  } catch (error) {
    console.error('SendGrid email failed', error.response?.body || error.message);
    return {
      success: false,
      message: error.message,
    };
  }
};

/**
 * Backward-compatible wrapper used by notification controller.
 */
const sendBloodRequestNotification = async (donorEmail, donorName, requestData) => {
  const { bloodGroup, hospitalName, city, unitsRequired, urgency } = requestData;

  const subject = `Blood Request Alert - ${bloodGroup} Needed in ${city}`;
  const message = `Dear ${donorName},

A hospital in your area needs your blood type.

Blood Group: ${bloodGroup}
Hospital: ${hospitalName}
City: ${city}
Units Required: ${unitsRequired}
Urgency: ${(urgency || 'urgent').toUpperCase()}

Please consider donating as soon as possible.

LifeLink Team`;

  return sendEmail(donorEmail, subject, message);
};

/**
 * Backward-compatible wrapper used by notification controller.
 */
const sendSystemNotification = async (userEmail, userName, title, message) => {
  const subject = `LifeLink - ${title}`;
  const emailMessage = `Dear ${userName},

${message}

LifeLink Team`;

  return sendEmail(userEmail, subject, emailMessage);
};

const getStatus = () => ({
  configured: Boolean(sendgridApiKey && emailFrom),
  provider: 'sendgrid',
  emailFrom: emailFrom ? '***configured***' : 'not set',
});

module.exports = {
  sendEmail,
  sendBloodRequestNotification,
  sendSystemNotification,
  getStatus,
};