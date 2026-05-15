"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, Send, CheckCircle2, Clock } from 'lucide-react';
import { fetchApi } from '../../lib/api';

const EnquiryModal = ({ isOpen, onClose, accommodation }) => {
  const [formData, setFormData] = useState({
    check_in: '',
    check_in_time: '12:00',
    check_out: '',
    check_out_time: '11:00',
    guests: 1
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation: Check-out must be after check-in
    const checkIn = new Date(`${formData.check_in}T${formData.check_in_time}`);
    const checkOut = new Date(`${formData.check_out}T${formData.check_out_time}`);

    if (checkOut <= checkIn) {
      setError('Check-out date and time must be after check-in.');
      setLoading(false);
      return;
    }

    try {
      await fetchApi('/bookings/', {
        method: 'POST',
        body: JSON.stringify({
          accommodation: accommodation.id,
          check_in: formData.check_in,
          check_in_time: formData.check_in_time,
          check_out: formData.check_out,
          check_out_time: formData.check_out_time,
          guests: formData.guests
        })
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ check_in: '', check_in_time: '12:00', check_out: '', check_out_time: '11:00', guests: 1 });
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to send enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="text-xl font-black text-gray-900">Send Enquiry</h3>
              <p className="text-xs text-gray-400 mt-1">{accommodation.title}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-8">
            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Enquiry Sent!</h4>
                <p className="text-gray-500">The management will review your request and get back to you soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-100">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar size={12} className="text-primary" /> Check In Date
                      </label>
                      <input 
                        type="date" 
                        required
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={formData.check_in}
                        onChange={(e) => setFormData({...formData, check_in: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={12} className="text-primary" /> Check In Time
                      </label>
                      <input 
                        type="time" 
                        required
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={formData.check_in_time}
                        onChange={(e) => setFormData({...formData, check_in_time: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar size={12} className="text-primary" /> Check Out Date
                      </label>
                      <input 
                        type="date" 
                        required
                        min={formData.check_in}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={formData.check_out}
                        onChange={(e) => setFormData({...formData, check_out: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={12} className="text-primary" /> Check Out Time
                      </label>
                      <input 
                        type="time" 
                        required
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={formData.check_out_time}
                        onChange={(e) => setFormData({...formData, check_out_time: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Users size={12} className="text-primary" /> Number of Guests
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.guests}
                    onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="cursor-pointer w-full btn-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 group transition-all"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Enquiry 
                      <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EnquiryModal;
