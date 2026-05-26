import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Eye, ShieldAlert, Award } from 'lucide-react';

export const metadata = {
  title: 'Advertisement Policy',
  description: 'Understand the advertisement and sponsorship policy of Sahu Sabha Digital Heritage.',
};

export default function PolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-[#FFFBF7] to-white pb-20">
        {/* Policy Hero */}
        <section className="py-20 text-center relative overflow-hidden bg-gradient-to-br from-primary-light/40 to-transparent">
          <div className="container-custom max-w-4xl mx-auto px-6 relative z-10">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary font-bold rounded-full text-xs uppercase tracking-wider mb-4">
              Guidelines
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Advertisement <span className="text-primary">Policy</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Last updated: May 26, 2026. Learn about the standards and criteria for advertising within the Sahu Sabha platforms.
            </p>
          </div>
        </section>

        {/* Policy Content */}
        <section className="container-custom max-w-4xl mx-auto px-6 mt-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm space-y-8 text-gray-700">
            
            <div className="flex gap-4 items-start pb-6 border-b border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Award size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">1. Ethical and Family Standards</h3>
                <p className="text-sm leading-relaxed">
                  All advertisements, banners, and sponsored content placed in the Sahu Sabha newsletter, magazine, or digital directories must align with community values. We prioritize educational, social development, local businesses, and health awareness advertisements.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start pb-6 border-b border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">2. Verification and Truthfulness</h3>
                <p className="text-sm leading-relaxed">
                  Advertisers must be registered entities or validated community members. Claims regarding services, goods, or prices must be transparent, verifiable, and free of misleading statements.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start pb-6 border-b border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Eye size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">3. Clear Demarcation</h3>
                <p className="text-sm leading-relaxed">
                  Sponsored articles, featured listings, or banners must be clearly marked as "Sponsored Content" or "Advertisement" to prevent confusing them with editorial community news and historical updates.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">4. Requesting Advertisement Space</h3>
              <p className="text-sm leading-relaxed">
                If you wish to advertise or sponsor community projects, newsletters, or directories, please reach out to our administration desk via the Contact Support channel.
              </p>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
