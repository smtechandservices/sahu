"use client";

import { Search } from "lucide-react";

const NewsHero = ({ searchQuery, onSearch }) => {
  return (
    <section className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 py-20">
      <div className="container-custom text-center">
        <span className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase tracking-widest mb-6">
          Latest Updates
        </span>
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
          Community <span className="text-primary">News</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
          Stay informed with the latest announcements, stories, and happenings from the Sahu Sabha community.
        </p>
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-14 pr-5 py-4 rounded-2xl border border-yellow-200 bg-white shadow-sm text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
      </div>
    </section>
  );
};

export default NewsHero;
