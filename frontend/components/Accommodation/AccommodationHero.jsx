import React from 'react';

const AccommodationHero = () => {
  return (
    <section className="bg-white pt-12 pb-10 border-b border-gray-100">
      <div className="px-4 sm:px-6 md:px-8">
        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4">
          FACILITIES & STAYS
        </span>
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Community Services Hub
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
          Access well-maintained facilities provided by the Sabha for our members. 
          Reserve community halls for events, book comfortable hostel stays for students, 
          or find temporary room accommodations.
        </p>
      </div>
    </section>
  );
};

export default AccommodationHero;
