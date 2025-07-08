import React from 'react';

const bestPractices = {
  /*jobseekers text*/
  jobseekers: [
    {
      topic: "Be Honest on Your Profile",
      practice:
        "Ensure your profile information, experience,and availability are truthful and up to date. This builds trust with employers.",
    },
    {
      topic: "Respect All Agreements",
      practice:
        "If you commit to a job, follow through. Arrive on time, complete the agreed work,and communicate any issues early.",
    },
    {
      topic: "Give Feedback After Jobs",
      practice:
        "Provide honest feedback after completing a job. It helps build a transparent and reliable community.",
    },
  ],
  /*employers text*/
  employers: [
    {
      topic: "Promote Safe Work Environments",
      practice:
        "Provide clear job expectations, safety tools where needed, and fair treatment to all workers.",
    },
    {
      topic: "Pay Fairly and Promptly",
      practice:
        "Ensure fair compensation for work done. Avoid delays in payment and respect agreed terms.",
    },
    {
      topic: "Use the Platform Respectfully",
      practice:
        "Avoid posting misleading job ads. Treat applicants with professionalism and integrity.",
    },
  ],
};

const BestPractices: React.FC = () => {
  return (
    <section className="max-w-5xl mx-auto py-12 px-4 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary-600">
        Best Practices
      </h1>
      <p className="text-center text-lg text-gray-600 mb-10">
        Take note and follow these practices to ensure positive experiences on Farmwork Hub, whether youre looking for work or hiring.
      </p>

      { /* jobseekers section */}
      <div className= "mb-11">
        <h2 className="text-2xl font-bold text-primary-600 mb-4">For Job Seekers</h2>
          <div className="space-y-6">
            {bestPractices.jobseekers.map((pointer, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-2 text-primary-700">{pointer.topic}</h3>
                <p className="text-gray-700">{pointer.practice}</p>
              </div>
            ))}
          </div>
      </div>

      {/* employers section */}
      <div>
        <h2 className="text-2xl font-bold text-primary-600 mb-4">For Employers</h2>
        <div className="space-y-6">
            {bestPractices.employers.map((pointer, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-2 text-primary-700">{pointer.topic}</h3>
                <p className="text-gray-700">{pointer.practice}</p>
              </div>
            ))}
          </div>
      </div>
    </section>
  );
};

export default BestPractices;