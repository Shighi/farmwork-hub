const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.post('/consent', (req, res) => {
  const { consent } = req.body;
  const ip = req.ip;
  const userAgent = req.headers['user-agent'] || 'unknown';

  if (!['accepted', 'declined'].includes(consent)) {
    return res.status(400).json({ error: 'Invalid consent value' });
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    consent,
    ip,
    userAgent,
  };

  const logPath = path.resolve(__dirname, '../logs/consent.log');

  fs.appendFile(logPath, JSON.stringify(logEntry) + '\n', err => {
    if (err) {
      console.error('Error writing to consent.log:', err);
      return res.status(500).json({ error: 'Failed to log consent' });
    }

    return res.status(200).json({ message: 'Consent logged successfully' });
  });
});

module.exports = router;
