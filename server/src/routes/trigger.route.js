const express = require('express');
const { sendEmail } = require('../services/emailService');
const router = express.Router();

// Simulate: User Registration
router.post('/register', async (req, res) => {
  const { email, name } = req.body;

  try {
    await sendEmail({
      to: email,
      subject: 'Welcome to FarmWork Hub!',
      text: `Hi ${name}, thanks for registering.`,
      html: `<p>Hi <strong>${name}</strong>, thanks for registering at FarmWork Hub!</p>`,
    });

    res.json({ message: 'Registration email sent.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send registration email' });
  }
});

// Simulate: Job Posted
router.post('/post-job', async (req, res) => {
  const { email, jobTitle } = req.body;

  try {
    await sendEmail({
      to: email,
      subject: 'Job Posted Successfully!',
      text: `Your job "${jobTitle}" has been posted.`,
      html: `<p>Your job post "<strong>${jobTitle}</strong>" is now live!</p>`,
    });

    res.json({ message: 'Job post email sent.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send job post email' });
  }
});

// Simulate: Job Application Submitted
router.post('/apply', async (req, res) => {
  const { employerEmail, applicantName, jobTitle } = req.body;

  try {
    await sendEmail({
      to: employerEmail,
      subject: `New Application for ${jobTitle}`,
      text: `${applicantName} has applied for your job.`,
      html: `<p><strong>${applicantName}</strong> has applied for your job "<strong>${jobTitle}</strong>".</p>`,
    });

    res.json({ message: 'Application email sent.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send application email' });
  }
});

module.exports = router;
