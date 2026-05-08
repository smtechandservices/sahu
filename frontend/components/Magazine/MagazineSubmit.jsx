"use client";

import { motion } from 'framer-motion';

const MagazineSubmit = () => {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-primary rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20"
        >
          {/* Decorative Pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Have a Story to Share?</h2>
            <p className="text-xl opacity-90 mb-10 leading-relaxed">
              We're always looking for inspiring stories, community achievements, and cultural insights. Contribute to the next issue of the Sahu Sabha Magazine.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="px-10 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
                Submit Your Story
              </button>
              <button className="px-10 py-4 bg-primary-dark text-white font-bold rounded-xl hover:bg-primary-dark/80 transition-colors shadow-lg">
                Submission Guidelines
              </button>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-x-12 gap-y-6 text-sm font-medium opacity-80">
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span>Guaranteed Review</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span>Global Exposure</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span>Community Recognition</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MagazineSubmit;
