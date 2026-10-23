'use client';

import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';

const About = () => {
  const { t } = useLanguage();
  return (
    <section className="section-padding bg-bg-section">
      <div className="px-4 sm:px-6 md:px-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
        <div className="relative">
          <div className="overflow-hidden">
            <Image src="/assets/president.jpg" alt={t('President Ranvijay Sahu', 'अध्यक्ष Ranvijay Sahu')} width={150} height={200} className='w-200' />
          </div>
          <div className='mt-4'>
            <h3 className="text-xl font-bold mb-1">Ranvijay Sahu</h3>
            <p className="text-md opacity-90">{t('President', 'अध्यक्ष')}</p>
          </div>
        </div>

        <div>
          <h2 className="text-4xl mb-6 text-primary-dark font-bold">{t('Message from our President', 'अध्यक्ष की कलम से')}</h2>
          <div className="w-[60px] h-1 bg-primary mb-8"></div>
          <p className="text-xl md:text-2xl leading-loose text-[#564337] mb-10">
            {t('Dear members of our community,', 'प्रिय समाजबंधुओं,')} <br />
            {t(
              'Bihar Tailik Sahu Sabha works tirelessly for the unity, education and development of our community. Our aim is to empower the youth and give society a new direction. Let us all come together to build a bright future for our community. Heartfelt thanks to all of you for your support and trust.',
              'बिहार तैलिक साहू सभा समाज की एकता, शिक्षा एवं विकास के लिए निरंतर कार्यरत है। हमारा उद्देश्य युवाओं को सशक्त बनाकर समाज को नई दिशा देना है। आइए, हम सभी मिलकर समाज के उज्ज्वल भविष्य का निर्माण करें। आप सभी के सहयोग एवं विश्वास के लिए हार्दिक धन्यवाद।'
            )}
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
