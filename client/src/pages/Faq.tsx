import React, { useState } from 'react';

const faqs = [
  {
    question: 'What is FarmWork Hub?',
    answer: 'FarmWork Hub connects farmers and agribusinesses with unemployed youths looking for agricultural jobs across Africa.',
  },
  {
    question: 'How do I apply for a job?',
    answer: 'Create an account, complete your profile, then browse and apply for jobs listed on the platform.',
  },
  {
    question: 'Is FarmWork Hub free to use?',
    answer: 'Yes, it’s free for job seekers. Employers may have pricing tiers for job postings.',
  },
  {
    question: 'How do I contact support?',
    answer: 'Visit our Contact us page and fill the form',
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index:any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold text-center text-primary-600 mb-6">Frequently Asked Questions</h1>

      <div className="space-y-4">
        {faqs.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg shadow-sm">
            <button onClick={() => toggleAccordion(index)}
              className="w-full text-left px-6 py-4 bg-gray-300 focus:outline-none focus:ring-2 flex justify-between items-center"
            >
              <span className="font-medium text-lg">{item.question}</span>
              <span className="text-xl">
              </span>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-gray-700 bg-gray-100">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;