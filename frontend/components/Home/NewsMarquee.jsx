"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "../../lib/api";

export default function NewsMarquee() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchApi("/articles/?category=News")
      .then(setNews)
      .catch(() => {});
  }, []);

  if (news.length === 0) return null;

  const items = [...news, ...news, ...news];

  return (
    <div className="bg-primary-dark text-white py-2.5 relative overflow-hidden group">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-primary-dark to-transparent z-10 pointer-events-none" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-primary-dark to-transparent z-10 pointer-events-none" />

      <div className="flex animate-marquee whitespace-nowrap w-max">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-5 px-10 border-r border-white/10"
          >
            {/* Badge */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                Latest News
              </span>
            </div>
            {/* Headline */}
            <span className="text-sm font-semibold text-white/90 hover:text-primary transition-colors cursor-pointer">
              {item.title}
            </span>
            {/* Date */}
            <span className="text-[10px] text-white/30 font-medium shrink-0">
              {new Date(item.published_at).toLocaleDateString("default", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
