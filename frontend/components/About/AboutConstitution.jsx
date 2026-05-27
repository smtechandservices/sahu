"use client";

import { motion } from 'framer-motion';

const AboutConstitution = () => {
  return (
    <section className="section-padding bg-[#FFFBF7]" id="constitution">
      <div className="px-8">
        <div className="mx-auto bg-white border border-yellow-200 rounded-md shadow-base p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 mx-auto mb-6 text-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Constitution</h2>
            <p className="text-lg text-[#564337] mb-8 max-w-2xl mx-auto">
              The Sahu Sabha Constitution outlines our fundamental principles, organizational structure, and the rules that govern our community's operations. We believe in complete transparency and shared understanding of our foundational values.
            </p>
            
            <a 
              href="/assets/constitution.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Download Constitution PDF
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutConstitution;
