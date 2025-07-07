import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 text-gray-800 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      {/* Image Side */}
      <div>
        <img
          src="https://images.unsplash.com/photo-1509099381441-ea3c0cf98b94?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWZyaWNhbiUyMGZhcm1lcnxlbnwwfHwwfHx8MA%3D%3D"
          alt="African farmer"
          className="w-full object-cover rounded-[10px] shadow-xl border-none outline-none"
        />
      </div>

      {/* Text Side */}
      <div>
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        <p className="mb-4">
          FarmWork Hub is a modern web application connecting agricultural employers with job seekers across Africa.
          We provide a reliable digital space where farmers, agribusinesses, and agricultural organizations can post
          job listings. At the same time, youth and rural workers gain seamless access to agricultural employment
          opportunities that fit their skills, interests, and locations.
        </p>
        <p>
          Our mission is to empower Africa’s agricultural workforce by making employment more accessible,
          transparent, and equitable. We aim to reduce unemployment, support food security, and foster a thriving
          agricultural ecosystem through digital innovation.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
