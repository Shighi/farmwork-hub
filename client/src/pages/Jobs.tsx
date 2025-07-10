import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import JobCard from '../components/jobs/JobCard';
import JobFiltersComponent from '../components/jobs/JobFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useJobs } from '../hooks/useJobs';
import { Job, JobFilters } from '../types/jobs';
import { Grid, List, Search } from 'lucide-react';

const Jobs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [filters, setFilters] = useState<JobFilters>({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    jobType: searchParams.get('jobType') || '',
    skills: searchParams.get('skills') ? searchParams.get('skills')!.split(',') : [],
    sortBy: 'newest',
    page: 1,
    limit: 10
  });

  const { jobs, loading, error, totalCount, refresh } = useJobs({ filters, autoFetch: true });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.location) params.set('location', filters.location);
    if (filters.category) params.set('category', filters.category);
    if (filters.jobType) params.set('jobType', filters.jobType);
    if (filters.salaryRange) {
      params.set('salaryMin', filters.salaryRange.min.toString());
      params.set('salaryMax', filters.salaryRange.max.toString());
    }
    if (filters.skills && filters.skills.length > 0) params.set('skills', filters.skills.join(','));
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
  };

  const handleViewDetails = (job: Job) => {
    navigate(`/jobs/${job.id}`);
  };

  const handleApply = (jobId: string) => {
    navigate(`/jobs/${jobId}/apply`);
  };

  const clearFilters = () => {
    const clearedFilters: JobFilters = {
      search: '',
      location: '',
      category: '',
      jobType: '',
      skills: [],
      sortBy: 'newest',
      page: 1,
      limit: 10
    };
    setFilters(clearedFilters);
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (filters.search?.trim()) count++;
    if (filters.location) count++;
    if (filters.category) count++;
    if (filters.jobType) count++;
    if (filters.salaryType) count++;
    if (filters.salaryRange) count++;
    if (filters.minSalary !== undefined) count++;
    if (filters.maxSalary !== undefined) count++;
    if (filters.skills?.length) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Agricultural Jobs Across Africa
          </h1>
          <p className="text-gray-600">
            Discover opportunities in farming, livestock, agribusiness, and more
          </p>
        </div>

        {/* Job Filters on top */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <JobFiltersComponent
            filters={filters}
            onFiltersChange={handleFilterChange}
            totalJobs={totalCount}
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold text-gray-900">
                {totalCount} Jobs Found
              </h2>
              {(filters.search || activeFiltersCount() > 0) && (
                <p className="text-gray-600 mt-1">
                  {filters.search && `Searching for "${filters.search}"`}
                  {filters.search && activeFiltersCount() > 0 && ' with '}
                  {activeFiltersCount() > 0 &&
                    `${activeFiltersCount()} filter${activeFiltersCount() > 1 ? 's' : ''} applied`}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
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
            <div
              className={`grid gap-6 ${
                viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
              }`}
            >
              {jobs.map((job: Job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onViewDetails={handleViewDetails}
                  onApply={handleApply}
                  showApplyButton={true}
                  isApplied={false}
                />
              ))}
            </div>
          )}

          {jobs.length > 0 && jobs.length < totalCount && (
            <div className="text-center mt-8">
              <button
                onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Load More Jobs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
