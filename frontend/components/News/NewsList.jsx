"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, ArrowRight } from "lucide-react";

const NewsList = ({ searchQuery }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { fetchApi } = await import("../../lib/api");
        const data = await fetchApi("/articles/?category=News");
        setArticles(data);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <section className="section-padding bg-white">
      <div className="px-8 space-y-12">

        {loading ? (
          <div className="py-32 text-center text-gray-400 font-semibold">Loading news...</div>
        ) : filtered.length === 0 ? (
          <div className="py-32 text-center">
            <p className="text-gray-400 font-semibold text-lg">No news articles found.</p>
            {searchQuery && (
              <p className="mt-2 text-sm text-gray-400">Try a different search term.</p>
            )}
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featured && !searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedArticle(featured)}
                className="group cursor-pointer grid md:grid-cols-2 gap-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl overflow-hidden border border-yellow-100 hover:shadow-xl transition-all"
              >
                <div className="relative aspect-[4/3] md:aspect-auto min-h-64 overflow-hidden">
                  <Image
                    src={
                      featured.image
                        ? `data:${featured.image_mimetype || "image/jpeg"};base64,${featured.image}`
                        : "/assets/event1.png"
                    }
                    alt={featured.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex flex-col justify-center p-8 md:p-10">
                  <span className="inline-block px-3 py-1 bg-yellow-200 text-yellow-800 text-[10px] font-black uppercase tracking-widest rounded-full mb-4 w-fit">
                    Featured
                  </span>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                    <Calendar size={13} />
                    <span>{formatDate(featured.published_at)}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 group-hover:text-primary transition-colors leading-tight mb-4">
                    {featured.title}
                  </h2>
                  <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-6">
                    {featured.content}
                  </p>
                  <span className="flex items-center gap-2 text-primary font-bold text-sm">
                    Read Full Story <ArrowRight size={16} />
                  </span>
                </div>
              </motion.div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(searchQuery ? filtered : rest).map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  viewport={{ once: true }}
                  onClick={() => setSelectedArticle(article)}
                  className="group cursor-pointer bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-gray-50">
                    <Image
                      src={
                        article.image
                          ? `data:${article.image_mimetype || "image/jpeg"};base64,${article.image}`
                          : "/assets/event1.png"
                      }
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      <Calendar size={12} />
                      <span>{formatDate(article.published_at)}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                      {article.content}
                    </p>
                    <span className="mt-4 flex items-center gap-1 text-primary text-xs font-bold">
                      Read more <ArrowRight size={12} />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-900 shadow-md transition-all"
              >
                <X size={18} />
              </button>

              {selectedArticle.image && (
                <div className="relative h-56 md:h-72 shrink-0 overflow-hidden">
                  <Image
                    src={`data:${selectedArticle.image_mimetype || "image/jpeg"};base64,${selectedArticle.image}`}
                    alt={selectedArticle.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 672px"
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-yellow-100 text-yellow-700">
                    News
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar size={12} />
                    {formatDate(selectedArticle.published_at)}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 leading-tight">
                  {selectedArticle.title}
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                  {selectedArticle.content}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default NewsList;
