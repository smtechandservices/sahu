'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const tiers = [
  { id: 1, amount: 500, label: ["Supports a student's books for a month", 'एक छात्र की एक महीने की किताबों का खर्च'] },
  { id: 2, amount: 2000, label: ['Contributes to hostel maintenance', 'छात्रावास के रख-रखाव में योगदान'], popular: true },
  { id: 3, amount: 5000, label: ['Funds a partial scholarship', 'आंशिक छात्रवृत्ति का खर्च'] },
  { id: 4, amount: "Custom", label: ['Custom Amount', 'अपनी राशि'], isCustom: true },
];

const DonateTiers = ({ selectedAmount, onSelect }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm mb-10">
      <h2 className="text-2xl font-bold text-primary mb-8">
        {t('Swayam-Seva (Contribution Tiers)', 'स्वयं-सेवा (योगदान श्रेणियाँ)')}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((tier) => {
          const isSelected = selectedAmount === tier.amount || (selectedAmount === null && tier.popular);
          
          return (
            <button
              key={tier.id}
              onClick={() => onSelect(tier.amount)}
              className={`
                relative flex flex-col items-center justify-center p-6 rounded-lg transition-all duration-300 min-h-[160px] text-center group
                ${isSelected 
                  ? 'bg-[#B8860B] text-white shadow-lg scale-105 z-10' 
                  : 'bg-gray-50 text-gray-900 border border-gray-100 hover:border-primary/30 hover:bg-gray-100'}
              `}
            >
              {tier.popular && (
                <div className={`
                  absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest
                  ${isSelected ? 'bg-white/20 text-white' : 'bg-primary text-white shadow-sm'}
                `}>
                  {t('Popular', 'लोकप्रिय')}
                </div>
              )}

              {tier.isCustom ? (
                <>
                  <div className={`mb-3 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold">{t(...tier.label)}</p>
                </>
              ) : (
                <>
                  <h3 className="text-3xl font-black mb-2">
                    ₹{tier.amount.toLocaleString()}
                  </h3>
                  <p className={`text-[11px] leading-snug px-2 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                    {t(...tier.label)}
                  </p>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DonateTiers;
