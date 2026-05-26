'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';

export default function GalleryClient({ initialImages }) {
  const [images] = useState(initialImages || []);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = useCallback(() => {
    setLightboxIndex(i => (i > 0 ? i - 1 : images.length - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setLightboxIndex(i => (i < images.length - 1 ? i + 1 : 0));
  }, [images.length]);

  useEffect(() => {
    const handler = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, goPrev, goNext]);

  const currentImage = lightboxIndex !== null ? images[lightboxIndex] : null;

  if (images.length === 0) {
    return (
      <div className="py-24 text-center">
        <Images size={56} className="mx-auto text-gray-200 mb-5" />
        <p className="text-gray-400 font-bold text-lg">No photos yet.</p>
        <p className="text-gray-300 text-sm mt-2">Check back soon for community highlights!</p>
      </div>
    );
  }

  return (
    <section className="py-12 px-4 sm:px-8 md:px-12">
      {/* Pinterest Masonry Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4" style={{ columnGap: '1rem' }}>
        {images.map((img, index) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.03 }}
            className="break-inside-avoid mb-4 group cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <div className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <img
                src={`data:${img.image_mimetype || 'image/jpeg'};base64,${img.image}`}
                alt={img.title || 'Gallery photo'}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {img.title && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white font-bold text-sm">{img.title}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all z-10"
            >
              <X size={20} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all z-10"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all z-10"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center max-w-4xl w-full px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`data:${currentImage.image_mimetype || 'image/jpeg'};base64,${currentImage.image}`}
                alt={currentImage.title || 'Gallery photo'}
                className="max-h-[78vh] w-full object-contain rounded-2xl shadow-2xl"
              />
              {currentImage.title && (
                <p className="text-white font-bold text-lg mt-4">{currentImage.title}</p>
              )}
              <p className="text-white/30 text-xs mt-2">{lightboxIndex + 1} / {images.length}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
