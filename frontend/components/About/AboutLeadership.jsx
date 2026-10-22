"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

const president = {
  name: "Ranvijay Sahu",
  role: "President",
  image: "/assets/president.png",
  bio: "Dedicated to community welfare, leading with vision and integrity."
};

const digitalCommittee = [
  { name: "Vinay Kumar", role: "Digital Committee Member", image: "/assets/vinay.png" },
  { name: "Bimal Kishore Bittu", role: "Digital Committee Member", image: "/assets/bimal.jpg" },
  { name: "Sanjiv Kumar Shekhar", role: "Digital Committee Member", image: "/assets/sanjiv.jpg" },
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

        <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-0">
          {/* President: 1/3 width, straight column */}
          <div className="w-full max-w-sm mx-auto lg:max-w-none lg:pr-8">
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">{president.role}</p>
            <div className="h-1 w-16 bg-[#f5b301] rounded-full mb-6" />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative aspect-square w-full overflow-hidden rounded-2xl border border-yellow-200 shadow-sm"
            >
              <Image
                src={president.image}
                alt={president.name}
                fill
                sizes="(max-width: 1024px) 384px, 33vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/60 to-transparent p-4 sm:p-5 pt-16">
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">{president.name}</h3>
                <p className="text-[#f5b301] text-sm mb-2">{president.role}</p>
                <p className="text-white/85 text-sm leading-relaxed">{president.bio}</p>
              </div>
            </motion.div>
          </div>

          {/* Digital Committee: 2/3 width, three cards in a row; on desktop they stretch to the president card's height */}
          {/* divider: top border when stacked, left border on desktop */}
          <div className="lg:col-span-2 flex flex-col border-t border-yellow-200 pt-10 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-8">
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">Digital Committee</p>
            <div className="h-1 w-16 bg-[#f5b301] rounded-full mb-6" />
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
              {digitalCommittee.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative aspect-square sm:aspect-[3/4] lg:aspect-auto w-full max-w-sm mx-auto sm:max-w-none overflow-hidden rounded-2xl border border-yellow-200 shadow-sm"
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 384px, 22vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 sm:p-4 pt-10">
                    <h4 className="text-sm sm:text-lg font-bold text-white leading-tight">{member.name}</h4>
                    <p className="text-[#f5b301] text-xs sm:text-sm">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutLeadership;
