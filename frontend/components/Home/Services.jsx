import Link from 'next/link';
import Image from 'next/image';
import { Heart, Briefcase, Building2, ArrowRight, Mars, Venus } from 'lucide-react';

const Services = () => {
  return (
    <section className="pb-16 bg-white">
      <div className="px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <span className="text-yellow-600 font-bold tracking-widest text-sm uppercase mb-2 block">
              ESSENTIAL RESOURCES
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900">Quick Access</h2>
          </div>
          <Link href="/services" className="text-yellow-700 font-bold flex items-center gap-2 hover:gap-3 transition-all group">
            View All Services <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Matrimonial Services - Large Card */}
          <div className="md:col-span-2 bg-gray-100 p-6 sm:p-8 md:p-10 rounded-xl border border-yellow-200 relative overflow-hidden group hover:shadow-lg transition-all duration-500">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 opacity-40">
              <Image
                src="/assets/event3.jpg"
                alt="Matrimonial Background"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent z-[1]"></div>

            <div className="relative z-10 h-full flex flex-col max-w-lg">
              <div className="bg-yellow-50/80 p-4 rounded-lg w-fit mb-8">
                <Heart className="text-yellow-600 fill-yellow-600" size={28} />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-slate-900">Matrimonial Services</h3>
              <p className="text-slate-600 text-base leading-relaxed mb-12">
                Find the Perfect Life Partner
                Within Your Community
              </p>
              <Link href="/matrimonial" className="mt-auto w-fit bg-white border border-gray-300 px-8 py-3 rounded-md font-bold text-slate-900 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2 group/link">
                Explore Profiles <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Career Portal */}
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl border border-yellow-200 hover:shadow-lg transition-all duration-500 flex flex-col group">
            <div className="bg-blue-50 p-4 rounded-lg w-fit mb-6 md:mb-8">
              <Briefcase className="text-blue-900 fill-blue-900" size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Opportunities</h3>
            <p className="text-slate-600 text-base leading-relaxed mb-8">
              Empowering the Community Through Opportunities
            </p>
            <Link href="/career" className="mt-auto text-yellow-700 font-bold flex items-center gap-2 group/link">
              Find Opportunities <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Student Hostels */}
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl border border-yellow-200 hover:shadow-lg transition-all duration-500 flex flex-col group">
            {/* Building Icon - prominent */}
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl w-fit mb-4 group-hover:bg-amber-100 transition-colors duration-300">
              <Building2 className="text-amber-700" size={36} strokeWidth={1.5} />

            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Student Hostels</h3>
            <p className="text-slate-600 text-base leading-relaxed mb-8">
              Safe, affordable accommodation for community students pursuing higher education.
            </p>
            <Link href="/accommodation" className="mt-auto text-yellow-700 font-bold flex items-center gap-2 group/link">
              View Facilities <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Monthly Magazine - Large Card with Background */}
          <div className="md:col-span-2 bg-gray-100 p-6 sm:p-8 md:p-10 rounded-xl border border-yellow-200 relative overflow-hidden group hover:shadow-lg transition-all duration-500">
            {/* Background Image/Overlay */}
            <div className="absolute inset-0 z-0 opacity-40">
              <Image
                src="/assets/magazine-mockup.png"
                alt="Magazine Background"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent z-[1]"></div>

            <div className="relative z-10 h-full flex flex-col max-w-lg">
              <span className="text-slate-500 font-bold tracking-widest text-xs uppercase mb-4 block">
                LATEST EDITION
              </span>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Community Magazine</h3>
              <p className="text-slate-600 text-base leading-relaxed mb-8">
                Read inspiring stories, historical insights, and updates from Sabha members globally.
              </p>
              <Link href="/magazine" className="mt-auto w-fit bg-white border border-gray-300 px-8 py-3 rounded-md font-bold text-slate-900 hover:bg-slate-50 transition-colors shadow-sm">
                Read Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
