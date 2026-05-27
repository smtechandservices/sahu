import React from 'react';

const DonateHero = () => {
  return (
    <section className="bg-white pt-16 pb-12 border-b border-gray-100 text-center">
      <div className="container-custom">
        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
          Support & Giving
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight max-w-4xl mx-auto">
          Support Our Community's <span className="text-primary italic">Future</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Empowering the Sahu community through collective giving. Your contribution, big or small, helps preserve our heritage and build a stronger, educated future for our youth.
        </p>
      </div>
    </section>
  );
};

export default DonateHero;
