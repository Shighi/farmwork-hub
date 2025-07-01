import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import JobCard from '../components/jobs/JobCard';
import JobFilters from '../components/jobs/JobFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useJobs } from '../hooks/useJobs';
import { Job, JobFilters as JobFiltersType } from '../types/jobs';
import { Search, MapPin, Filter, Grid, List } from 'lucide-react';

const Jobs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  
  const [filters, setFilters] = useState<JobFiltersType>({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    jobType: searchParams.get('jobType') || '',
    salaryRange: undefined,
    skills: searchParams.get('skills') ? searchParams.get('skills')!.split(',') : [],
    sortBy: 'newest',
    page: 1,
    limit: 10
  });

  const { jobs, loading, error, totalCount, refresh } = useJobs({ filters, autoFetch: true });

  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('search', searchTerm);
    if (filters.location) params.set('location', filters.location);
    if (filters.category) params.set('category', filters.category);
    if (filters.jobType) params.set('jobType', filters.jobType);
    if (filters.salaryRange) {
      params.set('salaryMin', filters.salaryRange.min.toString());
      params.set('salaryMax', filters.salaryRange.max.toString());
    }
    if (filters.skills && filters.skills.length > 0) params.set('skills', filters.skills.join(','));
    
    setSearchParams(params);
  }, [searchTerm, filters, setSearchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFilters = { ...filters, search: searchTerm };
    setFilters(updatedFilters);
  };

  const handleFilterChange = (newFilters: JobFiltersType) => {
    setFilters(newFilters);
  };

  const handleViewDetails = (job: Job) => {
    // Navigate to job details page
    navigate(`/jobs/${job.id}`);
  };

  const handleApply = (jobId: string) => {
    // Navigate to job application page
    navigate(`/jobs/${jobId}/apply`);
  };

  const clearFilters = () => {
    const clearedFilters: JobFiltersType = {
      search: '',
      location: '',
      category: '',
      jobType: '',
      salaryRange: undefined,
      skills: [],
      sortBy: 'newest',
      page: 1,
      limit: 10
    };
    setFilters(clearedFilters);
    setSearchTerm('');
  };

  const activeFiltersCount = Object.values(filters).filter(value => {
    if (value === '' || value === undefined) return false;
    if (Array.isArray(value) && value.length === 0) return false;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // For salaryRange object
      return true;
    }
    return true;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Agricultural Jobs Across Africa
          </h1>
          <p className="text-gray-600">
            Discover opportunities in farming, livestock, agribusiness, and more
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by title, skills, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location (city, country)"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Search Jobs
            </button>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Clear all ({activeFiltersCount})
                  </button>
                )}
              </div>
              <JobFilters
                filters={filters}
                onFiltersChange={handleFilterChange}
                totalJobs={totalCount}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-semibold text-gray-900">
                  {totalCount} Jobs Found
                </h2>
                {(searchTerm || activeFiltersCount > 0) && (
                  <p className="text-gray-600 mt-1">
                    {searchTerm && `Searching for "${searchTerm}"`}
                    {searchTerm && activeFiltersCount > 0 && ' with '}
                    {activeFiltersCount > 0 && `${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} applied`}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-700">{error}</p>
                <button
                  onClick={refresh}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters to find more opportunities.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2' 
                  : 'grid-cols-1'
              }`}>
                {jobs.map((job: Job) => (
                  <JobCard 
                    key={job.id} 
                    job={job}
                    onViewDetails={handleViewDetails}
                    onApply={handleApply}
                    showApplyButton={true}
                    isApplied={false} // You might want to track this state based on user applications
                  />
                ))}
              </div>
            )}

            {/* Load More */}
            {jobs.length > 0 && jobs.length < totalCount && (
              <div className="text-center mt-8">
                <button
                  onClick={() => {
                    // This would typically load more jobs
                    console.log('Load more jobs');
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Load More Jobs
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;