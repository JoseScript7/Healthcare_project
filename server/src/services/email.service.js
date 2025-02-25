import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendWelcomeEmail = async (user, tempPassword) => {
  try {
    await emailService.sendEmail({
      to: user.email,
      subject: 'Welcome to Healthcare Inventory System',
      text: `Welcome ${user.name}!\n\nYour temporary password is: ${tempPassword}\n\nPlease change your password after logging in.`,
      html: `
        <h1>Welcome to Healthcare Inventory System</h1>
        <p>Hello ${user.name},</p>
        <p>Your account has been created successfully.</p>
        <p>Your temporary password is: <strong>${tempPassword}</strong></p>
        <p>Please change your password after logging in.</p>
      `
    });
  } catch (error) {
    logger.error('Welcome email failed:', error);
    throw error;
  }
};

export const emailService = {
  async sendEmail({ to, subject, text, html, attachments = [] }) {
    try {
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: Array.isArray(to) ? to.join(',') : to,
        subject,
        text,
        html,
        attachments
      });
      logger.info('Email sent:', info.messageId);
      return info;
    } catch (error) {
      logger.error('Email send error:', error);
      throw error;
    }
  }
}; 