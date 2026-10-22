'use client';

import React from 'react';
import { Phone, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const BOOKING_NUMBERS = ['933483749', '6207736362', '9507164127'];

const AccommodationHero = () => {
  const { t } = useLanguage();
  return (
    <section className="bg-white pt-12 pb-10 border-b border-gray-100">
      <div className="px-4 sm:px-6 md:px-8">
        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4">
          {t('FACILITIES & STAYS', 'सुविधाएँ एवं आवास')}
        </span>
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {t('Check Availability', 'उपलब्धता देखें')}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
          {t(
            'Access well-maintained facilities provided by the Sabha for our members. Reserve community halls for events, book comfortable hostel stays for students, or find temporary room accommodations.',
            'सभा द्वारा अपने सदस्यों के लिए उपलब्ध सुव्यवस्थित सुविधाओं का लाभ उठाएँ। कार्यक्रमों के लिए सामुदायिक भवन आरक्षित करें, छात्रों के लिए आरामदायक छात्रावास बुक करें, या अस्थायी कमरे की व्यवस्था पाएँ।'
          )}
        </p>

        <div className="mt-6 inline-flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 px-4 py-3 bg-primary/10 border border-primary/20 rounded-xl text-gray-800">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm sm:text-base">
            <Phone className="w-4 h-4 text-primary shrink-0" />
            {t('For Booking:', 'बुकिंग के लिए:')}
            {BOOKING_NUMBERS.map((number, index) => (
              <span key={number}>
                <a href={`tel:+91${number}`} className="font-semibold text-gray-900 hover:text-primary">
                  {number}
                </a>
                {index < BOOKING_NUMBERS.length - 1 && ','}
              </span>
            ))}
          </p>
          <p className="flex items-center gap-2 text-sm sm:text-base">
            <Clock className="w-4 h-4 text-primary shrink-0" />
            {t('Timing:', 'समय:')} <span className="font-semibold text-gray-900">{t('10am – 5pm', 'सुबह 10 – शाम 5')}</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AccommodationHero;
