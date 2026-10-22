import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { T } from '../../context/LanguageContext';

export const metadata = {
  title: 'Advertisement Policy',
  description: 'Understand the advertisement and sponsorship policy of Sahu Sabha Digital Heritage.',
};

const sections = [
  {
    title: ['1. Ethical and Family Standards', '1. नैतिक एवं पारिवारिक मानक'],
    body: [
      'All advertisements, banners, and sponsored content placed in the Sahu Sabha newsletter, magazine, or digital directories must align with community values. We prioritize educational, social development, local businesses, and health awareness advertisements.',
      'साहू सभा के न्यूज़लेटर, पत्रिका या डिजिटल निर्देशिकाओं में प्रकाशित सभी विज्ञापन, बैनर और प्रायोजित सामग्री समाज के मूल्यों के अनुरूप होनी चाहिए। हम शैक्षिक, सामाजिक विकास, स्थानीय व्यवसाय और स्वास्थ्य जागरूकता से जुड़े विज्ञापनों को प्राथमिकता देते हैं।',
    ],
  },
  {
    title: ['2. Verification and Truthfulness', '2. सत्यापन एवं सत्यता'],
    body: [
      'Advertisers must be registered entities or validated community members. Claims regarding services, goods, or prices must be transparent, verifiable, and free of misleading statements.',
      'विज्ञापनदाता पंजीकृत संस्थाएँ या सत्यापित सामुदायिक सदस्य होने चाहिए। सेवाओं, वस्तुओं या कीमतों से जुड़े दावे पारदर्शी, सत्यापन योग्य और भ्रामक कथनों से मुक्त होने चाहिए।',
    ],
  },
  {
    title: ['3. Clear Demarcation', '3. स्पष्ट पहचान'],
    body: [
      'Sponsored articles, featured listings, or banners must be clearly marked as "Sponsored Content" or "Advertisement" to prevent confusing them with editorial community news and historical updates.',
      'प्रायोजित लेख, विशेष सूचियाँ या बैनर स्पष्ट रूप से "प्रायोजित सामग्री" या "विज्ञापन" के रूप में चिह्नित होने चाहिए, ताकि उन्हें समाज के संपादकीय समाचारों और ऐतिहासिक जानकारियों से अलग पहचाना जा सके।',
    ],
  },
  {
    title: ['4. Requesting Advertisement Space', '4. विज्ञापन स्थान के लिए अनुरोध'],
    body: [
      'If you wish to advertise or sponsor community projects, newsletters, or directories, please reach out to our administration desk via the Contact Support channel.',
      'यदि आप सामुदायिक परियोजनाओं, न्यूज़लेटर या निर्देशिकाओं में विज्ञापन देना या प्रायोजन करना चाहते हैं, तो कृपया संपर्क सहायता के माध्यम से हमारे प्रशासनिक कार्यालय से संपर्क करें।',
    ],
  },
];

export default function PolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-[#FFFBF7] to-white pb-20">
        {/* Policy Hero */}
        <section className="py-20 text-center relative overflow-hidden bg-gradient-to-br from-primary-light/40 to-transparent">
          <div className="container-custom max-w-4xl mx-auto px-6 relative z-10">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary font-bold rounded-full text-xs uppercase tracking-wider mb-4">
              <T en="Guidelines" hi="दिशानिर्देश" />
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              <T en="Advertisement" hi="विज्ञापन" /> <span className="text-primary"><T en="Policy" hi="नीति" /></span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              <T
                en="Last updated: May 26, 2026. Learn about the standards and criteria for advertising within the Sahu Sabha platforms."
                hi="अंतिम अद्यतन: 26 मई 2026। साहू सभा के प्लेटफ़ॉर्म पर विज्ञापन के मानकों और मापदंडों के बारे में जानें।"
              />
            </p>
          </div>
        </section>

        {/* Policy Content */}
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
