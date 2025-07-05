import React from "react";

const SafetyGuidelines: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary-600">
        Safety Guidelines
      </h1>
      <p className="text-center text-lg text-gray-600 mb-10">
        Your Safety is our top priority . Please review these important tips to stay protected when using FarmWork Hub.
      </p>
      
      <div className="bg-white border border-gray-300 shadow-md rounded-lg p-6">
        <ul className="list-disc list-inside mb-4">
          <li>Protect your personal information and never share sensitive details like bank accounts or passwords.</li>
          <li>Meet in safe, public locations and let someone know your plans.</li>
          <li>Verify job offers and avoid roles asking for payment upfront.</li>
          <li>Trust your instincts, if something feels suspicious, disengage.</li>
          <li>Use FarmWork Hubs messaging system to stay secure</li>
          <li>Report any suspicious behavior or job listings immediately.</li>
        </ul>
      </div>
    </div>
  );
};

export default SafetyGuidelines;