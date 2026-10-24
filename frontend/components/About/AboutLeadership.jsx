"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const president = {
  name: "Ranvijay Sahu",
  role: ['President', 'अध्यक्ष'],
  image: "/assets/president.jpg",
  bio: ['Dedicated to community welfare, leading with vision and integrity.', 'दूरदृष्टि और ईमानदारी के साथ नेतृत्व करते हुए समाज कल्याण के लिए समर्पित।']
};

// From the Sabha's board "अध्यक्ष के कार्यकाल की सूची"
const pastPresidents = [
  { name: ['Shri Ganauri Sah', 'श्री गनौरी साह'], place: ['Munger', 'मुंगेर'], term: '1964–67' },
  { name: ['Shri Yamuna Pr. Sah', 'श्री यमुना प्र. साह'], place: ['Ranchi', 'राँची'], term: '1967–70' },
  { name: ['Shri Ram Lakhan Gupta (Advocate, MLC)', 'श्री राम लखन गुप्ता (एडवोकेट, एम.एल.सी.)'], place: ['Munger', 'मुंगेर'], term: '1970–73' },
  { name: ['Shri Ram Nath Gupta', 'श्री राम नाथ गुप्ता'], place: ['Mahnar (Vaishali)', 'महनार (वैशाली)'], term: '1973–76' },
  { name: ['Smt. Saroj Devi', 'श्रीमती सरोज देवी'], place: ['Bhagalpur', 'भागलपुर'], term: '1977–78' },
  { name: ['Dr. Brijraj Prasad', 'डॉ. बृजराज प्रसाद'], place: ['Daltonganj (Palamu)', 'डालटेनगंज (पलामू)'], term: '1979–80' },
  { name: ['Er. Jang Bahadur Sah', 'ई. जंग बहादुर साह'], place: ['Patna', 'पटना'], term: '1980–81' },
  { name: ['Shri Ram Swaroop Sah', 'श्री राम स्वरूप साह'], place: ['Giridih', 'गिरिडीह'], term: '1981–83' },
  { name: ['Shri Jagdish Prasad', 'श्री जगदीश प्रसाद'], place: ['Patna', 'पटना'], term: '1983–88' },
  { name: ['Er. Ram Vilas Sah', 'ई. राम विलास साह'], place: ['Patna', 'पटना'], term: '1988–91' },
  { name: ['Er. Ram Vilas Sah', 'ई. राम विलास साह'], place: ['Patna', 'पटना'], term: '1991–94' },
  { name: ['Shri Mangal Sah', 'श्री मंगल साह'], place: ['Patna', 'पटना'], term: '1994–95' },
  { name: ['Shri Ramdev Sah (MLC)', 'श्री रामदेव साह (एम.एल.सी.)'], place: ['Patna', 'पटना'], term: '1995–2004' },
  { name: ['Shri Shivanandan Pr. (IRS)', 'श्री शिवनन्दन प्र. (आई.आर.एस.)'], place: ['Nawada', 'नवादा'], term: '2005–2009' },
  { name: ['Dr. C. N. Gupta (Retd. Civil Surgeon)', 'डॉ. सी. एन. गुप्ता (अ.प्रा. सिविल सर्जन)'], place: ['Muzaffarpur-Saran', 'मुज़फ़्फ़रपुर-सारण'], term: '2009–2013' },
  { name: ['Er. Krishna Prasad', 'ई. कृष्णा प्रसाद'], place: ['Patna', 'पटना'], term: '2013–2016' },
  { name: ['Dr. Prem Ku. Gupta (Acting President)', 'डॉ. प्रेम कु. गुप्ता (का. अध्यक्ष)'], place: ['Patna', 'पटना'], term: '2016–10.6.18' },
  { name: ['Shri Ranvijay Sahu', 'श्री रण विजय साहू'], place: ['Samastipur', 'समस्तीपुर'], term: '11.6.18–29.6.23' },
  { name: ['Shri Ranvijay Sahu', 'श्री रण विजय साहू'], place: ['Samastipur', 'समस्तीपुर'], term: '29.6.23–', current: true },
];

const mahilaPresident = {
  name: "Simmy Prasad",
  role: ['Mahila Adhyaksh', 'महिला अध्यक्ष'],
  image: "/assets/simmi-prasad.jpg",
};

// From the Sabha's board "महिला अध्यक्ष के कार्यकाल की सूची"
const pastMahilaPresidents = [
  { name: ['Smt. Savitri Devi', 'श्रीमती सावित्री देवी'], place: ['Chhapra', 'छपरा'], term: '1983–1989' },
  { name: ['Smt. Renu Priyadarshini', 'श्रीमती रेणु प्रियदर्शिनी'], place: ['Patna', 'पटना'], term: '1989–1992' },
  { name: ['Prof. Dr. Kiran Aryani Mishra', 'प्रो. डॉ. किरण आर्यणी मिश्रा'], place: ['Patna', 'पटना'], term: '1992–1995' },
  { name: ['Smt. Gayatri Gupta', 'श्रीमती गायत्री गुप्ता'], place: ['Patna', 'पटना'], term: '1995–2001' },
  { name: ['Smt. Gayatri Gupta', 'श्रीमती गायत्री गुप्ता'], place: ['Patna', 'पटना'], term: '2001–2005' },
  { name: ['Ms. Sushma Sahu', 'सुश्री सुषमा साहू'], place: ['Patna', 'पटना'], term: '2005–2007' },
  { name: ['Dr. Shanti Brahmachari', 'डॉ. शांति ब्रह्मचारी'], place: ['Patna', 'पटना'], term: '2007–2009' },
  { name: ['Smt. Manju Gupta', 'श्रीमती मंजू गुप्ता'], place: ['Chhapra', 'छपरा'], term: '2009–2013' },
  { name: ['Smt. Kanchan Gupta', 'श्रीमती कंचन गुप्ता'], place: ['Patna', 'पटना'], term: '2013–2018' },
  { name: ['Dr. Madhuri Gupta', 'डॉ. माधुरी गुप्ता'], place: ['Patna', 'पटना'], term: '2018–2023' },
  { name: ['Smt. Simmy Prasad', 'श्रीमती सिम्मी प्रसाद'], place: ['Patna', 'पटना'], term: '2023–', current: true },
];

const AboutLeadership = () => {
  const { t } = useLanguage();

  return (
    <section id="about-leadership" className="section-padding bg-white">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('Leadership Team', 'नेतृत्व दल')}</h2>
          <p className="text-base sm:text-lg md:text-xl text-[#564337] mx-auto">
            {t('Meet the dedicated individuals who volunteer their time and expertise to lead Sahu Sabha.', 'उन समर्पित व्यक्तियों से मिलिए जो साहू सभा के नेतृत्व के लिए अपना समय और अनुभव स्वेच्छा से देते हैं।')}
          </p>
        </div>

        <LeadershipRow
          person={president}
          tenureLabel={t("Presidents' Tenure", 'अध्यक्ष के कार्यकाल की सूची')}
          terms={pastPresidents}
        />

        <div className="border-t border-yellow-200 mt-16 pt-16">
          <LeadershipRow
            person={mahilaPresident}
            tenureLabel={t("Mahila Presidents' Tenure", 'महिला अध्यक्ष के कार्यकाल की सूची')}
            terms={pastMahilaPresidents}
          />
        </div>
      </div>
    </section>
  );
};

// Current office-holder's photo card (1/3) beside the tenure list (2/3)
function LeadershipRow({ person, tenureLabel, terms }) {
  const { t } = useLanguage();
  const tableRef = useRef(null);

  // Earlier terms scroll; the current term stays pinned at the bottom of the table
  const earlierTerms = terms.filter((p) => !p.current);
  const currentTerm = terms.find((p) => p.current);

  // Open the tenure list scrolled to the most recent terms
  useEffect(() => {
    if (tableRef.current) tableRef.current.scrollTop = tableRef.current.scrollHeight;
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-0">
      {/* Photo card: 1/3 width; its height sets the row height */}
      <div className="w-full max-w-sm mx-auto lg:max-w-none lg:pr-8">
        <div>
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">{t(...person.role)}</p>
          <div className="h-1 w-16 bg-[#f5b301] rounded-full mb-6" />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative aspect-square w-full overflow-hidden rounded-2xl border border-yellow-200 shadow-sm"
          >
            <Image
              src={person.image}
              alt={person.name}
              fill
              sizes="(max-width: 1024px) 384px, 33vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/60 to-transparent p-4 sm:p-5 pt-16">
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">{person.name}</h3>
              <p className="text-[#f5b301] text-sm mb-2">{t(...person.role)}</p>
              {person.bio && <p className="text-white/85 text-sm leading-relaxed">{t(...person.bio)}</p>}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tenure list: 2/3 width, capped to the photo card's height and scrolls inside */}
      {/* divider: top border when stacked, left border on desktop */}
      <div className="lg:col-span-2 border-t border-yellow-200 pt-10 lg:border-t-0 lg:pt-0 lg:border-l lg:relative">
        <div className="flex flex-col lg:absolute lg:inset-0 lg:pl-8">
        <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">{tenureLabel}</p>
        <div className="h-1 w-16 bg-[#f5b301] rounded-full mb-6" />
        <div ref={tableRef} className="max-h-[28rem] lg:max-h-none lg:flex-1 lg:min-h-0 overflow-auto rounded-2xl border border-yellow-200 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="sticky top-0 z-10 bg-[#FFFBF7] text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr className="h-11">
                <th className="px-4 py-3 w-12">{t('No.', 'क्र.सं.')}</th>
                <th className="px-4 py-3">{t('Name', 'नाम')}</th>
                <th className="px-4 py-3">{t('Place', 'स्थान')}</th>
                <th className="px-4 py-3 whitespace-nowrap">{t('Tenure', 'अवधि')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-yellow-100">
              {earlierTerms.map((p, index) => (
                <tr key={index} className="hover:bg-[#FFFBF7] transition-colors">
                  <td className="px-4 py-2.5 text-gray-400 font-semibold">{index + 1}</td>
                  <td className="px-4 py-2.5 font-semibold text-gray-900">{t(...p.name)}</td>
                  <td className="px-4 py-2.5 text-gray-600">{t(...p.place)}</td>
                  <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{p.term}</td>
                </tr>
              ))}
            </tbody>
            {/* Solid background so scrolled rows don't show through */}
            <tfoot className="sticky bottom-0 z-10 bg-[#FDF7E6] border-t-2 border-primary/30 text-base">
              <tr className="h-24">
                <td className="px-4 py-2.5 text-gray-400 font-semibold">{earlierTerms.length + 1}</td>
                <td className="px-4 py-2.5 text-lg font-bold text-gray-900">{t(...currentTerm.name)}</td>
                <td className="px-4 py-2.5 text-gray-600">{t(...currentTerm.place)}</td>
                <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">
                  {currentTerm.term}
                  <span className="ml-2 text-[10px] font-bold uppercase bg-primary text-white px-2 py-0.5 rounded-full">
                    {t('Present', 'वर्तमान')}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
}

export default AboutLeadership;
