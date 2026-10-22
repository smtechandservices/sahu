"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import CareerHero from "./CareerHero";
import JobCard from "./JobCard";
import AdCarousel from "./AdCarousel";
import Pagination from "../Pagination/Pagination";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useLanguage } from '../../context/LanguageContext';

const JOB_TYPES = ["All", "Full-time", "Part-time", "Contract", "Remote"];
const ITEMS_PER_PAGE = 9;

export default function CareerClient() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, _setSearch] = useState("");
  const [typeFilter, _setTypeFilter] = useState("All");
  const [locationFilter, _setLocationFilter] = useState("");
  const [page, setPage] = useState(1);
  const { t, tv } = useLanguage();

  // Any filter change goes back to page 1
  const setSearch = (v) => { _setSearch(v); setPage(1); };
  const setTypeFilter = (v) => { _setTypeFilter(v); setPage(1); };
  const setLocationFilter = (v) => { _setLocationFilter(v); setPage(1); };

  useEffect(() => {
    import('../../lib/api').then(({ fetchApi }) => {
      fetchApi('/jobs/')
        .then(data => setJobs(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    });
  }, []);

  const locations = useMemo(() => {
    const locs = [...new Set(jobs.map(j => j.location).filter(Boolean))];
    return locs.sort();
  }, [jobs]);

  const filtered = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch =
        !search ||
        job.title?.toLowerCase().includes(search.toLowerCase()) ||
        job.company?.toLowerCase().includes(search.toLowerCase()) ||
        job.description?.toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === "All" || job.type === typeFilter;

      const matchesLocation =
        !locationFilter || job.location === locationFilter;

      return matchesSearch && matchesType && matchesLocation;
    });
  }, [jobs, search, typeFilter, locationFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const hasActiveFilters = search || typeFilter !== "All" || locationFilter;

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("All");
    setLocationFilter("");
  };

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen pb-20">
        <CareerHero />

        <div className="px-4 sm:px-6 md:px-8 py-12 flex flex-col lg:flex-row lg:items-start gap-8">
          <div className="flex-1 min-w-0">

          {/* Filters bar */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('Search by title, company...', 'पद, कंपनी से खोजें...')}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all whitespace-nowrap"
                >
                  <X className="w-4 h-4" />
                  {t('Clear', 'हटाएँ')}
                </button>
              )}
            </div>

            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3" /> {t('Filters:', 'फ़िल्टर:')}
                </span>
                {search && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                    "{search}"
                    <button onClick={() => setSearch("")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {typeFilter !== "All" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                    {tv(typeFilter)}
                    <button onClick={() => setTypeFilter("All")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {locationFilter && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                    {locationFilter}
                    <button onClick={() => setLocationFilter("")}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Header row */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{t('Opportunities', 'अवसर')}</h2>
              <p className="text-gray-500 text-sm mt-1">
                {loading
                  ? t('Loading...', 'लोड हो रहा है...')
                  : t(`${filtered.length} ${filtered.length === 1 ? 'job' : 'jobs'} found`, `${filtered.length} नौकरियाँ मिलीं`)}
              </p>
            </div>
          </div>

          {/* Job grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-6" />
                  <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">{t('No jobs found', 'कोई नौकरी नहीं मिली')}</h3>
              <p className="text-gray-400 text-sm">{t('Try adjusting your filters or search term.', 'फ़िल्टर या खोज शब्द बदलकर देखें।')}</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="mt-4 text-primary font-bold text-sm hover:underline">
                  {t('Clear all filters', 'सभी फ़िल्टर हटाएँ')}
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {paginated.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  total={filtered.length}
                  perPage={ITEMS_PER_PAGE}
                  onChange={p => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}
            </>
          )}

          </div>

          {/* Kaamlee ad: right sidebar on desktop, above the search bar on mobile */}
          {/* Sidebar: on mobile its children join the page flow (filters first, ad last) */}
          <div className="contents lg:flex lg:flex-col lg:gap-6 lg:w-80 lg:shrink-0 lg:sticky lg:top-6">
            <div className="order-first lg:order-none bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                <SlidersHorizontal className="w-4 h-4 text-gray-400" /> {t('Filters', 'फ़िल्टर')}
              </h3>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2" htmlFor="job-type-filter">{t('Job Type', 'नौकरी का प्रकार')}</label>
              <select
                id="job-type-filter"
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-full"
              >
                {JOB_TYPES.map(type => (
                  <option key={type} value={type}>{type === "All" ? t('All Types', 'सभी प्रकार') : tv(type)}</option>
                ))}
              </select>

              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-4" htmlFor="job-location-filter">{t('Location', 'स्थान')}</label>
              <select
                id="job-location-filter"
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-full"
              >
                <option value="">{t('All Locations', 'सभी स्थान')}</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <AdCarousel className="order-last lg:order-none w-full" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
