'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const figures = [
  {
    name: { en: 'Daanveer Bhamashah', hi: 'दानवीर भामाशाह' },
    title: { en: 'Symbol of Generosity', hi: 'उदारता के प्रतीक' },
    image: '/assets/figures/bhamashah.jpeg',
    description: {
      hi: 'भामाशाह मेवाड़ राज्य के एक महान मंत्री और दानवीर थे, जिन्होंने महाराणा प्रताप को स्वाधीनता संग्राम के लिए अपनी संपूर्ण व्यक्तिगत संपदा दान कर दी। उनका यह निःस्वार्थ बलिदान साहू समाज के लिए उदारता और देशभक्ति का चिरस्थायी प्रतीक बन गया।',
      en: 'Bhamashah was a great minister and philanthropist of the Mewar kingdom, who donated his entire personal wealth to Maharana Pratap to fund the struggle for independence. His selfless sacrifice became an eternal symbol of generosity and patriotism for the Sahu community.',
    },
  },
  {
    name: { en: 'Baba Badal Nayak', hi: 'बाबा बादल नायक' },
    title: { en: 'Legendary Leader', hi: 'महान नायक' },
    image: '/assets/figures/badal_nayak.jpeg',
    description: {
      hi: 'बाबा बादल नायक एक पूजनीय आध्यात्मिक एवं सामुदायिक नेता थे, जिन्होंने कठिन परिस्थितियों में साहू समाज का मार्गदर्शन किया। उनकी बुद्धिमत्ता, साहस और न्याय के प्रति अटूट समर्पण ने उन्हें एक महान विभूति बनाया, जिनकी शिक्षाएँ आज भी पीढ़ियों को प्रेरित करती हैं।',
      en: 'Baba Badal Nayak was a revered spiritual and community leader who guided the Sahu community through difficult times. His wisdom, courage, and unwavering dedication to justice made him a great figure whose teachings continue to inspire generations even today.',
    },
  },
  {
    name: { en: 'Maa Karma', hi: 'माँ कर्मा' },
    title: { en: 'Sant Shiromani', hi: 'संत शिरोमणि' },
    image: '/assets/figures/maa_karma.jpeg',
    description: {
      hi: 'माँ कर्मा को एक परम संत और करमा पर्व की अधिष्ठात्री देवी के रूप में पूजा जाता है। उनकी भक्ति, करुणा और आध्यात्मिक शिक्षाएँ समाज के लिए सदैव प्रकाशस्तंभ रही हैं, जो आस्था, त्याग और समस्त प्राणियों के प्रति प्रेम के मूल्यों का मूर्त स्वरूप हैं।',
      en: 'Maa Karma is venerated as a supreme saint and the presiding deity of the Karma festival. Her devotion, compassion, and spiritual teachings have always served as a guiding light for the community, embodying the values of faith, sacrifice, and love for all living beings.',
    },
  },
];

const Inspirational = () => {
  const [flipped, setFlipped] = useState(null);
  const { lang, t } = useLanguage();

  const handleFlip = (index) => {
    setFlipped(flipped === index ? null : index);
  };

  return (
    <section className="section-padding bg-white">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{t('Inspirational Figures', 'प्रेरणादायी विभूतियाँ')}</h2>
          <p className="text-base sm:text-lg md:text-xl text-[#564337] mb-0">{t("community's pride and eternal guiding lights", 'समाज का गौरव और शाश्वत पथप्रदर्शक')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {figures.map((figure, index) => (
            <div
              key={index}
              className="cursor-pointer h-[560px]"
              style={{ perspective: '1000px' }}
              onClick={() => handleFlip(index)}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s ease',
                  transform: flipped === index ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Front */}
                <div
                  style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                  className="absolute inset-0 bg-[#FFFBF7] overflow-hidden shadow-base hover:-translate-y-2 hover:shadow-md transition-all duration-300"
                >
                  <div className="relative h-[620px] w-full">
                    <Image
                      src={figure.image}
                      alt={figure.name[lang]}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{figure.name[lang]}</h3>
                    <p className="text-sm font-medium text-primary-dark uppercase tracking-wider">{figure.title[lang]}</p>
                  </div>
                </div>

                {/* Back */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                  className="absolute inset-0 bg-[#5C3D2E] overflow-hidden shadow-base flex flex-col items-center justify-center p-10 text-center"
                >
                  <h3 className="text-2xl font-bold text-white mb-2">{figure.name[lang]}</h3>
                  <p className="text-sm font-semibold text-amber-300 uppercase tracking-widest mb-6">{figure.title[lang]}</p>
                  <p className={`text-white/90 text-base leading-loose tracking-wide ${lang === 'hi' ? '' : 'text-sm'}`}>
                    {figure.description[lang]}
                  </p>
                  <p className="mt-8 text-white/40 text-xs">{t('Click to flip back', 'वापस पलटने के लिए क्लिक करें')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Inspirational;
