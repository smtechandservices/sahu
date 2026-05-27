'use client';

import { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import GalleryClient from './GalleryClient';
import { fetchApi } from '../../lib/api';
import { Images } from 'lucide-react';

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/gallery/')
      .then(data => setImages(data || []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFBF7]">
        {/* Hero */}
        <div className="bg-primary/5 border-b border-primary/10 py-16 px-4 sm:px-8 md:px-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            <Images size={13} />
            Community Gallery
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Our Cherished Moments
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto font-medium">
            Celebrations, milestones, and community highlights — all in one place.
          </p>
          {!loading && (
            <p className="text-gray-400 text-sm mt-4 font-medium">
              {images.length} {images.length === 1 ? 'photo' : 'photos'} in the gallery
            </p>
          )}
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="py-16 px-4 sm:px-8 md:px-12">
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="break-inside-avoid mb-4 rounded-2xl bg-gray-100 animate-pulse"
                  style={{ height: `${[220, 280, 180, 320, 240, 200, 300, 260][i % 8]}px` }}
                />
              ))}
            </div>
          </div>
        ) : (
          <GalleryClient initialImages={images} />
        )}
      </main>
      <Footer />
    </>
  );
}
