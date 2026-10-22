"use client";

import { motion } from 'framer-motion';
import { BedDouble, DoorOpen, Library } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const facilities = [
  {
    icon: BedDouble,
    value: '108',
    title: ['Bed Hostel', 'बिस्तरों वाला छात्रावास'],
    description: [
      'For the accommodation and academic needs of students.',
      'विद्यार्थियों के आवास एवं शैक्षणिक आवश्यकताओं के लिए।',
    ],
  },
  {
    icon: DoorOpen,
    value: '9',
    title: ['Guest Rooms', 'अतिथि कक्ष'],
    description: [
      'For community members and visitors to stay.',
      'समाज के सदस्यों एवं आगंतुकों के ठहरने के लिए।',
    ],
  },
  {
    icon: Library,
    value: '35',
    title: ['Cabin Study Library', 'केबिनयुक्त अध्ययन पुस्तकालय'],
    description: [
      'For students and candidates preparing for competitive exams.',
      'विद्यार्थियों एवं प्रतियोगी परीक्षाओं की तैयारी करने वाले अभ्यर्थियों के लिए।',
    ],
  },
];

const AboutHistory = () => {
  const { t } = useLanguage();

  return (
    <section id="about-history" className="section-padding bg-[#FFFBF7]">
      <div className="px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-primary font-bold tracking-widest text-sm uppercase mb-3 block">
            {t('Our Heritage', 'हमारी विरासत')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('The Glorious History of the Sahu Community', 'साहू समाज का गौरवशाली इतिहास')}
          </h2>
          <div className="w-16 h-1 bg-primary mb-8"></div>
          <div className="space-y-5 text-base sm:text-lg text-[#564337] leading-relaxed text-justify">
            <p>
              {t(
                'The history of the Sahu community is a symbol of a proud tradition of social unity, education, hard work and the spirit of service. The visionary personalities and dedicated members of the community have always given priority to organisation and collective development.',
                'साहू समाज का इतिहास सामाजिक एकता, शिक्षा, परिश्रम और सेवा भावना की गौरवशाली परंपरा का प्रतीक है। समाज के दूरदर्शी व्यक्तित्वों एवं समर्पित सदस्यों ने सदैव संगठन और सामूहिक विकास को प्राथमिकता दी है।'
              )}
            </p>
            <p>
              {t(
                'Many distinguished individuals have contributed to the development of the Sahu Samaj Bhawan in Patna. Around 1973, Shri Shivanandan Prasad (IRS) played an important role in the efforts to uplift the Sahu community and build its organisation. In 1985, during the tenure of the late Jagdish Prasad, important steps were taken towards constructing the building. During 1998–2000, construction work was carried forward under the leadership of the late Ramdev Sahu. In 2005, efforts to develop the building moved ahead again under the leadership of Shri Shivanandan Prasad. Many social workers and supporters contributed along this journey.',
                'पटना स्थित साहू समाज भवन के विकास की यात्रा में अनेक गणमान्य व्यक्तियों का योगदान रहा है। वर्ष 1973 के आसपास साहू समाज के उत्थान और संगठन निर्माण के प्रयासों में श्री शिवनंदन प्रसाद (IRS) की महत्वपूर्ण भूमिका रही। वर्ष 1985 में स्वर्गीय जगदीश प्रसाद के कार्यकाल में भवन निर्माण की दिशा में महत्वपूर्ण प्रयास हुए। वर्ष 1998–2000 के दौरान स्वर्गीय रामदेव साहू के नेतृत्व में निर्माण कार्य को आगे बढ़ाया गया। वर्ष 2005 में श्री शिवनन्दन प्रसाद के नेतृत्व में भवन के विकास के प्रयास पुनः आगे बढ़े। इस यात्रा में अनेक समाजसेवियों और सहयोगियों का योगदान रहा।'
              )}
            </p>
          </div>
        </motion.div>

        {/* Current facilities */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('Current Facilities', 'वर्तमान सुविधाएँ')}</h3>
        <p className="text-[#564337] mb-6">
          {t(
            'Today the Sahu community provides the following facilities for its members and students:',
            'आज साहू समाज अपने सदस्यों एवं विद्यार्थियों के लिए निम्नलिखित सुविधाएँ उपलब्ध करा रहा है:'
          )}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {facilities.map(({ icon: Icon, value, title, description }, index) => (
            <motion.div
              key={value}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border border-yellow-200 rounded-xl p-6 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Icon size={24} />
              </div>
              <p className="text-gray-900 mb-2">
                <span className="text-3xl font-bold text-primary mr-2">{value}</span>
                <span className="text-lg font-bold">{t(...title)}</span>
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">{t(...description)}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-base sm:text-lg text-[#564337] leading-relaxed mb-8">
          {t(
            'The aim of the Sahu community is to promote education, empower the youth, strengthen social unity and provide better opportunities for future generations.',
            'साहू समाज का उद्देश्य शिक्षा को बढ़ावा देना, युवाओं को सशक्त बनाना, सामाजिक एकता को मजबूत करना और भावी पीढ़ियों के लिए बेहतर अवसर उपलब्ध कराना है।'
          )}
        </p>

        <blockquote className="border-l-4 border-primary bg-white rounded-r-xl px-6 py-5 text-lg sm:text-xl font-semibold text-primary-dark leading-relaxed shadow-sm">
          {t(
            'Our heritage is our pride, our unity is our strength, and the all-round development of the community is our resolve.',
            'हमारी विरासत हमारा गौरव है, हमारी एकता हमारी शक्ति है और समाज का सर्वांगीण विकास हमारा संकल्प है।'
          )}
        </blockquote>
      </div>
    </section>
  );
};

export default AboutHistory;
