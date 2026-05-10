'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import { 
  Calendar, Plus, MapPin, Clock, 
  Edit, Trash2, Users, Search
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function EventsManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await fetchApi('/events/');
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Community Events</h1>
          <p className="text-gray-500 font-medium">Create and manage community gatherings, fests, and meetings.</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          Create New Event
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search events by title or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <motion.div 
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setSelectedEvent(event)}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            <div className="h-48 bg-gray-100 relative">
                {event.image && (
                    <img 
                        src={`data:${event.image_mimetype || 'image/jpeg'};base64,${event.image}`} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                )}
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
                    {event.attendee_count} Registered
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-1">{event.title}</h3>
                
                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-500 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-primary">
                            <Calendar size={16} />
                        </div>
                        <span className="font-medium">{new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-primary">
                            <MapPin size={16} />
                        </div>
                        <span className="font-medium truncate">{event.location}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex -space-x-2">
                        {event.recent_registrations?.slice(0, 3).map((reg, i) => (
                            <div key={reg.id} className="w-8 h-8 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary uppercase">
                                {reg.user_detail.name.charAt(0)}
                            </div>
                        ))}
                        {event.attendee_count > 3 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                +{event.attendee_count - 3}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" onClick={(e) => { e.stopPropagation(); }}><Edit size={18} /></button>
                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" onClick={(e) => { e.stopPropagation(); }}><Trash2 size={18} /></button>
                    </div>
                </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Attendee Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setSelectedEvent(null)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
                <div className="p-8 border-b border-gray-100 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">{selectedEvent.title}</h2>
                        <p className="text-gray-500 font-medium">Attendee List ({selectedEvent.attendee_count})</p>
                    </div>
                    <button 
                        onClick={() => setSelectedEvent(null)}
                        className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-all"
                    >
                        ✕
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                    {selectedEvent.recent_registrations?.length > 0 ? (
                        <div className="space-y-6">
                            {selectedEvent.recent_registrations.map((reg) => (
                                <div key={reg.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                            {reg.user_detail.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{reg.user_detail.name}</p>
                                            <p className="text-xs text-gray-400 font-medium">{reg.user_detail.phone}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-6">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">Registered On</p>
                                            <p className="text-xs font-bold text-gray-500">
                                                {new Date(reg.registered_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={async () => {
                                                if (window.confirm(`Are you sure you want to remove ${reg.user_detail.name} from this event?`)) {
                                                    try {
                                                        await fetchApi(`/event-registrations/${reg.id}/`, { method: 'DELETE' });
                                                        // Update local state
                                                        const updatedRegistrations = selectedEvent.recent_registrations.filter(r => r.id !== reg.id);
                                                        const updatedEvent = { 
                                                            ...selectedEvent, 
                                                            recent_registrations: updatedRegistrations,
                                                            attendee_count: selectedEvent.attendee_count - 1 
                                                        };
                                                        setSelectedEvent(updatedEvent);
                                                        // Refresh full list in background
                                                        fetchEvents();
                                                    } catch (err) {
                                                        alert("Failed to remove member");
                                                    }
                                                }
                                            }}
                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Remove from Event"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <Users size={48} className="mx-auto text-gray-200 mb-4" />
                            <p className="text-gray-400 font-bold">No members have registered for this event yet.</p>
                        </div>
                    )}
                </div>

                <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
                    <button className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-white transition-all">
                        Export CSV
                    </button>
                    <button 
                        onClick={() => setSelectedEvent(null)}
                        className="btn-primary"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </div>
      )}
    </div>
  );
}
