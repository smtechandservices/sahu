"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';

const makeBlobUrl = (b64data) => {
  const binary = atob(b64data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
};

const MagazineHero = () => {
  const [stats, setStats] = useState({ subscriber_count: null, magazine_count: null });
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { fetchApi } = await import('../../lib/api');
        const [statsData, articles] = await Promise.all([
          fetchApi('/magazine-stats/'),
          fetchApi('/articles/?category=Magazine'),
        ]);
        setStats(statsData);
        if (articles.length > 0) setLatest(articles[0]);
      } catch (err) {
        console.error('MagazineHero fetch error:', err);
      }
    };
    load();
  }, []);

  const handleRead = () => {
    if (latest?.pdf) window.open(makeBlobUrl(latest.pdf), '_blank');
  };

  const handleDownload = () => {
    if (!latest?.pdf) return;
    const a = document.createElement('a');
    a.href = makeBlobUrl(latest.pdf);
    a.download = latest.pdf_filename || 'magazine.pdf';
    a.click();
  };

  const fmt = (n) => (n === null ? '...' : n >= 1000 ? `${(n / 1000).toFixed(1)}k+` : `${n}+`);

  const latestLabel = latest
    ? new Date(latest.published_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  return (
    <section className="relative bg-primary-light/30 section-padding overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform translate-x-1/2" />

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {latestLabel && (
              <span className="inline-block px-4 py-1.5 bg-primary text-white text-sm font-bold tracking-wider uppercase rounded-full mb-6">
                Latest Issue: {latestLabel}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Celebrating Our <span className="text-primary italic">Roots</span>, Building Our Future.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
              Explore the latest stories of heritage, achievement, and culture within the Sahu community. Dive into our community's monthly journey.
            </p>

            <div className="flex items-center gap-8 text-sm font-medium text-gray-500">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">{fmt(stats.subscriber_count)}</span>
                <span>Subscribers</span>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">{fmt(stats.magazine_count)}</span>
                <span>Issues</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 drop-shadow-2xl">
              <Image 
                src="/assets/magazine-mockup.png" 
                alt="Sahu Sabha Magazine Latest Issue" 
                width={600} 
                height={800} 
                className="rounded-lg"
                priority
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-[100px] -z-10 rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MagazineHero;
