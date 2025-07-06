const express = require('express');
const path = require('path');
const consentRoute = require('./routes/consent.route');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', consentRoute);

// Optional: base route
app.get('/', (req, res) => {
  res.send('FarmWork Hub Backend Running');
});

// Start server if this file is run directly
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//Email service route
const emailRoute = require('./routes/email.route');
app.use('/api', emailRoute);

// Email trigger for user registration, job post, and application submission
const triggerRoute = require('./routes/trigger.route');
app.use('/api/trigger', triggerRoute);

// Google Recaptcha route 
const recaptchaRoute = require('./routes/recaptcha.route');
app.use('/api', recaptchaRoute);

