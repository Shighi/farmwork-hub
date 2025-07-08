// src/components/common/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
  {
    title: 'For Job Seekers',
    links: [
      { label: 'Browse Jobs', to: '/jobs' },
      { label: 'Job Categories', to: '/jobs?category=all' },
      { label: 'Career Tips', to: '/resources/career-tips' },
      { label: 'Resume Builder', to: '/tools/resume-builder' },
      { label: 'Salary Guide', to: '/resources/salary-guide' },
    ],
  },
  {
    title: 'For Employers',
    links: [
      { label: 'Post a Job', to: '/post-job' },
      { label: 'Employer Dashboard', to: '/dashboard' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Recruitment Tips', to: '/resources/recruitment' },
      { label: 'Success Stories', to: '/success-stories' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Agriculture News', to: '/resources/news' },
      { label: 'Training Programs', to: '/resources/training' },
      { label: 'Market Insights', to: '/resources/market' },
      { label: 'Best Practices', to: '/resources/practices' },
      { label: 'Industry Reports', to: '/resources/reports' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', to: '/help' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'FAQs', to: '/faq' },
      { label: 'Safety Guidelines', to: '/safety' },
      { label: 'Report Issue', to: '/report' },
    ],
  },
];


  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/farmworkhub', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/farmworkhub', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/farmworkhub', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/company/farmworkhub', label: 'LinkedIn' },
  ];

  const africaOffices = [
    {
      country: 'Kenya',
      city: 'Nairobi',
      address: 'Westlands Business District',
      phone: '+254 700 123 456',
      email: 'kenya@farmworkhub.africa',
    },
    {
      country: 'Nigeria',
      city: 'Lagos',
      address: 'Victoria Island',
      phone: '+234 801 234 567',
      email: 'nigeria@farmworkhub.africa',
    },
    {
      country: 'Ghana',
      city: 'Accra',
      address: 'Airport Residential Area',
      phone: '+233 241 234 567',
      email: 'ghana@farmworkhub.africa',
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">FarmWork Hub</span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-sm">
              Connecting agricultural talent across Africa. Empowering farmers, 
              agribusinesses, and rural communities through meaningful employment opportunities.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-md hover:bg-primary-600 transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Africa Offices Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h3 className="text-lg font-semibold mb-6 text-center lg:text-left">
            Our Presence Across Africa
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {africaOffices.map((office) => (
              <div key={office.country} className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-primary-400 mb-2">
                  {office.city}, {office.country}
                </h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary-400" />
                    <span>{office.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-primary-400" />
                    <span>{office.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-primary-400" />
                    <span>{office.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto lg:mx-0">
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-4 text-sm">
              Get the latest agricultural job opportunities and industry insights 
              delivered to your inbox.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-primary-600 text-white px-6 py-2 rounded-r-md hover:bg-primary-700 transition-colors font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
              <span>© {currentYear} FarmWork Hub. All rights reserved.</span>
              <div className="flex space-x-4">
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link to="/cookies" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>🌍 Proudly serving Africa</span>
              <div className="flex space-x-1">
                <span>🇰🇪</span>
                <span>🇳🇬</span>
                <span>🇬🇭</span>
                <span>🇺🇬</span>
                <span>🇹🇿</span>
                <span>🇿🇦</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};