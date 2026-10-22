"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FileText, Download, Sparkles } from 'lucide-react';
import { downloadFile } from '../../lib/download';
import { useLanguage } from '../../context/LanguageContext';

const MagazineFeatured = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useLanguage();

  useEffect(() => {
    const loadData = async () => {
      try {
        const { fetchApi } = await import('../../lib/api');
        const data = await fetchApi('/articles/?category=Magazine');
        if (data.length === 0) return;
        const latest = data[0];
        const rest = data.slice(1).sort(() => Math.random() - 0.5).slice(0, 2);
        setFeatured([latest, ...rest]);
      } catch (err) {
        console.error("Error fetching magazine articles:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(locale, { month: 'short', day: '2-digit', year: 'numeric' });

  const handleRead = (article) => window.open(article.pdf, '_blank');

  const handleDownload = (article) =>
    downloadFile(article.pdf, article.pdf_filename || 'magazine.pdf');

  if (loading || featured.length === 0) return null;

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('Featured Issues', 'विशेष अंक')}</h2>
            <p className="text-gray-600 max-w-xl">
              {t('Our latest release and handpicked issues from the Sahu Sabha editorial team.', 'साहू सभा संपादकीय टीम द्वारा चुना गया नवीनतम अंक और विशेष अंक।')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((article, index) => {
            const isLatest = index === 0;
            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                {/* Cover image */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-5 shadow-md group-hover:shadow-xl transition-all">
                  <Image
                    src={article.image || '/assets/event1.png'}
                    alt={article.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {isLatest && (
                      <span className="px-3 py-1 bg-primary text-white text-xs font-black rounded-full flex items-center gap-1 shadow-lg">
                        <Sparkles size={10} /> {t('Latest', 'नवीनतम')}
                      </span>
                    )}
                    {article.pdf && (
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-black rounded-full flex items-center gap-1">
                        <FileText size={10} /> PDF
                      </span>
                    )}
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span className="font-semibold text-gray-900">{t('Sahu Sabha Editorial', 'साहू सभा संपादकीय')}</span>
                  <span>•</span>
                  <span>{formatDate(article.published_at)}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight mb-2">
                  {article.title}
                </h3>
                {article.content && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{article.content}</p>
                )}

                {/* PDF actions — always visible */}
                {article.pdf && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRead(article)}
                      className="cursor-pointer flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors"
                    >
                      <FileText size={13} /> {t('Read', 'पढ़ें')}
                    </button>
                    <button
                      onClick={() => handleDownload(article)}
                      className="cursor-pointer flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-colors"
                    >
                      <Download size={13} /> {t('Download', 'डाउनलोड')}
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MagazineFeatured;
