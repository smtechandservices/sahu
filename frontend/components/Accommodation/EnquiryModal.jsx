"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, Send, CheckCircle2, Clock, GraduationCap, Phone, User } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { useLanguage } from '../../context/LanguageContext';

const EnquiryModal = ({ isOpen, onClose, accommodation }) => {
  const isHostel = accommodation?.type === 'Hostel';
  const { t, tv } = useLanguage();

  const [formData, setFormData] = useState({
    check_in: '',
    check_in_time: '12:00',
    check_out: '',
    check_out_time: '11:00',
    guests: 1,
    student_name: '',
    institution_type: 'College',
    institution_name: '',
    guardian_name: '',
    guardian_contact: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const checkIn = new Date(`${formData.check_in}T${formData.check_in_time}`);
    const checkOut = new Date(`${formData.check_out}T${formData.check_out_time}`);

    if (checkOut <= checkIn) {
      setError(t('Check-out date and time must be after check-in.', 'चेक-आउट की तारीख और समय चेक-इन के बाद होना चाहिए।'));
      setLoading(false);
      return;
    }

    const payload = {
      accommodation: accommodation.id,
      check_in: formData.check_in,
      check_in_time: formData.check_in_time,
      check_out: formData.check_out,
      check_out_time: formData.check_out_time,
      guests: formData.guests,
    };

    if (isHostel) {
      payload.student_name = formData.student_name;
      payload.institution_type = formData.institution_type;
      payload.institution_name = formData.institution_name;
      payload.guardian_name = formData.guardian_name;
      payload.guardian_contact = formData.guardian_contact;
    }

    try {
      await fetchApi('/bookings/', { method: 'POST', body: JSON.stringify(payload) });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          check_in: '', check_in_time: '12:00', check_out: '', check_out_time: '11:00', guests: 1,
          student_name: '', institution_type: 'College', institution_name: '', guardian_name: '', guardian_contact: '',
        });
      }, 3000);
    } catch (err) {
      setError(err.message || t('Failed to send enquiry. Please try again.', 'पूछताछ भेजी नहीं जा सकी। कृपया फिर से प्रयास करें।'));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1100] flex items-start justify-center p-4 pt-6 bg-black/40 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="text-xl font-black text-gray-900">{t('Send Enquiry', 'पूछताछ भेजें')}</h3>
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
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{t('Enquiry Sent!', 'पूछताछ भेज दी गई!')}</h4>
                <p className="text-gray-500">{t('The management will review your request and get back to you soon.', 'प्रबंधन आपके अनुरोध की समीक्षा कर जल्द ही आपसे संपर्क करेगा।')}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-100">
                    {error}
                  </div>
                )}

                {/* Stay dates */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar size={12} className="text-primary" /> {t('Check In Date', 'चेक-इन तारीख')}
                      </label>
                      <input
                        type="date"
                        required
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={formData.check_in}
                        onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={12} className="text-primary" /> {t('Check In Time', 'चेक-इन समय')}
                      </label>
                      <input
                        type="time"
                        required
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={formData.check_in_time}
                        onChange={(e) => setFormData({ ...formData, check_in_time: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar size={12} className="text-primary" /> {t('Check Out Date', 'चेक-आउट तारीख')}
                      </label>
                      <input
                        type="date"
                        required
                        min={formData.check_in}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={formData.check_out}
                        onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={12} className="text-primary" /> {t('Check Out Time', 'चेक-आउट समय')}
                      </label>
                      <input
                        type="time"
                        required
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={formData.check_out_time}
                        onChange={(e) => setFormData({ ...formData, check_out_time: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Users size={12} className="text-primary" /> {t('Number of Guests', 'अतिथियों की संख्या')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                  />
                </div>

                {/* Hostel student details */}
                {isHostel && (
                  <div className="space-y-4 pt-2 border-t border-gray-100">
                    <p className="text-[11px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                      <GraduationCap size={13} /> {t('Student Details', 'छात्र विवरण')}
                    </p>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <User size={12} className="text-primary" /> {t('Student Full Name', 'छात्र का पूरा नाम')}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t("Enter student's full name", 'छात्र का पूरा नाम लिखें')}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={formData.student_name}
                        onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {t('Institution Type', 'संस्थान का प्रकार')}
                        </label>
                        <select
                          required
                          className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          value={formData.institution_type}
                          onChange={(e) => setFormData({ ...formData, institution_type: e.target.value })}
                        >
                          <option value="School">{tv('School')}</option>
                          <option value="College">{tv('College')}</option>
                          <option value="University">{tv('University')}</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {t('Institution Name', 'संस्थान का नाम')}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={t('School / College name', 'विद्यालय / महाविद्यालय का नाम')}
                          className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          value={formData.institution_name}
                          onChange={(e) => setFormData({ ...formData, institution_name: e.target.value })}
                        />
                      </div>
                    </div>

                    <p className="text-[11px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 pt-1">
                      <Phone size={13} /> {t('Guardian Details', 'अभिभावक विवरण')}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {t('Guardian Name', 'अभिभावक का नाम')}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={t("Guardian's full name", 'अभिभावक का पूरा नाम')}
                          className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          value={formData.guardian_name}
                          onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {t('Guardian Contact', 'अभिभावक का संपर्क')}
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          value={formData.guardian_contact}
                          onChange={(e) => setFormData({ ...formData, guardian_contact: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer w-full btn-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 group transition-all"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {t('Send Enquiry', 'पूछताछ भेजें')}
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
