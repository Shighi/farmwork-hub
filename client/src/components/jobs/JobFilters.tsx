// src/components/jobs/JobFilters.tsx
import React from 'react';
import { Search, MapPin, Briefcase, DollarSign, X } from 'lucide-react';
import { JobFilters } from '../../types/jobs';

interface JobFiltersProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  totalJobs?: number;
}

const JobFiltersComponent: React.FC<JobFiltersProps> = ({ filters, onFiltersChange, totalJobs = 0 }) => {
  const locations = ['Kenya', 'Nigeria', 'Ghana', 'Tanzania', 'Uganda', 'South Africa', 'Rwanda', 'Ethiopia'];

  const categories = [
    'Agriculture & Farming', 'Technology & IT', 'Healthcare & Medicine',
    'Education & Training', 'Finance & Banking', 'Construction & Engineering',
    'Sales & Marketing', 'Human Resources'
  ];

  const jobTypes = [
    { value: 'fullTime', label: 'Full Time' },
    { value: 'partTime', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' }
  ];

  const salaryRanges = [
    'Under $30,000', '$30,000 - $50,000', '$50,000 - $75,000',
    '$75,000 - $100,000', '$100,000+'
  ];

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilter = (key: keyof JobFilters) => {
    onFiltersChange({ ...filters, [key]: '' });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      location: '',
      category: '',
      jobType: '',
      salaryRange:undefined,
      skills: [],
      sortBy: 'newest',
      page: 1,
      limit: 10
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== '' && value !== undefined && value !== null;
  });

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search jobs, skills, or companies..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 text-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          >
            <option value="">All locations</option>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Briefcase className="w-4 h-4 inline mr-1" />
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          >
            <option value="">All categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
          <select
            value={filters.jobType}
            onChange={(e) => handleFilterChange('jobType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          >
            <option value="">All types</option>
            {jobTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Salary Range
          </label>
          <select
            value={typeof filters.salaryRange === 'string' ? filters.salaryRange : ''}
            onChange={(e) => handleFilterChange('salaryRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          >
            <option value="">Any salary</option>
            {salaryRanges.map(range => <option key={range} value={range}>{range}</option>)}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Active Filters</h3>
            <button onClick={clearAllFilters} className="text-sm text-red-600 hover:text-red-700">
              Clear All
            </button>
          </div>
        </div>
      )}

      <div className="text-center text-gray-600">
        <p className="text-lg font-medium">{totalJobs} jobs found</p>
        <p className="text-sm">Showing results for your search criteria</p>
      </div>
    </div>
  );
};

export default JobFiltersComponent;
