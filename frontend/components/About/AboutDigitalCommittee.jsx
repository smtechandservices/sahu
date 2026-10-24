"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const digitalCommittee = [
  { name: "Digvijay Sahu", role: ['Digital Committee Member', 'डिजिटल समिति सदस्य'], image: "/assets/digvijay-cropped.jpeg" },
  { name: "Sanjiv Kumar Shekhar", role: ['Digital Committee Member', 'डिजिटल समिति सदस्य'], image: "/assets/sanjiv.png", position: "object-top" },
  { name: "Vinay Kumar", role: ['Digital Committee Member', 'डिजिटल समिति सदस्य'], image: "/assets/vinay.png" },
  { name: "Bimal Kishore Bittu", role: ['Digital Committee Member', 'डिजिटल समिति सदस्य'], image: "/assets/bimal-square.jpg" },
];

// The initiative was the President's; the committee's work was carried out under his leadership
const initiator = {
  name: ['Shri Ranvijay Sahu', 'श्री रण विजय साहू'],
  role: ['President', 'अध्यक्ष'],
  image: "/assets/president.jpg",
};

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
              'At the initiative of President Shri Ranvijay Sahu, and under his leadership, four dedicated individuals have played an important role in connecting the Sahu community with the digital age and giving new direction to its activities through modern technology.',
              'अध्यक्ष श्री रण विजय साहू की पहल पर और उनके नेतृत्व में, चार समर्पित व्यक्तियों ने साहू समाज को डिजिटल युग से जोड़ने और आधुनिक तकनीक के माध्यम से समाज की गतिविधियों को नई दिशा देने में महत्वपूर्ण योगदान दिया है।'
            )}
          </p>
        </motion.div>

        {/* Initiator large on the left, the four members smaller beside him */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative aspect-square lg:aspect-auto w-full overflow-hidden rounded-2xl border border-yellow-200 shadow-sm"
          >
            <Image
              src={initiator.image}
              alt={t(...initiator.name)}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-5 sm:p-8 pt-20">
              <p className="text-[#f5b301] font-bold text-xs uppercase tracking-widest mb-1">
                {t('Initiative & Leadership', 'पहल एवं नेतृत्व')}
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{t(...initiator.name)}</h3>
              <p className="text-white/80 text-sm sm:text-base font-semibold mt-0.5">{t(...initiator.role)}</p>
              <p className="text-white/85 text-sm sm:text-base mt-2 leading-relaxed max-w-lg">
                {t(
                  'The Digital Initiative was his vision, and all of this work has been carried out under his guidance.',
                  'डिजिटल पहल उन्हीं की सोच है, और यह सारा कार्य उनके मार्गदर्शन में संपन्न हुआ है।'
                )}
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {digitalCommittee.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative aspect-square w-full overflow-hidden rounded-2xl border border-yellow-200 shadow-sm"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className={`object-cover ${member.position || "object-top"}`}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 sm:p-4 pt-10">
                  <h4 className="text-sm sm:text-base font-bold text-white leading-tight">{member.name}</h4>
                  <p className="text-[#f5b301] text-xs sm:text-sm">{t(...member.role)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutDigitalCommittee;
