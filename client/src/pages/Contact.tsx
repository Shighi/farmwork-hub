import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { FiMail, FiUser, FiMessageCircle } from 'react-icons/fi';

const ContactForm = () => {
  const [formData, setFormData] = useState({ to: '', subject: '', message: '' });
  const [status, setStatus] = useState('');
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null); // Refs help reset the CAPTCHA

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaValue) {
      setStatus('⚠️ Please complete the CAPTCHA.');
      return;
    }

    try {
      // Step 1: Verify CAPTCHA
      const verifyRes = await fetch('http://localhost:5000/api/verify-recaptcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: captchaValue }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        setStatus('❌ CAPTCHA verification failed.');
        return;
      }

      // Step 2: Send Email
      const res = await fetch('http://localhost:5000/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('✅ Email sent!');
        setFormData({ to: '', subject: '', message: '' });
        setCaptchaValue(null);
        recaptchaRef.current?.reset(); // Reset the CAPTCHA
      } else {
        setStatus(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setStatus('⚠️ Server error');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-4 mb-8">
      <h1 className="text-3xl font-bold mb-2 text-center">Contact Us</h1>
      <p className="text-gray-600 mb-6 text-center">
        We'd love to hear from you. Fill out the form below to send us a message.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipient Email */}
        <label className="block text-sm font-medium text-gray-700">
          <span className="flex items-center gap-2">
            {FiMail({})} Your Email
          </span>
          <input
            name="to"
            type="email"
            value={formData.to}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded mt-1"
            placeholder="you@example.com"
          />
        </label>

        {/* Subject */}
        <label className="block text-sm font-medium text-gray-700">
          <span className="flex items-center gap-2">
            {FiUser({})} Subject
          </span>
          <input
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded mt-1"
            placeholder="Subject of your message"
          />
        </label>

        {/* Message */}
        <label className="block text-sm font-medium text-gray-700">
          <span className="flex items-center gap-2">
            {FiMessageCircle({})} Message
          </span>
          <textarea
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded mt-1"
            placeholder="Write your message here..."
          />
        </label>

        {/* reCAPTCHA */}
        <ReCAPTCHA
          sitekey="YOUR_RECAPTCHA_SITE_KEY"
          onChange={handleCaptchaChange}
          ref={recaptchaRef}
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Send Message
        </button>

        {/* Status Message */}
        {status && (
          <p className="text-sm text-center text-gray-700 mt-2">{status}</p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
