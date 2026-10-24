import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AboutHistory from '../../components/About/AboutHistory';
import AboutLeadership from '../../components/About/AboutLeadership';
import ExecutiveCommittee from '../../components/About/ExecutiveCommittee';
import AboutDigitalCommittee from '../../components/About/AboutDigitalCommittee';
import AboutConstitution from '../../components/About/AboutConstitution';
import AboutStats from '../../components/About/AboutStats';
import { T } from '../../context/LanguageContext';

export const metadata = {
  title: 'About Us',
  description: 'Learn about the mission, values, history and leadership of Sahu Sabha.',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section id="about-hero" className="relative min-h-[50vh] sm:min-h-[55vh] md:h-[60vh] flex items-center overflow-hidden bg-gray-900">
          <div className="absolute inset-0">
            <img
              src="/assets/sahu-samaj-bhavan.jpg"
              alt="Sahu Samaj"
              className="w-full h-full object-cover object-fill"
            />
          </div>
          <h1 className="sr-only">
            <T en="Sahu Samaj" hi="साहू समाज" />
          </h1>
          <div className="px-4 sm:px-6 md:px-8 lg:px-16 relative z-10 py-12 md:py-0">
            <div className="max-w-2xl">
              {/* <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6">
                <T en="Uniting Hearts," hi="दिलों को जोड़ते हुए," /> <br />
                <span className="text-primary"><T en="Building Legacy." hi="विरासत का निर्माण।" /></span>
              </h1> */}
              <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
                {/* <T
                  en="Sahu Sabha is more than an organization, it's a family of millions connected by heritage and driven by a shared vision of progress."
                  hi="साहू सभा केवल एक संगठन नहीं, बल्कि लाखों लोगों का परिवार है, जो साझा विरासत से जुड़ा है और प्रगति के साझा सपने से प्रेरित है।"
                /> */}
                {/* <T
                  en="Sahu Sabha is more than an organization, it's a family of millions connected by heritage and driven by a shared vision of progress."
                  hi="साहू सभा केवल एक संगठन नहीं, बल्कि लाखों लोगों का परिवार है, जो साझा विरासत से जुड़ा है और प्रगति के साझा सपने से प्रेरित है।"
                /> */}
              </p>
            </div>
          </div>
        </section>
        <AboutHistory />
        <AboutLeadership />
        <ExecutiveCommittee />
        <AboutDigitalCommittee />
        <AboutConstitution />
        <AboutStats />
      </main>
      <Footer />
    </>
  );
}
