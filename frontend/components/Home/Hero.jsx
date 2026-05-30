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
      <div className="">
        <div className="relative overflow-hidden h-[550px] flex items-center bg-white">
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

        {/* Dots */}
        {slides.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {slides.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${current === i ? 'w-8 bg-primary' : 'w-2 bg-slate-300'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
