"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const NewsEvents = () => {
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useLanguage();

  useEffect(() => {
    const loadData = async () => {
      try {
        const { fetchApi } = await import('../../lib/api');
        
        // Fetch News
        const newsData = await fetchApi('/articles/?category=News');
        setNews(newsData.slice(0, 3)); // Only take top 3 news

        // Fetch Events — next 10 upcoming, soonest first
        const eventsData = await fetchApi('/events/');
        const now = new Date();
        setEvents(
          eventsData
            .filter((e) => e.is_active !== false && new Date(e.event_date) >= now)
            .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
            .slice(0, 10)
        );
      } catch (err) {
        console.error("Error fetching news/events:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }).toUpperCase();
  };

  const getTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return t('Today', 'आज');
    if (diffInDays === 1) return t('Yesterday', 'कल');
    if (diffInDays < 7) return t(`${diffInDays} days ago`, `${diffInDays} दिन पहले`);
    return t(`${Math.floor(diffInDays / 7)} weeks ago`, `${Math.floor(diffInDays / 7)} सप्ताह पहले`);
  };

  if (loading) return null;

  return (
    <section className="pb-12 bg-white overflow-hidden">
      <div className="px-4 sm:px-6 md:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Upcoming Events Column - Spans 2/3 on desktop */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">{t('Upcoming Events', 'आगामी कार्यक्रम')}</h2>
              <Link href="/events" className="text-yellow-700 font-bold text-sm hover:underline transition-all">
                {t('View Calendar', 'कैलेंडर देखें')}
              </Link>
            </div>
            
            {/* Scrollable Container - Can scroll across full width on desktop */}
            <div className="flex overflow-x-auto flex-nowrap scrollbar-thin-x gap-6 pb-6 mb-2 snap-x snap-mandatory relative z-0">
              {events.length === 0 ? (
                <p className="text-slate-500 text-sm font-medium py-8">{t('No upcoming events right now.', 'अभी कोई आगामी कार्यक्रम नहीं है।')}</p>
              ) : events.map((event, index) => (
                <div key={index} className="min-w-[280px] sm:min-w-[360px] md:min-w-[450px] bg-[#FFFBF7] rounded-md border border-yellow-200 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col snap-start">
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image 
                      unoptimized
                      src={event.image || '/assets/event1.png'} 
                      alt={event.title} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-yellow-600 font-bold text-xs uppercase mb-4">
                      <Calendar size={14} />
                      {formatDate(event.event_date)}
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-slate-900 group-hover:text-yellow-700 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-1">
                      {event.description}
                    </p>
                    <Link 
                      href='/events'
                      className="mt-auto text-yellow-700 font-bold flex items-center gap-2 group/link"
                    >
                      {t('View Details', 'विवरण देखें')} <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Latest News Column - Positioned to the right */}
          <div className="flex flex-col bg-white z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-8 md:mb-12">{t('Latest News', 'ताज़ा समाचार')}</h2>
            
            <div className="space-y-6 flex-1 bg-white">
              {news.map((item, index) => (
                <div key={index} className="bg-[#FFFBF7] rounded-md p-8 border border-yellow-200 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
                  <div className="text-slate-500 text-sm mb-2 flex items-center gap-2">
                    <span className="font-medium text-slate-700">{item.category}</span>
                    <span>•</span>
                    <span>{getTimeAgo(item.published_at)}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-yellow-700 transition-colors leading-tight">
                    {item.title}
                  </h3>
                </div>
              ))}
            </div>
            
            <Link href="/news" className="w-full mt-10 bg-slate-50 border border-slate-200 py-4 rounded-md font-bold text-slate-700 hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-center">
              {t('View All News', 'सभी समाचार देखें')}
            </Link>
          </div>
          
        </div>
        {/* Subtle gradient overlay to enhance the "scroll under" effect */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[35%] bg-gradient-to-r from-transparent via-white/80 to-white z-[5] pointer-events-none"></div>
      </div>
    </section>
  );
};

export default NewsEvents;
