'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const DonateHero = () => {
  const { t } = useLanguage();
  return (
    <section className="bg-white pt-16 pb-12 border-b border-gray-100 text-center">
      <div className="container-custom">
        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
          {t('Support & Giving', 'सहयोग एवं दान')}
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight max-w-4xl mx-auto">
          {t("Support Our Community's", 'अपने समाज के')} <span className="text-primary italic">{t('Future', 'भविष्य')}</span>{t('', ' में सहयोग करें')}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {t('Empowering the Sahu community through collective giving. Your contribution, big or small, helps preserve our heritage and build a stronger, educated future for our youth.', 'सामूहिक दान के माध्यम से साहू समाज का सशक्तिकरण। आपका योगदान, छोटा हो या बड़ा, हमारी विरासत को सँजोने और हमारे युवाओं के लिए एक सशक्त, शिक्षित भविष्य बनाने में मदद करता है।')}
        </p>
      </div>
    </section>
  );
};

export default DonateHero;
