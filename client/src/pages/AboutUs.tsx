import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Target, 
  Heart, 
  Globe, 
  Award, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  MapPin,
  Calendar,
  Briefcase
} from 'lucide-react';

const AboutUs: React.FC = () => {
  const stats = [
    { label: 'Countries Served', value: '12+', icon: Globe },
    { label: 'Jobs Posted', value: '10,000+', icon: Briefcase },
    { label: 'Success Stories', value: '5,000+', icon: Award },
    { label: 'Years of Experience', value: '3+', icon: Calendar },
  ];

  const values = [
    {
      title: 'Empowerment',
      description: 'We believe in empowering African farmers and agricultural workers with opportunities to grow and thrive.',
      icon: TrendingUp,
      color: 'bg-blue-500'
    },
    {
      title: 'Trust',
      description: 'Building trust between employers and workers through transparent processes and verified profiles.',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Innovation',
      description: 'Leveraging technology to modernize agricultural employment and create efficient connections.',
      icon: Target,
      color: 'bg-purple-500'
    },
    {
      title: 'Community',
      description: 'Fostering a supportive community where agricultural professionals can learn and grow together.',
      icon: Heart,
      color: 'bg-red-500'
    }
  ];

  const team = [
    {
      name: 'Daisy Mwambi',
      role: 'CEO & Founder',
      bio: 'Agricultural economist with 15+ years experience in sustainable farming and rural development across Africa.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Ibrahim Tajini',
      role: 'CTO',
      bio: 'Technology leader passionate about using digital solutions to transform agricultural employment in Africa.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Sophie Olushola',
      role: 'Head of Operations',
      bio: 'Operations expert with deep understanding of agricultural value chains and workforce development.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  const milestones = [
    {
      year: '2021',
      title: 'Foundation',
      description: 'FarmWork Hub was founded with a vision to revolutionize agricultural employment in Africa.'
    },
    {
      year: '2022',
      title: 'First 1,000 Jobs',
      description: 'Successfully connected our first 1,000 agricultural workers with meaningful employment opportunities.'
    },
    {
      year: '2023',
      title: 'Multi-Country Expansion',
      description: 'Expanded operations to 12 African countries, serving diverse agricultural communities.'
    },
    {
      year: '2024',
      title: 'Technology Innovation',
      description: 'Launched advanced matching algorithms and mobile app for better accessibility.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="text-green-300">FarmWork Hub</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-50 max-w-4xl mx-auto">
              We're on a mission to transform agricultural employment across Africa by connecting talented workers with opportunities that matter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/jobs"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                Explore Opportunities
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Get in Touch
              </Link>
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
                  <div className="bg-green-100 p-3 rounded-full">
                    <stat.icon className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                At FarmWork Hub, we believe that agriculture is the backbone of Africa's economy. Our mission is to create a seamless, transparent, and efficient platform that connects skilled agricultural workers with opportunities that match their expertise and aspirations.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                We're committed to promoting fair wages, safe working conditions, and professional development in the agricultural sector. By bridging the gap between employers and workers, we're building a stronger, more sustainable agricultural future for Africa.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Verified Employers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Fair Compensation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Skill Development</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Agricultural workers in the field"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do and shape how we serve our community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className={`${value.color} p-4 rounded-full`}>
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              Passionate professionals dedicated to transforming African agriculture
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              Key milestones in our mission to transform agricultural employment
            </p>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-green-200"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <div className="text-2xl font-bold text-green-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-green-500 rounded-full">
                    <div className="w-6 h-6 bg-white rounded-full"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Whether you're looking for work or seeking talented agricultural professionals, we're here to help.
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
              to="/contact"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;