'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';

const MatrimonialHero = () => {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden pt-12 pb-10 border-b border-gray-100">
      {/* Photo: Sumit Bhatia on Unsplash (unsplash.com/photos/K2JtyCVdeuQ), Unsplash License */}
      <Image
        src="/assets/matrimony-banner.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
      <div className="relative px-4 sm:px-6 md:px-8">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full mb-4">
            {t('SACRED UNIONS', 'पवित्र बंधन')}
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {t('Community', 'सामुदायिक')} <span className="text-primary text-serif italic font-medium">{t('Matrimony', 'वैवाहिक सेवा')}</span>
          </h1>
          <p className="text-lg text-white/85 leading-relaxed">
            {t(
              'Find your soulmate within our trusted community. Bridging traditions with modern preferences for a perfect match.',
              'हमारे भरोसेमंद समाज में ही अपना जीवनसाथी पाएँ। परंपराओं और आधुनिक पसंद का संगम, एक उपयुक्त रिश्ते के लिए।'
            )}
          </p>
        </div>
      </div>
    </section>
  );
};

export default MatrimonialHero;
