"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

const leaders = [
  {
    name: "Ranvijay Sahu",
    role: "President",
    image: "/assets/president.png",
    bio: "Dedicated to community welfare for over 25 years, leading with vision and integrity."
  },
  {
    name: "Sunita Sahu",
    role: "Vice President",
    image: "/assets/event4.png", // Using available assets as placeholders
    bio: "Focusing on women's empowerment and educational initiatives within the community."
  },
  {
    name: "Alok Sahu",
    role: "General Secretary",
    image: "/assets/event2.png",
    bio: "Expert in organizational management and digital transformation of community services."
  },
  {
    name: "Nitin Sahu",
    role: "Treasurer",
    image: "/assets/event1.png",
    bio: "Ensuring financial transparency and sustainable growth for our welfare projects."
  }
];

const AboutLeadership = () => {
  return (
    <section className="section-padding bg-white">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Leadership Team</h2>
          <p className="text-xl text-[#564337] mx-auto">
            Meet the dedicated individuals who volunteer their time and expertise to lead Sahu Sabha.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {leaders.map((leader, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative aspect-square overflow-hidden mb-6 shadow-base border border-yellow-200 hover:scale-102 transition-transform duration-300">
                <Image 
                  src={leader.image} 
                  alt={leader.name} 
                  fill 
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{leader.name}</h3>
              <p className="text-primary font-semibold text-sm mb-3 uppercase tracking-wider">{leader.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {leader.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutLeadership;
