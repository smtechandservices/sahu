import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

export const metadata = {
  title: 'Terms of Service',
  description: 'Understand the terms of service for utilizing the Sahu Sabha platform.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-[#FFFBF7] to-white pb-20">
        {/* Terms Hero */}
        <section className="py-20 text-center relative overflow-hidden bg-gradient-to-br from-primary-light/40 to-transparent">
          <div className="container-custom max-w-4xl mx-auto px-6 relative z-10">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary font-bold rounded-full text-xs uppercase tracking-wider mb-4">
              Legal
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Terms of <span className="text-primary">Service</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Last updated: May 26, 2026. Please read these terms carefully before using our services.
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="mx-auto px-4 sm:px-6 mt-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm space-y-8 text-gray-700">

            <div className="pb-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-1">1. Acceptance of Terms</h3>
              <p className="text-sm leading-relaxed">
                By accessing or using the Sahu Sabha Digital Heritage platform (website, directories, matrimonials, and career tools), you agree to be bound by these terms. If you do not agree, please do not use our services.
              </p>
            </div>

            <div className="pb-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-1">2. Community Guidelines</h3>
              <p className="text-sm leading-relaxed">
                Our services are designed to build, unite, and empower the Sahu Sabha community. You agree to provide accurate registration information, respect other community members, and avoid posting any derogatory or inappropriate material.
              </p>
            </div>

            <div className="pb-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-1">3. Matrimonial Directory</h3>
              <p className="text-sm leading-relaxed">
                Matrimonial profiles are strictly for personal matchmaking purposes of our verified members. Commercial exploitation of matrimonial profiles is strictly forbidden. Profiles undergo admin review before going live. Individual profile images of persons are omitted to preserve digital security and focus on background and values.
              </p>
            </div>

            <div className="pb-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-1">4. Account Security & Session Management</h3>
              <p className="text-sm leading-relaxed">
                To prevent unauthorized sharing, active device logins are capped at a maximum of two sessions per account. Any third active session automatically revokes the oldest session.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">5. Updates and Modifications</h3>
              <p className="text-sm leading-relaxed">
                Sahu Sabha reserves the right to modify these terms at any time. We will post notification of modifications on this page. Your continued use of the platform constitutes agreement to the updated terms.
              </p>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
