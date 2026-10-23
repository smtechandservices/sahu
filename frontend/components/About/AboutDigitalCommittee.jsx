"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const digitalCommittee = [
  { name: "Digvijay Sahu", role: ['Digital Committee Member', 'डिजिटल समिति सदस्य'], image: "/assets/digvijay-cropped.jpeg" },
  { name: "Sanjiv Kumar Shekhar", role: ['Digital Committee Member', 'डिजिटल समिति सदस्य'], image: "/assets/sanjiv.png", position: "object-top" },
  { name: "Vinay Kumar", role: ['Digital Committee Member', 'डिजिटल समिति सदस्य'], image: "/assets/vinay.png" },
  { name: "Bimal Kishore Bittu", role: ['Digital Committee Member', 'डिजिटल समिति सदस्य'], image: "/assets/bimal.png" },
];

const AboutDigitalCommittee = () => {
  const { t } = useLanguage();
  return (
    <section id="about-digital" className="section-padding bg-white">
      <div className="px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('Digital Initiative', 'डिजिटल पहल')}</h2>
          <div className="w-16 h-1 bg-primary mb-4"></div>
          <p className="text-gray-600 text-lg">
            {t(
              'Four dedicated individuals have played an important role in connecting the Sahu community with the digital age and giving new direction to its activities through modern technology.',
              'साहू समाज को डिजिटल युग से जोड़ने और आधुनिक तकनीक के माध्यम से समाज की गतिविधियों को नई दिशा देने में चार समर्पित व्यक्तियों का महत्वपूर्ण योगदान रहा है।'
            )}
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {digitalCommittee.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative aspect-square sm:aspect-[3/4] w-full max-w-sm mx-auto sm:max-w-none overflow-hidden rounded-2xl border border-yellow-200 shadow-sm"
            >
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="(max-width: 640px) 384px, (max-width: 1024px) 50vw, 25vw"
                className={`object-cover ${member.position || ""}`}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 sm:p-4 pt-10">
                <h4 className="text-sm sm:text-lg font-bold text-white leading-tight">{member.name}</h4>
                <p className="text-[#f5b301] text-xs sm:text-sm">{t(...member.role)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutDigitalCommittee;
