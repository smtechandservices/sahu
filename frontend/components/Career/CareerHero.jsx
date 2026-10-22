'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const CareerHero = () => {
  const { t } = useLanguage();
  return (
    <section className="bg-white pt-16 pb-12 border-b border-gray-100">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4">
              {t('GROWTH & OPPORTUNITIES', 'विकास एवं अवसर')}
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              {t('Career Portal', 'करियर पोर्टल')}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t(
                'Empowering our community through job opportunities and business visibility. Find your next role or promote your services to millions of members.',
                'रोज़गार के अवसरों और व्यवसाय की पहचान के माध्यम से समाज का सशक्तिकरण। अपनी अगली नौकरी खोजें या लाखों सदस्यों तक अपनी सेवाएँ पहुँचाएँ।'
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerHero;
