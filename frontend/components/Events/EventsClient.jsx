"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Calendar as CalendarIcon, MapPin, ChevronLeft, ChevronRight, Clock, ExternalLink, CheckCircle, LogIn, Newspaper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { fetchApi } from "../../lib/api";
import { useRouter } from "next/navigation";

import Swal from "sweetalert2";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const isPublicEvent = (event) =>
  event.is_active !== false && new Date(event.event_date) >= new Date();

const todayInputValue = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export default function EventsClient() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [registeringId, setRegisteringId] = useState(null);
  const [confirmingEvent, setConfirmingEvent] = useState(null);
  const [news, setNews] = useState([]);
  
  const { user } = useAuth();
  const router = useRouter();

  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const eventsData = await fetchApi('/events/');
        setEvents(eventsData.filter(isPublicEvent));
        
        const newsData = await fetchApi('/articles/?category=News');
        setNews(newsData);
        
        if (user) {
            const regs = await fetchApi('/event-registrations/');
            setUserRegistrations(regs.filter(r => r.user === user.id).map(r => r.event));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const handleRegister = async () => {
    if (!confirmingEvent) return;
    
    const eventId = confirmingEvent.id;
    setConfirmingEvent(null);
    setRegisteringId(eventId);
    
    try {
        await fetchApi('/event-registrations/', {
            method: 'POST',
            body: JSON.stringify({ event: eventId })
        });
        setUserRegistrations([...userRegistrations, eventId]);
        Swal.fire({
            icon: "success",
            title: "Registered!",
            text: "You have successfully registered for the event.",
            confirmButtonColor: "#EAB308",
        });
    } catch (err) {
        Swal.fire({
            icon: "error",
            title: "Registration Failed",
            text: err.message || "Failed to register for event",
            confirmButtonColor: "#EAB308",
        });
    } finally {
        setRegisteringId(null);
    }
  };

  const isRegistered = (eventId) => userRegistrations.includes(eventId);

  const now = new Date();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  // Filter events based on date range (upcoming only)
  const filteredEvents = events.filter(event => {
    if (!isPublicEvent(event)) return false;

    const eDate = new Date(event.event_date);
    eDate.setHours(0,0,0,0);
    
    if (filterStart) {
      const start = new Date(filterStart);
      start.setHours(0,0,0,0);
      if (eDate < start) return false;
    }
    
    if (filterEnd) {
      const end = new Date(filterEnd);
      end.setHours(23,59,59,999);
      if (eDate > end) return false;
    }
    
    return true;
  });

  // Calendar Helper Functions
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    if (year === now.getFullYear() && month === now.getMonth()) return;
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const minFilterDate = todayInputValue();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Get events for a specific date (within filtered set)
  const getEventsForDate = (day) => {
    return filteredEvents.filter(event => {
      const eDate = new Date(event.event_date);
      return eDate.getDate() === day && eDate.getMonth() === month && eDate.getFullYear() === year;
    });
  };

  const selectedDayEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-primary-dark text-white py-16">
          <div className="px-8">
            <h1 className="text-4xl font-bold mb-4">Community Events Calendar</h1>
            <p className="text-primary-light max-w-2xl">
              Discover and participate in cultural festivals, professional mixers, and community gatherings.
            </p>
          </div>
        </div>

        {/* News Marquee */}
        {news.length > 0 && (
          <div className="bg-white border-b border-gray-200 py-3 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
            <div className="flex animate-marquee whitespace-nowrap w-max">
              {[...news, ...news, ...news].map((item, idx) => (
                <div key={idx} className="flex items-center gap-6 px-12 border-r border-gray-100 group/item">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">Latest News</span>
                  </div>
                  <Link href="/news" className="text-sm font-bold text-gray-700 hover:text-primary transition-all">
                    {item.title}
                  </Link>
                  <span className="text-[10px] text-gray-300 font-medium">
                    {new Date(item.published_at).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Calendar Grid Section */}
            <div className="lg:col-span-8 bg-white rounded-2xl shadow-md p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{monthName} {year}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={prevMonth}
                    disabled={year === now.getFullYear() && month === now.getMonth()}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-xl overflow-hidden">
                {daysOfWeek.map(day => (
                  <div key={day} className="bg-gray-50 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {day}
                  </div>
                ))}

                {/* Empty cells for previous month padding */}
                {[...Array(firstDay)].map((_, i) => (
                  <div key={`empty-${i}`} className="bg-white min-h-[120px] p-2 opacity-50" />
                ))}

                {/* Days of the month */}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const dayEvents = getEventsForDate(day);
                  const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
                  const isSelected = selectedDate === day;
                  const cellDate = new Date(year, month, day);
                  cellDate.setHours(0, 0, 0, 0);
                  const isPastDay = cellDate < new Date(now.getFullYear(), now.getMonth(), now.getDate());

                  return (
                    <div 
                      key={day} 
                      onClick={() => !isPastDay && setSelectedDate(day)}
                      className={`bg-white min-h-[120px] p-2 transition-all relative group ${
                        isPastDay
                          ? 'opacity-40 cursor-not-allowed'
                          : 'cursor-pointer hover:bg-primary-light/30'
                      } ${isSelected ? 'ring-2 ring-primary ring-inset z-10' : ''}`}
                    >
                      <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mb-2 ${isToday ? 'bg-primary text-white' : 'text-gray-700'}`}>
                        {day}
                      </span>
                      <div className="space-y-1">
                        {dayEvents.map((event, idx) => (
                          <div key={idx} className="bg-primary/10 border-l-2 border-primary p-1 text-[10px] text-primary-dark font-bold truncate rounded">
                            {event.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar / Filters & Event Details */}
            <div className="lg:col-span-4 space-y-6">
              {/* Date Filter Card */}
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CalendarIcon size={20} className="text-primary" />
                  Filter by Date
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">From</label>
                    <input 
                      type="date" 
                      value={filterStart}
                      min={minFilterDate}
                      onChange={(e) => setFilterStart(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">To</label>
                    <input 
                      type="date" 
                      value={filterEnd}
                      min={filterStart || minFilterDate}
                      onChange={(e) => setFilterEnd(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  {(filterStart || filterEnd) && (
                    <button 
                      onClick={() => { setFilterStart(""); setFilterEnd(""); }}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Event Details Card */}
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 sticky top-28">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock size={20} className="text-primary" />
                  {selectedDate ? `Events on ${monthName} ${selectedDate}` : "Filtered Events"}
                </h3>

                <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedDate || filterStart || filterEnd || "all"}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      {(selectedDate ? selectedDayEvents : filteredEvents).length > 0 ? (
                        (selectedDate ? selectedDayEvents : filteredEvents).map((event, idx) => (
                          <div key={idx} className="group p-4 border border-gray-100 rounded-xl hover:border-primary transition-all bg-gray-50 hover:bg-white hover:shadow-md">
                            <div className="relative h-32 w-full mb-4 rounded-lg overflow-hidden">
                              <Image 
                                src={event.image ? `data:${event.image_mimetype || 'image/jpeg'};base64,${event.image}` : '/assets/event1.png'} 
                                alt={event.title}
                                fill
                                sizes="400px"
                                className="object-cover"
                              />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{event.title}</h4>
                            <div className="space-y-2 text-xs text-gray-500">
                              <div className="flex items-center gap-2">
                                <CalendarIcon size={14} />
                                {new Date(event.event_date).toLocaleString('default', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin size={14} />
                                {event.location}
                              </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                {isRegistered(event.id) ? (
                                    <div className="flex items-center justify-center gap-2 w-full py-3 bg-green-50 text-green-600 text-xs font-bold rounded-xl border border-green-100">
                                        <CheckCircle size={16} />
                                        Already Registered
                                    </div>
                                ) : user ? (
                                    <button 
                                        onClick={() => setConfirmingEvent(event)}
                                        disabled={registeringId === event.id}
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-all shadow-md shadow-primary/10 disabled:opacity-50"
                                    >
                                        {registeringId === event.id ? "Processing..." : "Register Now"}
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => router.push('/login')}
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 transition-all"
                                    >
                                        <LogIn size={16} />
                                        Login to Register
                                    </button>
                                )}

                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <CalendarIcon size={20} />
                          </div>
                          <p className="text-gray-500 text-sm italic">No events found for this selection.</p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {(selectedDate || filterStart || filterEnd) && (
                  <button 
                    onClick={() => { setSelectedDate(null); setFilterStart(""); setFilterEnd(""); }}
                    className="mt-6 w-full py-3 text-gray-500 hover:text-primary font-bold text-sm border-t border-gray-100"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {confirmingEvent && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setConfirmingEvent(null)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 overflow-hidden text-center"
                >
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                        <CalendarIcon size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Confirm Registration</h3>
                    <p className="text-gray-500 mb-8 font-medium">
                        Are you sure you want to register for <br />
                        <span className="text-gray-900 font-bold">"{confirmingEvent.title}"</span>?
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => setConfirmingEvent(null)}
                            className="py-4 rounded-xl font-bold text-gray-400 hover:bg-gray-50 transition-all border border-gray-100"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleRegister}
                            className="py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                        >
                            Yes, Confirm
                        </button>
                    </div>
                </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
