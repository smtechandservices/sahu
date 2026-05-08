"use client";

import { motion } from 'framer-motion';

const values = [
  {
    title: "Education",
    description: "Empowering our youth with knowledge and skills to lead the future. We provide scholarships and educational resources to ensure every child has a bright future.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
    )
  },
  {
    title: "Heritage",
    description: "Preserving our rich cultural legacy and traditional values for future generations. We celebrate our roots through festivals, history projects, and community gatherings.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    )
  },
  {
    title: "Unity",
    description: "Fostering a strong sense of belonging and support within the Sahu community. Together, we build a resilient network that stands by each member in times of need.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    )
  }
];

const AboutValues = () => {
  return (
    <section className="section-padding bg-white">
      <div className="px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
          <p className="text-xl text-[#564337] max-w-2xl mx-auto">
            The foundation of Sahu Sabha is built on principles that guide our actions and inspire our community's growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#FFFBF7] p-8 border border-yellow-200 rounded-md shadow-base hover:shadow-xl hover:border-primary/20 transition-all group"
            >
              <div className="w-20 h-20">
                {value.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4">{value.title}</h3>
              <p className="leading-relaxed text-[#564337]">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutValues;
