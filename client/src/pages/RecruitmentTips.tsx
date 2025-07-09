import React from 'react';
import { CheckCircle } from 'lucide-react';

const RecruitmentTips: React.FC = () => {
  return (
    <section className="max-w-5xl mx-auto py-12 px-4 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary-600">
      Recruitment Tips for Employers
      </h1>
      <p className="text-center text-lg text-gray-600 mb-10">
      Improve your hiring process and build better teams with these practical recruitment strategies.
      </p>

      <div className="space-y-8">
        {recruitmentTips.map((tip, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition flex items-start gap-4"
          >
            <div>{tip.icon}</div>
            <div>
            <h3 className="text-xl font-semibold mb-2 text-primary-700">{tip.topic}</h3>
            <p className="text-gray-700 text-base">{tip.tip}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const recruitmentTips = [
  {
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    topic: 'Write Clear Job Descriptions',
    tip: 'Ensure the job role, responsibilities, location, and compensation are clearly outlined. This helps attract the right candidates.',
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    topic: 'Use Local Language Where Appropriate',
    tip: 'Communicate in the local dialect or in simple English to ensure clarity for rural youth or first-time job seekers.',
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    topic: 'Promote Fair Hiring Practices',
    tip: 'Avoid any form of discrimination. Focus on skills, willingness to learn, and availability.',
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    topic: 'Be Responsive',
    tip: 'Acknowledge applications and respond promptly to questions or follow-ups from candidates.',
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    topic: 'Offer Training Where Possible',
    tip: 'Offering a short induction or on-the-job training can greatly improve productivity and retention.',
  },
];

export default RecruitmentTips;