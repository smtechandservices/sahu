"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, BookOpen } from 'lucide-react';

const makeBlobUrl = (b64data) => {
  const binary = atob(b64data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
};

const MagazineArchives = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState('All');

  useEffect(() => {
    const loadData = async () => {
      try {
        const { fetchApi } = await import('../../lib/api');
        const data = await fetchApi('/articles/?category=Magazine');
        setArticles(data);
      } catch (err) {
        console.error("Error fetching magazine archives:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const years = ['All', ...Array.from(
    new Set(articles.map(a => new Date(a.published_at).getFullYear()))
  ).sort((a, b) => b - a)];

  const filtered = activeYear === 'All'
    ? articles
    : articles.filter(a => new Date(a.published_at).getFullYear() === activeYear);

  const handleRead = (article) => window.open(makeBlobUrl(article.pdf), '_blank');

  const handleDownload = (article) => {
    const a = document.createElement('a');
    a.href = makeBlobUrl(article.pdf);
    a.download = article.pdf_filename || 'magazine.pdf';
    a.click();
  };

  if (loading) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="container-custom text-center py-20 text-gray-400 font-bold">
          Loading archives...
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Magazine Archives</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through our collection of past magazine issues. Relive the milestones and stories that shaped our community.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold">No magazine issues published yet.</p>
          </div>
        ) : (
          <>
            {/* Year filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setActiveYear(year)}
                  className={`px-8 py-2.5 rounded-full font-bold transition-all ${
                    activeYear === year
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>

            {/* Grid */}
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              <AnimatePresence mode="popLayout">
                {filtered.map((article) => (
                  <motion.div
                    key={article.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Cover */}
                    <div className="relative aspect-[3/4] bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex items-center justify-center">
                      {article.image ? (
                        <img
                          src={`data:${article.image_mimetype || 'image/jpeg'};base64,${article.image}`}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-200 p-4">
                          <BookOpen size={40} className="mb-2" />
                          <p className="text-[10px] font-bold text-center text-gray-300">{article.title}</p>
                        </div>
                      )}
                      {article.pdf && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-red-500 text-white flex items-center gap-0.5">
                          <FileText size={8} /> PDF
                        </span>
                      )}
                    </div>

                    <h4 className="mt-3 font-bold text-gray-900 text-center text-sm leading-tight">
                      {article.title}
                    </h4>
                    <p className="text-center text-[10px] text-gray-400 mt-1">
                      {new Date(article.published_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </p>

                    {/* PDF actions — always visible */}
                    {article.pdf && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleRead(article)}
                          className="cursor-pointer flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-primary text-white text-[11px] font-bold hover:bg-primary/90 transition-colors"
                        >
                          <FileText size={11} /> Read
                        </button>
                        <button
                          onClick={() => handleDownload(article)}
                          className="cursor-pointer flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-[11px] font-bold hover:bg-gray-50 transition-colors"
                        >
                          <Download size={11} /> Download
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default MagazineArchives;
