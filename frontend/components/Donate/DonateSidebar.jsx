'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const DonateSidebar = () => {
  const { t } = useLanguage();
  return (
    <aside className="space-y-8">
      {/* Fund Allocation Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full" />
          {t('Fund Allocation', 'कोष आवंटन')}
        </h2>
        <div className="space-y-6">
          <AllocationItem label={t('Education & Scholarships', 'शिक्षा एवं छात्रवृत्ति')} percentage={60} color="bg-primary" />
          <AllocationItem label={t('Hostel Maintenance', 'छात्रावास रख-रखाव')} percentage={25} color="bg-blue-500" />
          <AllocationItem label={t('Community Events', 'सामुदायिक कार्यक्रम')} percentage={15} color="bg-green-500" />
        </div>
        <p className="text-xs text-gray-400 mt-8 leading-relaxed">
          {t('* Our allocation is audited quarterly by the Sabha board to ensure 100% transparency.', '* 100% पारदर्शिता सुनिश्चित करने के लिए सभा बोर्ड द्वारा हर तिमाही आवंटन का ऑडिट किया जाता है।')}
        </p>
      </div>

      {/* Impact Stats Section */}
      <div className="bg-gray-900 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl" />

        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
          <span className="w-1.5 h-6 bg-primary rounded-full" />
          {t('Our Impact', 'हमारा प्रभाव')}
        </h2>

        <div className="space-y-4 relative z-10">
          {[
            { stat: '2,400+', label: t('Students Supported', 'छात्रों को सहायता') },
            { stat: '₹1.2 Cr+', label: t('Scholarships Awarded', 'छात्रवृत्ति प्रदान') },
            { stat: '18',      label: t('Community Events Held', 'सामुदायिक कार्यक्रम आयोजित') },
            { stat: '6',       label: t('Hostels Maintained', 'छात्रावासों का रख-रखाव') },
          ].map(item => (
            <div
              key={item.stat}
              className="flex items-center justify-between py-2.5 border-b border-white/10 last:border-0"
            >
              <span className="text-sm text-gray-300">{item.label}</span>
              <span className="text-lg font-black text-primary">{item.stat}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

const AllocationItem = ({ label, percentage, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      <span className="font-bold text-gray-900">{percentage}%</span>
    </div>
    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full transition-all duration-1000`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

export default DonateSidebar;
