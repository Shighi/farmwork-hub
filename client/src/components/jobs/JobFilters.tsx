import React, { useState, useEffect, useCallback } from 'react';
import { JobFilters as JobFiltersType } from '../../types/jobs';
import { AFRICAN_COUNTRIES, JOB_CATEGORIES, JOB_TYPES, SALARY_RANGES } from '../../utils/constants';
import { Search, Filter, X, MapPin, Briefcase, DollarSign, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface JobFiltersProps {
  filters: JobFiltersType;
  onFiltersChange: (filters: JobFiltersType) => void;
  totalJobs: number;
  className?: string;
  isLoading?: boolean;
}

const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onFiltersChange,
  totalJobs,
  className = '',
  isLoading = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<JobFiltersType>(filters);
  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Debounced search to avoid too many API calls
  const debouncedSearch = useCallback((searchTerm: string) => {
    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }
    
    const timeout = setTimeout(() => {
      const newFilters = { ...localFilters, search: searchTerm, page: 1 };
      setLocalFilters(newFilters);
      onFiltersChange(newFilters);
    }, 300);
    
    setSearchDebounce(timeout);
  }, [localFilters, onFiltersChange, searchDebounce]);

  const handleFilterChange = (key: keyof JobFiltersType, value: any) => {
    const newFilters = { ...localFilters, [key]: value, page: 1 }; // Reset to first page on filter change
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setLocalFilters(prev => ({ ...prev, search: searchTerm }));
    debouncedSearch(searchTerm);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFilterChange('location', e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFilterChange('category', e.target.value);
  };

  const handleJobTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFilterChange('jobType', e.target.value);
  };

  const handleSalaryTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFilterChange('salaryType', e.target.value);
  };

  const handleSalaryRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      const [min, max] = value.split('-').map(Number);
      handleFilterChange('salaryRange', { min, max });
    } else {
      handleFilterChange('salaryRange', undefined);
    }
  };

  const handleMinSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleFilterChange('minSalary', value ? Number(value) : undefined);
  };

  const handleMaxSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleFilterChange('maxSalary', value ? Number(value) : undefined);
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value
      .split(',')
      .map(skill => skill.trim())
      .filter(Boolean);
    handleFilterChange('skills', skills.length > 0 ? skills : []);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    // Parse combined sort value (e.g., "salary-desc" -> sortBy: "salary", sortOrder: "desc")
    if (value.includes('-')) {
      const [sortBy, sortOrder] = value.split('-');
      handleFilterChange('sortBy', sortBy);
      handleFilterChange('sortOrder', sortOrder);
    } else {
      handleFilterChange('sortBy', value);
      handleFilterChange('sortOrder', 'desc'); // Default order
    }
  };

  const clearAllFilters = () => {
    const clearedFilters: JobFiltersType = {
      search: '',
      location: '',
      category: '',
      jobType: '',
      salaryType: '',
      salaryRange: undefined,
      minSalary: undefined,
      maxSalary: undefined,
      skills: [],
      sortBy: 'newest',
      sortOrder: 'desc',
      page: 1,
      limit: 10
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const clearIndividualFilter = (filterKey: keyof JobFiltersType) => {
    let clearedValue: any;
    switch (filterKey) {
      case 'skills':
        clearedValue = [];
        break;
      case 'salaryRange':
      case 'minSalary':
      case 'maxSalary':
        clearedValue = undefined;
        break;
      default:
        clearedValue = '';
    }
    handleFilterChange(filterKey, clearedValue);
  };

  const hasActiveFilters = () => {
    return (
      (localFilters.search && localFilters.search.trim() !== '') ||
      (localFilters.location && localFilters.location !== '') ||
      (localFilters.category && localFilters.category !== '') ||
      (localFilters.jobType && localFilters.jobType !== '') ||
      (localFilters.salaryType && localFilters.salaryType !== '') ||
      localFilters.salaryRange ||
      localFilters.minSalary !== undefined ||
      localFilters.maxSalary !== undefined ||
      (localFilters.skills && localFilters.skills.length > 0)
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.search && localFilters.search.trim() !== '') count++;
    if (localFilters.location && localFilters.location !== '') count++;
    if (localFilters.category && localFilters.category !== '') count++;
    if (localFilters.jobType && localFilters.jobType !== '') count++;
    if (localFilters.salaryType && localFilters.salaryType !== '') count++;
    if (localFilters.salaryRange) count++;
    if (localFilters.minSalary !== undefined) count++;
    if (localFilters.maxSalary !== undefined) count++;
    if (localFilters.skills && localFilters.skills.length > 0) count++;
    return count;
  };

  // Get current sort value for display
  const getCurrentSortValue = () => {
    if (localFilters.sortBy && localFilters.sortOrder) {
      return `${localFilters.sortBy}-${localFilters.sortOrder}`;
    }
    return localFilters.sortBy || 'newest';
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchDebounce) {
        clearTimeout(searchDebounce);
      }
    };
  }, [searchDebounce]);

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}>
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search jobs by title, skills, or keywords..."
            value={localFilters.search || ''}
            onChange={handleSearchChange}
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-gray-700 hover:text-gray-900 transition-colors group"
        >
          <Filter className="w-4 h-4 mr-2" />
          <span className="font-medium">Advanced Filters</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 ml-2 transition-transform" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-2 transition-transform" />
          )}
          {hasActiveFilters() && (
            <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              {getActiveFiltersCount()} active
            </span>
          )}
        </button>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 font-medium">
            {totalJobs.toLocaleString()} {totalJobs === 1 ? 'job' : 'jobs'} found
          </span>
          {hasActiveFilters() && (
            <button
              onClick={clearAllFilters}
              disabled={isLoading}
              className="text-sm text-red-600 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 space-y-6 bg-gray-50 border-t border-gray-100">
          {/* Primary Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Location Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              <select
                value={localFilters.location || ''}
                onChange={handleLocationChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed bg-white"
              >
                <option value="">All locations</option>
                {AFRICAN_COUNTRIES.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Briefcase className="w-4 h-4 inline mr-1" />
                Job Category
              </label>
              <select
                value={localFilters.category || ''}
                onChange={handleCategoryChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed bg-white"
              >
                <option value="">All categories</option>
                {JOB_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Type Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 inline mr-1" />
                Employment Type
              </label>
              <select
                value={localFilters.jobType || ''}
                onChange={handleJobTypeChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed bg-white"
              >
                <option value="">All types</option>
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1')}
                  </option>
                ))}
              </select>
            </div>

            {/* Salary Type Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Salary Type
              </label>
              <select
                value={localFilters.salaryType || ''}
                onChange={handleSalaryTypeChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed bg-white"
              >
                <option value="">Any type</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          {/* Salary Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Salary Range Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Salary Range (Presets)
              </label>
              <select
                value={
                  localFilters.salaryRange
                    ? `${localFilters.salaryRange.min}-${localFilters.salaryRange.max}`
                    : ''
                }
                onChange={handleSalaryRangeChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed bg-white"
              >
                <option value="">Any salary</option>
                {SALARY_RANGES.map((range) => (
                  <option key={`${range.min}-${range.max}`} value={`${range.min}-${range.max}`}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Salary Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Minimum Salary
              </label>
              <input
                type="number"
                placeholder="e.g., 50000"
                value={localFilters.minSalary || ''}
                onChange={handleMinSalaryChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Max Salary Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Maximum Salary
              </label>
              <input
                type="number"
                placeholder="e.g., 100000"
                value={localFilters.maxSalary || ''}
                onChange={handleMaxSalaryChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Skills and Sort */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Skills Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Required Skills
              </label>
              <input
                type="text"
                placeholder="e.g., planting, harvesting, irrigation, livestock"
                value={localFilters.skills?.join(', ') || ''}
                onChange={handleSkillChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">Separate multiple skills with commas</p>
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Sort Results By
              </label>
              <select
                value={getCurrentSortValue()}
                onChange={handleSortChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed bg-white"
              >
                <option value="newest">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="createdAt-desc">Created Date (Newest)</option>
                <option value="createdAt-asc">Created Date (Oldest)</option>
                <option value="salary-desc">Highest Salary</option>
                <option value="salary-asc">Lowest Salary</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="location-asc">Location (A-Z)</option>
                <option value="location-desc">Location (Z-A)</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters() && (
            <div className="pt-4 border-t border-gray-200 bg-white rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Active Filters:</h4>
              <div className="flex flex-wrap gap-2">
                {localFilters.search && localFilters.search.trim() !== '' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200">
                    Search: "{localFilters.search}"
                    <button
                      onClick={() => clearIndividualFilter('search')}
                      className="ml-2 hover:text-green-900 transition-colors"
                      disabled={isLoading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {localFilters.location && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
                    Location: {localFilters.location}
                    <button
                      onClick={() => clearIndividualFilter('location')}
                      className="ml-2 hover:text-blue-900 transition-colors"
                      disabled={isLoading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {localFilters.category && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800 border border-orange-200">
                    Category: {localFilters.category}
                    <button
                      onClick={() => clearIndividualFilter('category')}
                      className="ml-2 hover:text-orange-900 transition-colors"
                      disabled={isLoading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {localFilters.jobType && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 border border-purple-200">
                    Type: {localFilters.jobType.charAt(0).toUpperCase() + localFilters.jobType.slice(1)}
                    <button
                      onClick={() => clearIndividualFilter('jobType')}
                      className="ml-2 hover:text-purple-900 transition-colors"
                      disabled={isLoading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {localFilters.salaryType && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800 border border-teal-200">
                    Salary Type: {localFilters.salaryType.charAt(0).toUpperCase() + localFilters.salaryType.slice(1)}
                    <button
                      onClick={() => clearIndividualFilter('salaryType')}
                      className="ml-2 hover:text-teal-900 transition-colors"
                      disabled={isLoading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {localFilters.salaryRange && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200">
                    Range: ${localFilters.salaryRange.min.toLocaleString()} - ${localFilters.salaryRange.max.toLocaleString()}
                    <button
                      onClick={() => clearIndividualFilter('salaryRange')}
                      className="ml-2 hover:text-green-900 transition-colors"
                      disabled={isLoading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {localFilters.minSalary !== undefined && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Min: ${localFilters.minSalary.toLocaleString()}
                    <button
                      onClick={() => clearIndividualFilter('minSalary')}
                      className="ml-2 hover:text-emerald-900 transition-colors"
                      disabled={isLoading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {localFilters.maxSalary !== undefined && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-lime-100 text-lime-800 border border-lime-200">
                    Max: ${localFilters.maxSalary.toLocaleString()}
                    <button
                      onClick={() => clearIndividualFilter('maxSalary')}
                      className="ml-2 hover:text-lime-900 transition-colors"
                      disabled={isLoading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {localFilters.skills && localFilters.skills.length > 0 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 border border-indigo-200">
                    Skills: {localFilters.skills.join(', ')}
                    <button
                      onClick={() => clearIndividualFilter('skills')}
                      className="ml-2 hover:text-indigo-900 transition-colors"
                      disabled={isLoading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobFilters;