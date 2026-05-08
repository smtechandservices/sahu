"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const MagazineHero = () => {
  return (
    <section className="relative bg-primary-light/30 section-padding overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform translate-x-1/2"></div>
      
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary text-white text-sm font-bold tracking-wider uppercase rounded-full mb-6">
              Latest Issue: May 2024
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Celebrating Our <span className="text-primary italic">Roots</span>, Building Our Future.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
              Explore the latest stories of heritage, achievement, and culture within the Sahu community. Dive into our community's monthly journey.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#" className="btn-primary flex items-center gap-2">
                <span>Read Now</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </Link>
              <Link href="#" className="btn-outline flex items-center gap-2">
                <span>Download PDF</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </Link>
            </div>
            
            <div className="mt-12 flex items-center gap-8 text-sm font-medium text-gray-500">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">500+</span>
                <span>Subscribers</span>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">120+</span>
                <span>Issues</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 drop-shadow-2xl">
              <Image 
                src="/assets/magazine-mockup.png" 
                alt="Sahu Sabha Magazine Latest Issue" 
                width={600} 
                height={800} 
                className="rounded-lg"
                priority
              />
            </div>
            
            {/* Backdrop Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-[100px] -z-10 rounded-full"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MagazineHero;
