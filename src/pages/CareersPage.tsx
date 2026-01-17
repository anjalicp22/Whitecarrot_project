// CareersPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { storageService } from "../services/storage";
import type { Company, Job, ContentSection } from "../types/types";

export default function CareersPage() {
  const { companySlug } = useParams<{ companySlug: string }>();

  const [company, setCompany] = useState<Company | null>(null);
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    console.log('CareersPage: companySlug =', companySlug);

    // Suppress YouTube-related errors
    const originalError = console.error;
    console.error = (...args) => {
      if (args[0] && typeof args[0] === 'string' &&
          (args[0].includes('content-youtube-embed.js') ||
           args[0].includes('browser extension') ||
           args[0].includes('CORS policy') ||
           args[0].includes('aria-hidden'))) {
        return;
      }
      originalError.apply(console, args);
    };

    if (!companySlug) {
      console.log('CareersPage: No companySlug provided');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      console.log('CareersPage: Starting to load data for companySlug:', companySlug);

      try {
        const companyData = await storageService.getCompanyById(companySlug);
        console.log('CareersPage: Company data received:', companyData);

        if (companyData) {
          setCompany(companyData);
          setSections(companyData.sections.sort((a, b) => a.order - b.order));
          setJobs(companyData.jobs);
          console.log('CareersPage: Data loaded successfully');
          console.log('CareersPage: Company theme data:', companyData.theme);
          console.log('CareersPage: Logo URL:', companyData.theme.logoUrl);
          console.log('CareersPage: Banner URL:', companyData.theme.bannerUrl);
          console.log('CareersPage: Culture Video URL:', companyData.theme.cultureVideoUrl);
        } else {
          console.log('CareersPage: No company data found for slug:', companySlug);
        }
      } catch (error) {
        console.error('CareersPage: Error loading company data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Cleanup function to restore original console.error
    return () => {
      console.error = originalError;
    };
  }, [companySlug]);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesLocation = locationFilter
      ? job.location === locationFilter
      : true;

    const matchesJobType = jobTypeFilter
      ? job.type === jobTypeFilter
      : true;

    return matchesSearch && matchesLocation && matchesJobType;
  });

  const locations = Array.from(
    new Set(jobs.map((job) => job.location))
  );

  const jobTypes = Array.from(
    new Set(jobs.map((job) => job.type))
  );



  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!company) {
    return <div className="p-6">Company not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ===== Global Header ===== */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">{company.name}</h1>
            <button
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base"
            >
              ← Back
            </button>
          </div>
        </div>
      </header>

      {/* ===== Banner / Hero Section ===== */}
      <section
        className="relative h-64 rounded-lg mx-4 mt-8 mb-12 overflow-hidden"
        style={{
          backgroundColor: company.theme.bannerUrl && company.theme.bannerUrl !== "https://placehold.co/1200x400"
            ? undefined
            : company.theme.primaryColor || "#4F46E5",
          backgroundImage: company.theme.bannerUrl && company.theme.bannerUrl !== "https://placehold.co/1200x400"
            ? `url(${company.theme.bannerUrl})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay for text readability when using banner image */}
        {company.theme.bannerUrl && company.theme.bannerUrl !== "https://placehold.co/1200x400" && (
          <div className="absolute inset-0 bg-black/40"></div>
        )}

        {/* Subtle geometric shapes for depth (only show on solid color background) */}
        {!company.theme.bannerUrl || company.theme.bannerUrl === "https://placehold.co/1200x400" ? (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-16 h-16 border border-white rounded-lg rotate-45"></div>
          </div>
        ) : null}

        {/* Logo and Brand Name */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white">
            {company.theme.logoUrl && company.theme.logoUrl !== "https://placehold.co/1200x400" ? (
              <img
                src={company.theme.logoUrl}
                alt={company.name}
                className="mx-auto h-16 w-auto mb-4 filter brightness-0 invert"
              />
            ) : null}
            <h1 className="text-3xl font-bold">{company.name}</h1>
          </div>
        </div>
      </section>

      {/* ===== Page Heading Section ===== */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Careers at {company.name}
          </h1>
          <button
            onClick={() => document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-3 rounded-lg font-semibold text-white text-sm sm:text-base"
            style={{ backgroundColor: company.theme.primaryColor ?? "#4F46E5" }}
          >
            View open jobs
          </button>
        </div>
      </section>

      {/* ===== Content Sections ===== */}
      <main className="max-w-4xl mx-auto px-4 pb-20">
        {sections.filter(section => section.type !== 'life').map((section) => {
          // Parse the JSON content
          let parsedContent;
          try {
            parsedContent = JSON.parse(section.content);
          } catch {
            parsedContent = { title: section.title, body: section.content };
          }

          return (
            <section key={section.id} className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                {parsedContent.title || section.title}
              </h2>

              {section.type === 'benefits' ? (
                <ul className="space-y-3">
                  {(parsedContent.items || []).map((benefit: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <span
                        className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: company.theme.primaryColor ?? "#4F46E5" }}
                      ></span>
                      <span className="leading-relaxed">{benefit.trim()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {parsedContent.body || section.content}
                </p>
              )}
            </section>
          );
        })}

        {/* ===== Culture Video Section ===== */}
        {company.theme.cultureVideoUrl && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Life at {company.name}
            </h2>
            <div className="aspect-video max-w-3xl mx-auto">
              <iframe
                src={(() => {
                  const url = company.theme.cultureVideoUrl;
                  if (url.includes('youtube.com/watch?v=')) {
                    const videoId = url.split('v=')[1].split('&')[0];
                    return `https://www.youtube.com/embed/${videoId}`;
                  }
                  return url;
                })()}
                title="Culture Video"
                className="w-full h-full rounded-lg"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                onError={(e) => e.currentTarget.style.display = 'none'}
                onLoad={() => {
                  // Suppress YouTube extension errors
                  const suppressErrors = () => {
                    const originalError = console.error;
                    console.error = (...args) => {
                      if (args[0] && typeof args[0] === 'string' &&
                          (args[0].includes('content-youtube-embed.js') ||
                           args[0].includes('browser extension') ||
                           args[0].includes('CORS policy'))) {
                        return;
                      }
                      originalError.apply(console, args);
                    };
                  };
                  suppressErrors();
                }}
              ></iframe>
            </div>
          </section>
        )}

        {/* ===== Jobs Section ===== */}
        <section id="jobs" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Open Positions
          </h2>

          {/* Filters */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Jobs
                </label>
                <input
                  type="text"
                  placeholder="Job title or keyword..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-transparent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-transparent"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="">All locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-transparent"
                  value={jobTypeFilter}
                  onChange={(e) => setJobTypeFilter(e.target.value)}
                >
                  <option value="">All types</option>
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Job Cards */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-gray-200 p-4 sm:p-6 rounded-lg cursor-pointer hover:border-gray-300 transition-colors"
                onClick={() => setSelectedJob(job)}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center text-gray-600 text-sm gap-2">
                      <span>📍 {job.location}</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <button
                    className="px-4 py-2 rounded font-medium text-white text-sm w-full sm:w-auto"
                    style={{ backgroundColor: company.theme.primaryColor ?? "#4F46E5" }}
                  >
                    View job
                  </button>
                </div>
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No positions found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedJob(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="job-modal-title"
        >
          <div
            className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 id="job-modal-title" className="text-3xl font-bold mb-2">
                  {selectedJob.title}
                </h2>
                <div className="flex flex-wrap gap-3 text-gray-600">
                  <div className="flex items-center gap-1">
                    <span>📍</span>
                    <span>{selectedJob.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>💼</span>
                    <span>{selectedJob.type}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                aria-label="Close job details"
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {selectedJob.description && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">About this role</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedJob.description}
                </p>
              </div>
            )}

            {selectedJob.requirements && selectedJob.requirements.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: company.theme.primaryColor ?? "#2563eb" }}
                      />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              className="w-full py-6 text-lg font-medium rounded-lg transition-colors"
              style={{ backgroundColor: company.theme.primaryColor ?? "#2563eb", color: "white" }}
            >
              Apply Now
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        className="border-t mt-20 py-8"
        style={{ backgroundColor: (company.theme.primaryColor ?? "#2563eb") + "10" }}
      >
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
