"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import CareerHero from "./CareerHero";
import JobCard from "./JobCard";
import { Search, SlidersHorizontal, X } from "lucide-react";

const JOB_TYPES = ["All", "Full-time", "Part-time", "Contract", "Remote"];

export default function CareerClient() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("");

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

        <div className="px-8 py-12">

          {/* Filters bar */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, company..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Type filter */}
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-w-[140px]"
              >
                {JOB_TYPES.map(t => (
                  <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>
                ))}
              </select>

              {/* Location filter */}
              <select
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-w-[160px]"
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all whitespace-nowrap"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>

            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3" /> Filters:
                </span>
                {search && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                    "{search}"
                    <button onClick={() => setSearch("")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {typeFilter !== "All" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                    {typeFilter}
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
              <h2 className="text-2xl font-bold text-gray-900">Opportunities</h2>
              <p className="text-gray-500 text-sm mt-1">
                {loading ? "Loading..." : `${filtered.length} ${filtered.length === 1 ? "job" : "jobs"} found`}
              </p>
            </div>
          </div>

          {/* Job grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
              <h3 className="text-lg font-bold text-gray-700 mb-2">No jobs found</h3>
              <p className="text-gray-400 text-sm">Try adjusting your filters or search term.</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="mt-4 text-primary font-bold text-sm hover:underline">
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
