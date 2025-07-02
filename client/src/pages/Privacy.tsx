import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        At FarmWork Hub, we value your privacy. This policy outlines how we collect, use, and protect your personal
        information when you use our platform.
      </p>
      <p className="mb-4">
        We collect basic information like name, contact details, job preferences, and employment history for the
        purpose of connecting job seekers and employers. This data is never sold to third parties.
      </p>
      <p className="mb-4">
        We use industry-standard security measures to protect your data and only share your information with
        employers when you apply for a job or engage with their listings.
      </p>
      <p>
        By using our platform, you agree to the terms of this privacy policy. You may request to view, update, or
        delete your personal information at any time.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
