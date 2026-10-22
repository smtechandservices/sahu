import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { T } from '../../context/LanguageContext';

export const metadata = {
  title: 'Terms of Service',
  description: 'Understand the terms of service for utilizing the Sahu Sabha platform.',
};

const sections = [
  {
    title: ['1. Acceptance of Terms', '1. शर्तों की स्वीकृति'],
    body: [
      'By accessing or using the Sahu Sabha Digital Heritage platform (website, directories, matrimonials, and career tools), you agree to be bound by these terms. If you do not agree, please do not use our services.',
      'साहू सभा डिजिटल हेरिटेज प्लेटफ़ॉर्म (वेबसाइट, निर्देशिकाएँ, वैवाहिक और करियर सेवाएँ) का उपयोग करके आप इन शर्तों से बंधे होने के लिए सहमत होते हैं। यदि आप सहमत नहीं हैं, तो कृपया हमारी सेवाओं का उपयोग न करें।',
    ],
  },
  {
    title: ['2. Community Guidelines', '2. सामुदायिक दिशानिर्देश'],
    body: [
      'Our services are designed to build, unite, and empower the Sahu Sabha community. You agree to provide accurate registration information, respect other community members, and avoid posting any derogatory or inappropriate material.',
      'हमारी सेवाएँ साहू सभा समाज को जोड़ने, एकजुट करने और सशक्त बनाने के लिए हैं। आप सही पंजीकरण जानकारी देने, समाज के अन्य सदस्यों का सम्मान करने और कोई भी अपमानजनक या अनुचित सामग्री पोस्ट न करने के लिए सहमत होते हैं।',
    ],
  },
  {
    title: ['3. Matrimonial Directory', '3. वैवाहिक निर्देशिका'],
    body: [
      'Matrimonial profiles are strictly for personal matchmaking purposes of our verified members. Commercial exploitation of matrimonial profiles is strictly forbidden. Profiles undergo admin review before going live. Individual profile images of persons are omitted to preserve digital security and focus on background and values.',
      'वैवाहिक प्रोफ़ाइल केवल हमारे सत्यापित सदस्यों के व्यक्तिगत रिश्ते तय करने के उद्देश्य से हैं। वैवाहिक प्रोफ़ाइलों का व्यावसायिक उपयोग सख़्त वर्जित है। प्रकाशित होने से पहले प्रोफ़ाइल की एडमिन द्वारा समीक्षा की जाती है। डिजिटल सुरक्षा बनाए रखने और पृष्ठभूमि व मूल्यों पर ध्यान केंद्रित करने के लिए व्यक्तियों की निजी तस्वीरें नहीं दिखाई जातीं।',
    ],
  },
  {
    title: ['4. Account Security & Session Management', '4. खाता सुरक्षा एवं सत्र प्रबंधन'],
    body: [
      'To prevent unauthorized sharing, active device logins are capped at a maximum of two sessions per account. Any third active session automatically revokes the oldest session.',
      'अनधिकृत साझाकरण रोकने के लिए, प्रत्येक खाते पर अधिकतम दो सक्रिय डिवाइस लॉगिन की अनुमति है। तीसरा सत्र शुरू होते ही सबसे पुराना सत्र अपने-आप समाप्त हो जाता है।',
    ],
  },
  {
    title: ['5. Updates and Modifications', '5. अद्यतन एवं संशोधन'],
    body: [
      'Sahu Sabha reserves the right to modify these terms at any time. We will post notification of modifications on this page. Your continued use of the platform constitutes agreement to the updated terms.',
      'साहू सभा किसी भी समय इन शर्तों में संशोधन का अधिकार सुरक्षित रखती है। संशोधनों की सूचना इसी पृष्ठ पर दी जाएगी। प्लेटफ़ॉर्म का उपयोग जारी रखना अद्यतन शर्तों से आपकी सहमति माना जाएगा।',
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-[#FFFBF7] to-white pb-20">
        {/* Terms Hero */}
        <section className="py-20 text-center relative overflow-hidden bg-gradient-to-br from-primary-light/40 to-transparent">
          <div className="container-custom max-w-4xl mx-auto px-6 relative z-10">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary font-bold rounded-full text-xs uppercase tracking-wider mb-4">
              <T en="Legal" hi="कानूनी" />
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              <T en="Terms of" hi="सेवा की" /> <span className="text-primary"><T en="Service" hi="शर्तें" /></span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              <T
                en="Last updated: May 26, 2026. Please read these terms carefully before using our services."
                hi="अंतिम अद्यतन: 26 मई 2026। हमारी सेवाओं का उपयोग करने से पहले कृपया इन शर्तों को ध्यान से पढ़ें।"
              />
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="mx-auto px-4 sm:px-6 mt-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm space-y-8 text-gray-700">
            {sections.map((section, index) => {
              const last = index === sections.length - 1;
              return (
                <div key={index} className={last ? '' : 'pb-6 border-b border-gray-100'}>
                  <h3 className={`text-lg font-bold text-gray-900 ${last ? 'mb-2' : 'mb-1'}`}>
                    <T en={section.title[0]} hi={section.title[1]} />
                  </h3>
                  <p className="text-sm leading-relaxed">
                    <T en={section.body[0]} hi={section.body[1]} />
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
