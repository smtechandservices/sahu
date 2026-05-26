"use client";

import { motion } from 'framer-motion';

const milestones = [
  {
    year: "1980",
    title: "The Beginning",
    description: "Sahu Sabha was founded with a small group of visionary leaders dedicated to community welfare."
  },
  {
    year: "1995",
    title: "Community Expansion",
    description: "Successfully established local chapters in over 20 cities, connecting thousands of families."
  },
  {
    year: "2005",
    title: "Educational Initiative",
    description: "Launched our flagship scholarship program, supporting over 500 students in higher education."
  },
  {
    year: "2015",
    title: "Digital Transformation",
    description: "Introduced the Sahu Sabha Portal, bringing our services and community closer through technology."
  },
  {
    year: "2024",
    title: "Looking Ahead",
    description: "Continuing our mission to empower the community with new initiatives in healthcare and entrepreneurship."
  }
];

const AboutTimeline = () => {
  return (
    <section className="section-padding bg-gray-50 overflow-hidden">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
          <p className="text-xl text-[#564337] max-w-5xl mx-auto">
            From humble beginnings to a global community, here are the key moments that defined our history.
          </p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gray-200 -translate-x-1/2 hidden md:block"></div>

          <div className="space-y-12 md:space-y-0">
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                {/* Connector Dot */}
                <div className="absolute left-1/2 top-1/2 w-6 h-6 bg-primary border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block"></div>

                <div className="w-full md:w-1/2 px-8">
                  <motion.div 
                    initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className={`p-8 bg-[#FFFBF7] shadow-base border border-yellow-200 ${index % 2 === 0 ? 'text-left' : 'md:text-right'}`}
                  >
                    <span className="block text-lg text-primary font-semibold mb-4">
                      {milestone.year}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{milestone.title}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {milestone.description}
                    </p>
                  </motion.div>
                </div>
                <div className="hidden md:block w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTimeline;
