const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initTransporter();
  }

  /**
   * Initialize email transporter
   */
  initTransporter() {
    const emailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    };

    this.transporter = nodemailer.createTransport(emailConfig);

    // Verify connection configuration
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('Email service configuration error:', error);
      } else {
        console.log('Email service is ready to send messages');
      }
    });
  }

  /**
   * Send email
   * @param {Object} options - Email options
   * @returns {Promise<Object>} Send result
   */
  async sendEmail(options) {
    try {
      const { to, subject, html, text, attachments } = options;

      const mailOptions = {
        from: `"${process.env.APP_NAME || 'FarmWork Hub'}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text,
        attachments
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send welcome email to new users
   * @param {Object} user - User object
   * @returns {Promise<Object>} Send result
   */
  async sendWelcomeEmail(user) {
    const subject = `Welcome to ${process.env.APP_NAME || 'FarmWork Hub'}!`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #22c55e; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #22c55e; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ${process.env.APP_NAME || 'FarmWork Hub'}!</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName}!</h2>
            <p>Thank you for joining ${process.env.APP_NAME || 'FarmWork Hub'}, Africa's leading agricultural job platform.</p>
            <p>Your account has been created successfully as a <strong>${user.userType}</strong>.</p>
            
            ${user.userType === 'worker' ? `
              <p>As a job seeker, you can now:</p>
              <ul>
                <li>Browse thousands of agricultural job opportunities</li>
                <li>Apply for jobs that match your skills</li>
                <li>Build your professional profile</li>
                <li>Connect with employers across Africa</li>
              </ul>
            ` : `
              <p>As an employer, you can now:</p>
              <ul>
                <li>Post job opportunities and reach qualified candidates</li>
                <li>Review applications and manage your hiring process</li>
                <li>Build your company profile</li>
                <li>Connect with skilled agricultural workers</li>
              </ul>
            `}
            
            <p>Get started by completing your profile and exploring available opportunities.</p>
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard" class="button">Go to Dashboard</a>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME || 'FarmWork Hub'}. All rights reserved.</p>
            <p>If you have any questions, contact us at ${process.env.SUPPORT_EMAIL || 'support@farmworkhub.com'}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Welcome to ${process.env.APP_NAME || 'FarmWork Hub'}!
      
      Hello ${user.firstName}!
      
      Thank you for joining ${process.env.APP_NAME || 'FarmWork Hub'}, Africa's leading agricultural job platform.
      Your account has been created successfully as a ${user.userType}.
      
      Visit ${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard to get started.
      
      Best regards,
      The ${process.env.APP_NAME || 'FarmWork Hub'} Team
    `;

    return await this.sendEmail({
      to: user.email,
      subject,
      html,
      text
    });
  }

  /**
   * Send password reset email
   * @param {Object} user - User object
   * @param {string} resetToken - Password reset token
   * @returns {Promise<Object>} Send result
   */
  async sendPasswordResetEmail(user, resetToken) {
    const subject = 'Password Reset Request';
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #22c55e; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #22c55e; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .warning { background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName}!</h2>
            <p>We received a request to reset your password for your ${process.env.APP_NAME || 'FarmWork Hub'} account.</p>
            
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            
            <div class="warning">
              <p><strong>Important:</strong> This link will expire in 1 hour for security reasons.</p>
              <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME || 'FarmWork Hub'}. All rights reserved.</p>
            <p>If you have any questions, contact us at ${process.env.SUPPORT_EMAIL || 'support@farmworkhub.com'}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Password Reset Request
      
      Hello ${user.firstName}!
      
      We received a request to reset your password for your ${process.env.APP_NAME || 'FarmWork Hub'} account.
      
      Click this link to reset your password: ${resetUrl}
      
      This link will expire in 1 hour for security reasons.
      If you didn't request this password reset, please ignore this email.
      
      Best regards,
      The ${process.env.APP_NAME || 'FarmWork Hub'} Team
    `;

    return await this.sendEmail({
      to: user.email,
      subject,
      html,
      text
    });
  }

  /**
   * Send job application notification to employer
   * @param {Object} application - Application object
   * @param {Object} job - Job object
   * @param {Object} applicant - Applicant object
   * @returns {Promise<Object>} Send result
   */
  async sendJobApplicationNotification(application, job, applicant) {
    const subject = `New Job Application: ${job.title}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #22c55e; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #22c55e; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .applicant-info { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Job Application</h1>
          </div>
          <div class="content">
            <h2>You have a new application!</h2>
            <p>Someone has applied for your job posting: <strong>${job.title}</strong></p>
            
            <div class="applicant-info">
              <h3>Applicant Information:</h3>
              <p><strong>Name:</strong> ${applicant.firstName} ${applicant.lastName}</p>
              <p><strong>Location:</strong> ${applicant.location || 'Not specified'}</p>
              <p><strong>Rating:</strong> ${applicant.rating ? `${applicant.rating}/5 (${applicant.totalRatings} reviews)` : 'No ratings yet'}</p>
              ${applicant.skills && applicant.skills.length > 0 ? `<p><strong>Skills:</strong> ${applicant.skills.join(', ')}</p>` : ''}
              ${application.coverLetter ? `<p><strong>Cover Letter:</strong> ${application.coverLetter}</p>` : ''}
              ${application.proposedSalary ? `<p><strong>Proposed Salary:</strong> $${application.proposedSalary}</p>` : ''}
            </div>
            
            <p>Review the application and respond to the candidate.</p>
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard/applications" class="button">View Application</a>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME || 'FarmWork Hub'}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      New Job Application
      
      You have a new application for your job posting: ${job.title}
      
      Applicant: ${applicant.firstName} ${applicant.lastName}
      Location: ${applicant.location || 'Not specified'}
      Rating: ${applicant.rating ? `${applicant.rating}/5 (${applicant.totalRatings} reviews)` : 'No ratings yet'}
      ${applicant.skills && applicant.skills.length > 0 ? `Skills: ${applicant.skills.join(', ')}` : ''}
      ${application.coverLetter ? `Cover Letter: ${application.coverLetter}` : ''}
      ${application.proposedSalary ? `Proposed Salary: $${application.proposedSalary}` : ''}
      
      Visit ${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard/applications to review the application.
      
      Best regards,
      The ${process.env.APP_NAME || 'FarmWork Hub'} Team
    `;

    return await this.sendEmail({
      to: job.employer.email,
      subject,
      html,
      text
    });
  }

  /**
   * Send application status update to applicant
   * @param {Object} application - Application object
   * @param {Object} job - Job object
   * @param {string} status - New status
   * @returns {Promise<Object>} Send result
   */
  async sendApplicationStatusUpdate(application, job, status) {
    const statusMessages = {
      'accepted': {
        subject: 'Congratulations! Your application has been accepted',
        message: 'Great news! Your application has been accepted.',
        color: '#22c55e'
      },
      'rejected': {
        subject: 'Update on your job application',
        message: 'Thank you for your interest. Unfortunately, we have decided to move forward with other candidates.',
        color: '#ef4444'
      },
      'interviewed': {
        subject: 'Interview invitation for your job application',
        message: 'Congratulations! You have been selected for an interview.',
        color: '#3b82f6'
      }
    };

    const statusInfo = statusMessages[status] || {
      subject: 'Update on your job application',
      message: `Your application status has been updated to: ${status}`,
      color: '#6b7280'
    };

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${statusInfo.color}; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: ${statusInfo.color}; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .job-info { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Update</h1>
          </div>
          <div class="content">
            <h2>Hello ${application.applicant.firstName}!</h2>
            <p>${statusInfo.message}</p>
            
            <div class="job-info">
              <h3>Job Details:</h3>
              <p><strong>Position:</strong> ${job.title}</p>
              <p><strong>Company:</strong> ${job.employer.companyName || job.employer.firstName + ' ' + job.employer.lastName}</p>
              <p><strong>Location:</strong> ${job.location}</p>
              <p><strong>Application Date:</strong> ${new Date(application.createdAt).toLocaleDateString()}</p>
            </div>
            
            ${status === 'accepted' ? `
              <p>The employer may contact you directly for next steps. Please check your dashboard for any messages.</p>
            ` : status === 'interviewed' ? `
              <p>The employer will contact you with interview details. Please check your dashboard for messages.</p>
            ` : ''}
            
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard/applications" class="button">View Application</a>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME || 'FarmWork Hub'}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Application Update
      
      Hello ${application.applicant.firstName}!
      
      ${statusInfo.message}
      
      Job Details:
      Position: ${job.title}
      Company: ${job.employer.companyName || job.employer.firstName + ' ' + job.employer.lastName}
      Location: ${job.location}
      Application Date: ${new Date(application.createdAt).toLocaleDateString()}
      
      Visit ${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard/applications to view your application.
      
      Best regards,
      The ${process.env.APP_NAME || 'FarmWork Hub'} Team
    `;

    return await this.sendEmail({
      to: application.applicant.email,
      subject: statusInfo.subject,
      html,
      text
    });
  }

  /**
   * Send job posting confirmation to employer
   * @param {Object} job - Job object
   * @param {Object} employer - Employer object
   * @returns {Promise<Object>} Send result
   */
  async sendJobPostingConfirmation(job, employer) {
    const subject = 'Job Posted Successfully';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #22c55e; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #22c55e; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .job-details { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Job Posted Successfully!</h1>
          </div>
          <div class="content">
            <h2>Hello ${employer.firstName}!</h2>
            <p>Your job posting has been successfully published on ${process.env.APP_NAME || 'FarmWork Hub'}.</p>
            
            <div class="job-details">
              <h3>Job Details:</h3>
              <p><strong>Title:</strong> ${job.title}</p>
              <p><strong>Location:</strong> ${job.location}</p>
              <p><strong>Type:</strong> ${job.type}</p>
              <p><strong>Salary:</strong> $${job.salary}</p>
              <p><strong>Posted:</strong> ${new Date(job.createdAt).toLocaleDateString()}</p>
            </div>
            
            <p>Your job posting is now live and candidates can start applying. You'll receive email notifications when applications are submitted.</p>
            
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard/jobs" class="button">Manage Job Posts</a>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME || 'FarmWork Hub'}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Job Posted Successfully!
      
      Hello ${employer.firstName}!
      
      Your job posting has been successfully published on ${process.env.APP_NAME || 'FarmWork Hub'}.
      
      Job Details:
      Title: ${job.title}
      Location: ${job.location}
      Type: ${job.type}
      Salary: $${job.salary}
      Posted: ${new Date(job.createdAt).toLocaleDateString()}
      
      Visit ${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard/jobs to manage your job posts.
      
      Best regards,
      The ${process.env.APP_NAME || 'FarmWork Hub'} Team
    `;

    return await this.sendEmail({
      to: employer.email,
      subject,
      html,
      text
    });
  }

  /**
   * Send email verification email
   * @param {Object} user - User object
   * @param {string} verificationToken - Email verification token
   * @returns {Promise<Object>} Send result
   */
  async sendEmailVerification(user, verificationToken) {
    const subject = 'Verify your email address';
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #22c55e; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #22c55e; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName}!</h2>
            <p>Thank you for signing up for ${process.env.APP_NAME || 'FarmWork Hub'}!</p>
            <p>Please click the button below to verify your email address and activate your account:</p>
            
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
            
            <p>If you didn't create an account with us, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME || 'FarmWork Hub'}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Verify Your Email
      
      Hello ${user.firstName}!
      
      Thank you for signing up for ${process.env.APP_NAME || 'FarmWork Hub'}!
      
      Please click this link to verify your email address: ${verificationUrl}
      
      If you didn't create an account with us, please ignore this email.
      
      Best regards,
      The ${process.env.APP_NAME || 'FarmWork Hub'} Team
    `;

    return await this.sendEmail({
      to: user.email,
      subject,
      html,
      text
    });
  }

  /**
   * Send contact form submission notification
   * @param {Object} contactData - Contact form data
   * @returns {Promise<Object>} Send result
   */
  async sendContactFormNotification(contactData) {
    const subject = `New Contact Form Submission from ${contactData.name}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #22c55e; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .contact-details { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="contact-details">
              <h3>Contact Information:</h3>
              <p><strong>Name:</strong> ${contactData.name}</p>
              <p><strong>Email:</strong> ${contactData.email}</p>
              <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
              <p><strong>Subject:</strong> ${contactData.subject}</p>
              <p><strong>Message:</strong></p>
              <p style="background: #f8f9fa; padding: 10px; border-radius: 3px; white-space: pre-wrap;">${contactData.message}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME || 'FarmWork Hub'}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      New Contact Form Submission
      
      Contact Information:
      Name: ${contactData.name}
      Email: ${contactData.email}
      Phone: ${contactData.phone || 'Not provided'}
      Subject: ${contactData.subject}
      
      Message:
      ${contactData.message}
      
      Submitted: ${new Date().toLocaleString()}
    `;

    return await this.sendEmail({
      to: process.env.SUPPORT_EMAIL || 'support@farmworkhub.com',
      subject,
      html,
      text
    });
  }
}

module.exports = new EmailService();