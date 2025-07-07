import React from 'react';

const SuccessStories: React.FC = () => {
  return (
    <section className="max-w-5xl mx-auto py-12 px-4 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary-600">
        Success Stories
      </h1>
      <p className="text-center text-lg text-gray-600 mb-12">
        Real people. Real impact. Discover how FarmWork Hub is changing lives across Africa.
      </p>

      <div className='space-y-8'>
        {successStories.map((story, index) => (
          <div
            key={index}
            className="mb-8 p-6 bg-white shadow-md border border-gray-200 hover:shadow-lg transition"
            >
            <h3 className="text-xl font-semibold text-primary-700 mb-2"> {story.info}</h3>
            <p className="text-gray-700 text-base">{story.story}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const successStories = [
  {
    info: "Kwesi Appiah (Accra, Ghana)",
    story:
    "I had been unemployed for 2 years before i discovered FarmworkHub. FarmWork Hub helped me find seasonal farm work in just a few days with ease and i was able to earn income and support my family during the dry season."
  },

  {
    info: "Kelechi Nwachukwu (Abia, Nigeria)",
    story:
    "As a young graduate, I never imagined working in agriculture. FarmWork Hub connected me to a greenhouse farm where I now manage crops sustainably. I was met with criticism from people around me when i started but now they are interested in agriculture too "
  },

  {
    info: "Ayomide Aderigbigbe (Ibadan, Nigeria)",
    story:
    "This platform gave me a chance to grow professionally. I started with manual labor and now supervise others thanks to the training opportunities I got."
  },
];

export default SuccessStories;