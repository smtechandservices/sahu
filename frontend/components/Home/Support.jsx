"use client";

import { HandHeart } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';

const Support = () => {
  const router = useRouter();
  const { t } = useLanguage();

  const handleContribute = () => router.push('/donate');

  return (
    <section className="pb-8 bg-white">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="bg-[#f5b301] rounded-xl p-6 sm:p-10 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <div className="max-w-2xl text-left">
            <h2 className="text-[#502600] text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 leading-tight">
              {t('Support Our Community Initiatives', 'समाज की पहलों में सहयोग करें')}
            </h2>
            <p className="text-[#502600] text-base sm:text-lg lg:text-xl leading-relaxed font-medium">
              {t('Your contributions help fund educational scholarships, maintain our hostels, and organize welfare camps. Together, we can build a stronger, more resilient heritage.', 'आपका योगदान शैक्षिक छात्रवृत्ति, हमारे छात्रावासों के रख-रखाव और कल्याण शिविरों के आयोजन में मदद करता है। आइए, मिलकर अपनी विरासत को और सशक्त बनाएँ।')}
            </p>
          </div>

          <div className="shrink-0 w-full lg:w-auto text-center">
            <button
              onClick={handleContribute}
              className={`cursor-pointer w-full lg:w-auto bg-[#c08200] hover:bg-[#a06c00] text-white px-8 py-4 sm:px-12 sm:py-6 rounded-lg font-bold flex items-center justify-center gap-3 sm:gap-4 transition-all shadow-lg group`}
            >
              <HandHeart className="group-hover:scale-110 transition-transform" size={24} />
              <span className="text-lg sm:text-xl">{t('Contribute Now', 'अभी योगदान करें')}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;
