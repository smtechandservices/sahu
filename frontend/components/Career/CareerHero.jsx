import React from 'react';

const CareerHero = () => {
  return (
    <section className="bg-white pt-16 pb-12 border-b border-gray-100">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4">
              GROWTH & OPPORTUNITIES
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Community <span className="text-primary">Career Portal</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Empowering our community through job opportunities and business visibility. 
              Find your next role or promote your services to millions of members.
            </p>
          </div>
          
          <button className="btn-primary rounded-lg flex items-center gap-2 shadow-lg shadow-primary/20 whitespace-nowrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Post Opportunity
          </button>
        </div>
      </div>
    </section>
  );
};

export default CareerHero;
