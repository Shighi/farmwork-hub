import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Briefcase, Star, ArrowRight, CheckCircle } from 'lucide-react';

const Home: React.FC = () => {
  const stats = [
    { label: 'Active Jobs', value: '2,500+', icon: Briefcase },
    { label: 'Registered Workers', value: '15,000+', icon: Users },
    { label: 'Locations Served', value: '54', icon: MapPin },
    { label: 'Success Rate', value: '94%', icon: Star },
  ];

  const features = [
    {
      title: 'Find Agricultural Work',
      description: 'Browse thousands of farming jobs across Africa, from seasonal work to permanent positions.',
      icon: '🌱',
    },
    {
      title: 'Verified Employers',
      description: 'Work with trusted farmers and agribusinesses with verified profiles and ratings.',
      icon: '✅',
    },
    {
      title: 'Fair Compensation',
      description: 'Transparent salary information and secure payment processing for all jobs.',
      icon: '💰',
    },
    {
      title: 'Skill Development',
      description: 'Access training resources and build your agricultural career with expert guidance.',
      icon: '📚',
    },
  ];

  const testimonials = [
    {
      name: 'Amara Osei',
      location: 'Accra, Ghana',
      role: 'Farm Worker',
      content: 'FarmWork Hub helped me find steady work on a cocoa farm. The platform is easy to use and payments are always on time.',
      rating: 5,
    },
    {
      name: 'James Mwangi',
      location: 'Nairobi, Kenya',
      role: 'Farm Owner',
      content: 'I\'ve hired over 20 workers through this platform. The quality of candidates is excellent and the process is straightforward.',
      rating: 5,
    },
    {
      name: 'Fatima Alabi',
      location: 'Lagos, Nigeria',
      role: 'Agricultural Specialist',
      content: 'Great platform for finding specialized agricultural work. The skill matching feature connected me with the perfect opportunities.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Connecting Africa's
                <span className="text-green-300"> Agricultural </span>
                Workforce
              </h1>
              <p className="text-xl mb-8 text-green-50">
                Join thousands of farmers, workers, and agribusinesses building a stronger agricultural future across Africa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/jobs"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
                >
                  Find Jobs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/post-job"
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
                >
                  Post a Job
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="African farmers working together"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white text-gray-800 p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-semibold">2,500+ Jobs Posted This Month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FarmWork Hub?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're building the future of agricultural employment across Africa with innovative features designed for farmers and workers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from farmers and workers across Africa
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Agricultural Journey?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of farmers and workers building Africa's agricultural future
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/jobs"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;