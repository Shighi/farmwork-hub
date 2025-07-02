import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4">
        Welcome to FarmWork Hub. By accessing or using our platform, you agree to the following terms and
        conditions:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>You must be at least 18 years old or have parental consent to use the platform.</li>
        <li>Employers are responsible for providing accurate job listings and complying with employment laws.</li>
        <li>Job seekers are expected to provide truthful information and uphold professional conduct.</li>
        <li>FarmWork Hub is not liable for any direct agreements, contracts, or employment arrangements.</li>
      </ul>
      <p>
        We reserve the right to suspend or terminate accounts that violate these terms.
      </p>
    </div>
  );
};

export default TermsOfService;