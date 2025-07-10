const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/verify-recaptcha', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, error: 'Token is required' });
  }

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`
    );

    const data = response.data;

    if (!data.success) {
      return res.status(400).json({ success: false, error: 'reCAPTCHA failed' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('reCAPTCHA validation error:', err.message);
    res.status(500).json({ success: false, error: 'Server error validating reCAPTCHA' });
  }
});

module.exports = router;
