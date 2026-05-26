"use client";

import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Swal.fire({
        icon: 'success',
        title: 'Message Sent',
        text: 'Thank you! Our support team will get back to you shortly.',
        confirmButtonColor: '#EAB308',
      });
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-[#FFFBF7] to-white pb-20">
        {/* Contact Hero */}
        <section className="py-20 text-center relative overflow-hidden bg-gradient-to-br from-primary-light/40 to-transparent">
          <div className="container-custom max-w-4xl mx-auto px-6 relative z-10">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary font-bold rounded-full text-xs uppercase tracking-wider mb-4">
              Get in Touch
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Contact <span className="text-primary">Support</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Have questions, feedback, or need help? The Sahu Sabha Support Team is here to assist you.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="container-custom max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-4">
          {/* Contact Details (Left) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Connect With Us</h3>
                <p className="text-sm text-gray-500">Reach out directly through any of our channels below.</p>
              </div>

              <div className="space-y-6">
                {[
                  { icon: Mail, label: 'Email Support', val: 'support@sahusabha.org', href: 'mailto:support@sahusabha.org' },
                  { icon: Phone, label: 'Call Support', val: '+91 98765 43210', href: 'tel:+919876543210' },
                  { icon: MapPin, label: 'Headquarters', val: 'Sahu Sabha Digital Heritage, New Delhi, India', href: '#' },
                ].map(({ icon: Icon, label, val, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                      <p className="text-sm font-bold text-gray-800 mt-1">{val}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-primary/20">
              <MessageSquare className="absolute -right-8 -bottom-8 w-40 h-40 opacity-10 pointer-events-none" />
              <h4 className="text-lg font-bold mb-2">Community Helpline</h4>
              <p className="text-sm opacity-90 leading-relaxed mb-6">
                For urgent family assistance, member verification, or event coordination details, call our 24/7 hotline.
              </p>
              <a href="tel:+919876543210" className="inline-block px-6 py-2.5 bg-white text-primary font-bold rounded-xl text-xs hover:bg-gray-50 transition-colors">
                Call Helpline
              </a>
            </div>
          </div>

          {/* Contact Form (Right) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Send a Message</h3>
            <p className="text-sm text-gray-500 mb-8">Fill out the form below and we will respond within 24 hours.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea
                  required
                  rows="5"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-primary/20"
              >
                <Send size={16} />
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
