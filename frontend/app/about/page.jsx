import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AboutLeadership from '../../components/About/AboutLeadership';
import ExecutiveCommittee from '../../components/About/ExecutiveCommittee';
import AboutConstitution from '../../components/About/AboutConstitution';
import AboutStats from '../../components/About/AboutStats';

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
              src="/assets/rally-slide.png"
              alt="About Sahu Sabha"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent"></div>
          </div>
          <div className="px-4 sm:px-6 md:px-8 lg:px-16 relative z-10 py-12 md:py-0">
            <div className="max-w-2xl">
              <span className="inline-block px-3 py-1 bg-primary text-white font-bold rounded-full mb-4 text-sm">
                Established 1980
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6">
                Uniting Hearts, <br />
                <span className="text-primary">Building Legacy.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
                Sahu Sabha is more than an organization; it's a family of millions connected by heritage and driven by a shared vision of progress.
              </p>
            </div>
          </div>
        </section>
        <AboutLeadership />
        <ExecutiveCommittee />
        <AboutConstitution />
        <AboutStats />
      </main>
      <Footer />
    </>
  );
}
