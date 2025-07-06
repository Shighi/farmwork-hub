const express = require('express');
const { body, validationResult } = require('express-validator');
const { sendEmail } = require('../services/emailService');

const router = express.Router();

// POST /api/email
router.post(
  '/email',
  [
    body('to').isEmail().withMessage('Valid email is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('message').notEmpty().withMessage('Message is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { to, subject, message } = req.body;

    try {
      const info = await sendEmail({
        to,
        subject,
        text: message,
        html: `<p>${message}</p>`,
      });

      res.status(200).json({
        message: 'Email sent successfully',
        previewURL: info ? require('nodemailer').getTestMessageUrl(info) : null,
      });
    } catch (error) {
      console.error("Email error:", error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  }
);

module.exports = router;
