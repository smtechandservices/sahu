import React from 'react';
import { Phone, Clock } from 'lucide-react';

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

        <div className="mt-6 inline-flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 px-4 py-3 bg-primary/10 border border-primary/20 rounded-xl text-gray-800">
          <p className="flex items-center gap-2 text-sm sm:text-base">
            <Phone className="w-4 h-4 text-primary shrink-0" />
            Please contact for booking on{' '}
            <a href="tel:+916122303994" className="font-semibold text-gray-900 hover:text-primary">
              6122303994
            </a>
          </p>
          <p className="flex items-center gap-2 text-sm sm:text-base">
            <Clock className="w-4 h-4 text-primary shrink-0" />
            Timing: <span className="font-semibold text-gray-900">10am – 5pm</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AccommodationHero;
