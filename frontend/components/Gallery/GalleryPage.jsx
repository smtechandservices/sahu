'use client';

import { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import GalleryClient from './GalleryClient';
import { fetchApi } from '../../lib/api';
import { Images, Film, Image } from 'lucide-react';

const TABS = [
  { key: 'all',     label: 'All',     icon: Images },
  { key: 'gallery', label: 'Gallery', icon: Image  },
  { key: 'media',   label: 'Media',   icon: Film   },
];

export default function GalleryPage() {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchApi('/media/')
      .then(data => setAllItems(data || []))
      .catch(() => setAllItems([]))
      .finally(() => setLoading(false));
  }, []);

  const galleryItems = allItems.filter(i => i.media_type === 'gallery');
  const mediaItems   = allItems.filter(i => i.media_type === 'media');

  const displayItems =
    activeTab === 'gallery' ? galleryItems :
    activeTab === 'media'   ? mediaItems   :
    allItems;

  const counts = {
    all:     allItems.length,
    gallery: galleryItems.length,
    media:   mediaItems.length,
  };

  return (
    <>
      <style>{`
        @keyframes marquee-left  { from { transform: translateX(0) }    to { transform: translateX(-50%) } }
        @keyframes marquee-right { from { transform: translateX(-50%) } to { transform: translateX(0) }    }
        .marquee-left  { animation: marquee-left  32s linear infinite; }
        .marquee-right { animation: marquee-right 38s linear infinite; }
        .marquee-left:hover, .marquee-right:hover { animation-play-state: paused; }
      `}</style>
      <Header />
      <main className="min-h-screen bg-[#FFFBF7]">
        {/* Hero */}
        <div className="bg-primary/5 border-b border-primary/10 pt-16 pb-0 text-center">
          <div className="px-4 sm:px-8 md:px-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
              <Images size={13} />
              Community Media
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Our Cherished Moments
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
              Celebrations, milestones, and community highlights all in one place.
            </p>
          </div>

          {/* Marquees — only shown while loading or when there is actual data */}
          {(loading || allItems.length > 0) && (
            <div className="mt-10 space-y-3 select-none overflow-hidden">
              {/* Row 1 — gallery images, scrolls left */}
              {(loading || galleryItems.length > 0) && (
                <div className="overflow-hidden w-full">
                  <div className={`flex gap-3 w-max ${galleryItems.length > 0 ? 'marquee-left' : ''}`}>
                    {(loading ? Array(10).fill(null) : [...galleryItems, ...galleryItems]).map((img, i) => (
                      <MarqueeThumb key={i} img={img} loading={loading} />
                    ))}
                  </div>
                </div>
              )}
              {/* Row 2 — media images, scrolls right */}
              {(loading || mediaItems.length > 0) && (
                <div className="overflow-hidden w-full">
                  <div className={`flex gap-3 w-max ${mediaItems.length > 0 ? 'marquee-right' : ''}`}>
                    {(loading ? Array(10).fill(null) : [...mediaItems, ...mediaItems]).map((img, i) => (
                      <MarqueeThumb key={i} img={img} loading={loading} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tabs */}
          <div className="px-4 pb-8 mt-8">
            {!loading && (
              <div className="flex items-center gap-1 p-1 bg-white/60 backdrop-blur-sm rounded-2xl w-full sm:w-fit mx-auto border border-primary/10 shadow-sm">
                {TABS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex-1 flex items-center justify-center gap-1 px-2 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      activeTab === key
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={13} className="shrink-0 hidden xs:block sm:block" />
                    <span className="truncate">{label}</span>
                    <span className={`text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                      activeTab === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {counts[key]}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {!loading && activeTab !== 'all' && (
              <p className="text-gray-400 text-sm mt-4 font-medium">
                {counts[activeTab]} {counts[activeTab] === 1 ? 'photo' : 'photos'}
              </p>
            )}
            {!loading && activeTab === 'all' && (
              <p className="text-gray-400 text-sm mt-4 font-medium">
                {counts.gallery} gallery · {counts.media} media
              </p>
            )}
          </div>
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
        ) : activeTab === 'all' && allItems.length > 0 ? (
          /* Split view for "All" tab */
          <div>
            {galleryItems.length > 0 && (
              <section className="py-10 px-4 sm:px-8 md:px-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Image size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900">Gallery</h2>
                    <p className="text-sm text-gray-400 font-medium">Community events & celebrations</p>
                  </div>
                  <span className="ml-auto text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">
                    {galleryItems.length} photos
                  </span>
                </div>
                <GalleryClient initialImages={galleryItems} />
              </section>
            )}

            {mediaItems.length > 0 && (
              <section className={`py-10 px-4 sm:px-8 md:px-12 ${galleryItems.length > 0 ? 'border-t border-gray-100' : ''}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Film size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900">Media</h2>
                    <p className="text-sm text-gray-400 font-medium">Official media & press</p>
                  </div>
                  <span className="ml-auto text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                    {mediaItems.length} photos
                  </span>
                </div>
                <GalleryClient initialImages={mediaItems} />
              </section>
            )}

            {allItems.length === 0 && (
              <EmptyState onlyMedia={false} />
            )}
          </div>
        ) : (
          /* Single filtered view */
          <GalleryClient initialImages={displayItems} accentColor={activeTab === 'media' ? 'blue' : 'emerald'} />
        )}
      </main>
      <Footer />
    </>
  );
}

function EmptyState() {
  return (
    <div className="py-24 text-center">
      <Images size={56} className="mx-auto text-gray-200 mb-5" />
      <p className="text-gray-400 font-bold text-lg">No photos yet.</p>
      <p className="text-gray-300 text-sm mt-2">Check back soon for community highlights!</p>
    </div>
  );
}

function MarqueeThumb({ img, loading }) {
  return (
    <div className="relative w-28 h-20 rounded-xl overflow-hidden shrink-0 shadow-sm">
      {loading || !img ? (
        <div className="w-full h-full bg-gray-200 animate-pulse" />
      ) : (
        <>
          <img
            src={img.image_url}
            alt={img.title}
            className="w-full h-full object-cover"
          />
        </>
      )}
    </div>
  );
}
