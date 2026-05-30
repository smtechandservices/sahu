"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi } from '../../lib/api';

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/carousel-images/')
      .then(data => {
        if (data && data.length > 0) {
          const dynamicSlides = data.map(img => ({
            id: img.id,
            image: `data:${img.image_mimetype};base64,${img.image}`
          }));
          setSlides(dynamicSlides);
        }
      })
      .catch(err => console.error("Failed to fetch carousel images:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides]);

  if (slides.length === 0 || !slides[current]) return null;

  return (
    <section className="bg-gray-50">
      <div className="relative">
        <div className="relative overflow-hidden h-[600px] flex items-center bg-white">
          <AnimatePresence mode="wait">
            <motion.div 
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="w-full h-full relative"
            >
              <div className="relative w-full h-full">
                <img 
                  src={slides[current].image} 
                  alt="Hero Slide" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {slides.length > 1 && (
          <>
            <button
              onClick={() => setCurrent((current - 1 + slides.length) % slides.length)}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/10 hover:bg-black/55 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrent((current + 1) % slides.length)}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/10 hover:bg-black/55 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default Hero;
