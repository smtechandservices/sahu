"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

const articles = [
  {
    category: "Heritage",
    title: "The Legacy of Sahu Community: From Roots to Global Presence",
    author: "Dr. Vinay Sahu",
    date: "May 15, 2024",
    image: "/assets/event1.png",
  },
  {
    category: "Achievement",
    title: "Youth Icons: Empowering the Next Generation of Professionals",
    author: "Anjali Sahu",
    date: "May 10, 2024",
    image: "/assets/event2.png",
  },
  {
    category: "Culture",
    title: "Traditional Festivals: Celebrating Unity through Diversity",
    author: "Rakesh Sahu",
    date: "May 05, 2024",
    image: "/assets/event3.png",
  }
];

const MagazineFeatured = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Stories</h2>
            <p className="text-gray-600 max-w-xl">
              Handpicked articles from our editors that highlight the best of our community's spirit and progress.
            </p>
          </div>
          <button className="text-primary font-bold hover:underline hidden md:block">
            View All Articles →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-6 shadow-md group-hover:shadow-xl transition-all">
                <Image 
                  src={article.image} 
                  alt={article.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold rounded-full">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <span className="font-semibold text-gray-900">{article.author}</span>
                <span>•</span>
                <span>{article.date}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight mb-3">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                Discover the deep-rooted traditions and the modern advancements that define our vibrant community today.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MagazineFeatured;
