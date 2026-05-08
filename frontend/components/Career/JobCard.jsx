import React from 'react';

const JobCard = ({ job }) => {
  const PinIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const SalaryIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
    </svg>
  );

  const TechIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow relative group">
      {/* Badge */}
      <span 
        className="absolute top-6 right-6 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md"
        style={{ backgroundColor: `${job.badgeColor.bg}`, color: job.badgeColor.text }}
      >
        {job.badge}
      </span>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors pr-24">
          {job.title}
        </h3>
        <p className="text-primary font-bold text-sm mt-1">
          {job.company}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-6 mb-6">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <PinIcon />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          {job.detailIcon === "tech" ? <TechIcon /> : <SalaryIcon />}
          <span>{job.detail}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-50 flex justify-end">
        <button className="btn-outline !py-2 !px-4 text-xs rounded-lg">
          View Details
        </button>
      </div>
    </div>
  );
};

export default JobCard;
