'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Images, ZoomIn } from 'lucide-react';

const isVideo = (m) => m?.startsWith('video/');

export default function GalleryClient({ initialImages }) {
  const images = initialImages || [];
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
    <section>
      {/* Pinterest masonry — CSS columns, natural image heights */}
      <div
        className="columns-1 sm:columns-2 md:columns-3 lg:columns-4"
        style={{ columnGap: '12px' }}
      >
        {images.map((img, index) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.6) }}
            className="break-inside-avoid mb-3 group cursor-pointer relative hover:z-10"
            onClick={() => openLightbox(index)}
          >
            <div className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
              {isVideo(img.image_mimetype) ? (
                <video
                  src={img.image_url}
                  className="w-full h-auto block"
                  muted loop playsInline
                  onMouseEnter={e => e.currentTarget.play()}
                  onMouseLeave={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                />
              ) : (
                <img
                  src={img.image_url}
                  alt={img.title || 'Photo'}
                  className="w-full h-auto block group-hover:scale-[1.03] transition-transform duration-500"
                  loading="lazy"
                />
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 rounded-2xl" />

              {/* Icon top-right */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center">
                  {isVideo(img.image_mimetype)
                    ? <span className="text-gray-700 text-xs font-bold">▶</span>
                    : <ZoomIn size={14} className="text-gray-700" />}
                </div>
              </div>

              {/* Video badge */}
              {isVideo(img.image_mimetype) && (
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">▶ Video</div>
              )}

              {/* Title pill at bottom */}
              {img.title && (
                <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-8 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl">
                  <p className="text-white font-semibold text-sm leading-tight line-clamp-2">{img.title}</p>
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
            className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all z-10"
            >
              <X size={20} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all z-10"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all z-10"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col items-center max-w-4xl w-full px-16"
              onClick={(e) => e.stopPropagation()}
            >
              {isVideo(currentImage.image_mimetype) ? (
                <video
                  src={currentImage.image_url}
                  className="max-h-[80vh] w-full rounded-2xl shadow-2xl"
                  controls autoPlay loop
                />
              ) : (
                <img
                  src={currentImage.image_url}
                  alt={currentImage.title || 'Photo'}
                  className="max-h-[80vh] w-full object-contain rounded-2xl shadow-2xl"
                />
              )}
              <div className="mt-4 text-center">
                {currentImage.title && (
                  <p className="text-white font-bold text-base">{currentImage.title}</p>
                )}
                <p className="text-white/30 text-xs mt-1">{lightboxIndex + 1} / {images.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
