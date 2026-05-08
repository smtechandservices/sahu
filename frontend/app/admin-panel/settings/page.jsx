'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../../lib/api';

export default function SettingsAdmin() {
  const [formData, setFormData] = useState({
    site_name: '',
    contact_email: '',
    contact_phone: '',
    hero_title: '',
    hero_subtitle: '',
    about_text: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await fetchApi('/core/settings/');
      setFormData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      await fetchApi('/core/settings/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setMessage('Settings updated successfully!');
    } catch (err) {
      setMessage('Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Site Settings</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {message && (
            <div className={`p-4 rounded-lg font-medium ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message}
            </div>
          )}

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">General Info</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Site Name</label>
                <input 
                  name="site_name" value={formData.site_name} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Contact Email</label>
                <input 
                  name="contact_email" value={formData.contact_email} onChange={handleChange} type="email"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Contact Phone</label>
                <input 
                  name="contact_phone" value={formData.contact_phone} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Homepage Content</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Hero Title</label>
                <input 
                  name="hero_title" value={formData.hero_title} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Hero Subtitle</label>
                <input 
                  name="hero_subtitle" value={formData.hero_subtitle} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">About Section Text</label>
                <textarea 
                  name="about_text" value={formData.about_text} onChange={handleChange} rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button 
              type="submit" disabled={saving}
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-xl transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
