"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    image: '/assets/rally-slide.png',
  },
  {
    id: 2,
    image: '/assets/slide1.png',
  }
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="bg-gray-50">
      <div className="px-8 pt-4 pb-8">
        <div className="relative overflow-hidden h-[800px] flex items-center bg-white">
          <AnimatePresence mode="wait">
            <motion.div 
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="w-full h-full"
            >
              <div className="relative w-full h-full">
                <Image 
                  src={slides[current].image} 
                  alt="Hero Slide" 
                  fill 
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots - Moved outside the slide area */}
        <div className="flex justify-center gap-2 mt-6">
          {slides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${current === i ? 'w-8 bg-orange-500' : 'w-2 bg-slate-300'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
