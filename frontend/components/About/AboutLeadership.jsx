"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

const leaders = [
  {
    name: "Ranvijay Sahu",
    role: "President",
    image: "/assets/president.png",
    bio: "Dedicated to community welfare, leading with vision and integrity."
  },
];

const AboutLeadership = () => {
  return (
    <section id="about-leadership" className="section-padding bg-white">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Leadership Team</h2>
          <p className="text-base sm:text-lg md:text-xl text-[#564337] mx-auto">
            Meet the dedicated individuals who volunteer their time and expertise to lead Sahu Sabha.
          </p>
        </div>

        {leaders.length === 1 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,320px)_1fr] items-center gap-8 md:gap-12 bg-[#FFFBF7] border border-yellow-200 rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm"
          >
            <div className="relative aspect-square w-full max-w-[320px] mx-auto overflow-hidden rounded-xl border border-yellow-200 shadow-base">
              <Image
                src={leaders[0].image}
                alt={leaders[0].name}
                fill
                sizes="320px"
                className="object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">{leaders[0].role}</p>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">{leaders[0].name}</h3>
              <div className="h-1 w-16 bg-[#f5b301] rounded-full mb-5 mx-auto md:mx-0" />
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                {leaders[0].bio}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {leaders.map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]"
              >
                <div className="relative aspect-square overflow-hidden mb-6 shadow-base border border-yellow-200 hover:scale-102 transition-transform duration-300">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
        )}
      </div>
    </section>
  );
};

export default AboutLeadership;
