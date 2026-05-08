import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AboutValues from '../../components/About/AboutValues';
import AboutTimeline from '../../components/About/AboutTimeline';
import AboutLeadership from '../../components/About/AboutLeadership';
import AboutStats from '../../components/About/AboutStats';

export const metadata = {
  title: 'About Us | Sahu Sabha',
  description: 'Learn about the mission, values, history and leadership of Sahu Sabha.',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* About Hero Section */}
        <section className="relative h-[60vh] flex items-center overflow-hidden bg-gray-900">
          <div className="absolute inset-0">
            <img 
              src="/assets/rally-slide.png" 
              alt="About Sahu Sabha" 
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent"></div>
          </div>
          
          <div className="container-custom relative z-10">
            <div className="max-w-2xl">
              <span className="inline-block px-4 py-1 bg-primary text-white font-bold rounded-full mb-6">
                Established 1980
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
                Uniting Hearts, <br />
                <span className="text-primary">Building Legacy.</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Sahu Sabha is more than an organization; it's a family of millions connected by heritage and driven by a shared vision of progress.
              </p>
            </div>
          </div>
        </section>

        <AboutValues />
        <AboutTimeline />
        <AboutLeadership />
        <AboutStats />
      </main>
      <Footer />
    </>
  );
}
