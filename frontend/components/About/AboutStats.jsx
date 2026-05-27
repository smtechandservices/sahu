"use client";

import { motion } from 'framer-motion';

const stats = [
  { label: "ACTIVE MEMBERS", value: "5K+" },
  { label: "EVENTS ORGANIZED", value: "50+" },
  { label: "YEARS OF SERVICE", value: "30+" },
  { label: "DISTRICTS", value: "15+" }
];

const AboutStats = () => {
  return (
    <section id="about-stats" className="bg-primary py-16">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`text-center text-white px-4 ${
                index !== stats.length - 1 ? 'lg:border-r lg:border-white/20' : ''
              }`}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm md:text-base font-semibold tracking-wider opacity-90 uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutStats;
