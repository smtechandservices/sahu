import React from 'react';
import { MapPin, Briefcase, ExternalLink } from 'lucide-react';

const TYPE_COLORS = {
  "Full-time":  { bg: "#DBEAFE", text: "#1E40AF" },
  "Part-time":  { bg: "#FEF3C7", text: "#92400E" },
  "Contract":   { bg: "#FCE7F3", text: "#9D174D" },
  "Remote":     { bg: "#D1FAE5", text: "#065F46" },
};

const JobCard = ({ job }) => {
  const color = TYPE_COLORS[job.type] || { bg: "#F3F4F6", text: "#374151" };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-200 relative group flex flex-col">
      {/* Type badge */}
      <span
        className="absolute top-5 right-5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md"
        style={{ backgroundColor: color.bg, color: color.text }}
      >
        {job.type}
      </span>

      <div className="mb-4 pr-20">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug">
          {job.title}
        </h3>
        <p className="text-primary font-bold text-sm mt-1">{job.company}</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        {job.location && (
          <div className="flex items-center gap-1.5 text-gray-500 text-sm">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{job.location}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
          <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{job.type}</span>
        </div>
      </div>

      {job.description && (
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
          {job.description}
        </p>
      )}

      <div className="pt-4 border-t border-gray-100 mt-auto">
        {job.apply_link ? (
          <a
            href={job.apply_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
          >
            Apply Now <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <span className="text-xs text-gray-400 font-medium">No application link provided</span>
        )}
      </div>
    </div>
  );
};

export default JobCard;
