"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const issues = [
  { id: 1, title: "April 2024 Issue", year: 2024, image: "/assets/magazine-mockup.png" },
  { id: 2, title: "March 2024 Issue", year: 2024, image: "/assets/magazine-mockup.png" },
  { id: 3, title: "February 2024 Issue", year: 2024, image: "/assets/magazine-mockup.png" },
  { id: 4, title: "January 2024 Issue", year: 2024, image: "/assets/magazine-mockup.png" },
  { id: 5, title: "December 2023 Issue", year: 2023, image: "/assets/magazine-mockup.png" },
  { id: 6, title: "November 2023 Issue", year: 2023, image: "/assets/magazine-mockup.png" },
  { id: 7, title: "October 2023 Issue", year: 2023, image: "/assets/magazine-mockup.png" },
  { id: 8, title: "September 2023 Issue", year: 2023, image: "/assets/magazine-mockup.png" },
];

const MagazineArchives = () => {
  const [activeYear, setActiveYear] = useState('All');
  const years = ['All', 2024, 2023, 2022, 2021];

  const filteredIssues = activeYear === 'All' 
    ? issues 
    : issues.filter(issue => issue.year === activeYear);

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Magazine Archives</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through our collection of past magazine issues. Relive the milestones and stories that shaped our community.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`px-8 py-2.5 rounded-full font-bold transition-all ${
                activeYear === year 
                ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {filteredIssues.map((issue) => (
              <motion.div
                key={issue.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300">
                  <Image 
                    src={issue.image} 
                    alt={issue.title} 
                    fill 
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <button className="w-full py-2 bg-primary text-white font-bold rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      Read Issue
                    </button>
                  </div>
                </div>
                <h4 className="mt-4 font-bold text-gray-900 text-center group-hover:text-primary transition-colors">
                  {issue.title}
                </h4>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-16 text-center">
          <button className="btn-outline">
            Load More Issues
          </button>
        </div>
      </div>
    </section>
  );
};

export default MagazineArchives;
