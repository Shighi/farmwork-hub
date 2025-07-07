import React from 'react';

const CareerTips: React.FC = () => {
  return (
    <section className="max-w-5xl mx-auto py-12 px-4 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary-600">
        Career Tips for Job Seekers
      </h1>
      <p className="text-center text-lg text-gray-600 mb-10">
        Empower yourself with these practical tips to help you succeed in the agricultural job market.
      </p>

      <div className="space-y-8">
        {careerTips.map((tip, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2 text-primary-700">{tip.title}</h3>
            <p className="text-gray-700 text-base">{tip.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const careerTips = [
    {
      title: "Tailor Your Resume for Each Job",
      content:
        "Customize your resume to match the specific role you're applying for. Highlight relevant skills and experiences.",
    },
    {
      title: "Prepare for Interviews",
      content:
        "Practice common interview questions, research the company, and be ready to explain your value.",
    },
    {
      title: "Build a Professional Network",
      content:
        "Attend local agricultural events or online forums to connect with farmers and agri-entrepreneurs.",
    },
    {
      title: "Learn New Skills",
      content:
        "Take advantage of free training programs, certifications, or workshops related to agriculture and farm technology.",
    },
    {
      title: "Be Reliable and Communicative",
      content:
        "Employers value consistent and clear communication. Show up on time and follow through on tasks.",
    },
  ];

  export default CareerTips;