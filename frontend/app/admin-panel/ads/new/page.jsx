'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../../../lib/api';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdForm() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    link: '',
    contact_info: '',
    is_active: true,
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (imageFile) {
        data.append('image', imageFile);
      }

      await fetchApi('/career/ads/', {
        method: 'POST',
        body: data, // No JSON.stringify for FormData
      });

      router.push('/admin-panel/jobs');
    } catch (err) {
      console.error(err);
      setError('Failed to save advertisement. ' + JSON.stringify(err.data || {}));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin-panel/jobs" className="p-2 hover:bg-gray-200 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Add Advertisement</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Category / Ad Title</label>
              <input 
                name="title" value={formData.title} onChange={handleChange} required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Business Name</label>
              <input 
                name="company" value={formData.company} onChange={handleChange} required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700">Description</label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange} required rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Action Link (Website URL)</label>
              <input 
                type="url" name="link" value={formData.link} onChange={handleChange} placeholder="https://..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Contact Info (Phone/Email)</label>
              <input 
                name="contact_info" value={formData.contact_info} onChange={handleChange} placeholder="+91..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700">Image Upload</label>
              <input 
                type="file" accept="image/*" onChange={handleImageChange} required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            <div className="space-y-2 md:col-span-2 flex items-center space-x-3">
              <input 
                type="checkbox" name="is_active" id="is_active"
                checked={formData.is_active} onChange={handleChange}
                className="w-5 h-5 text-yellow-500 rounded border-gray-300 focus:ring-yellow-500"
              />
              <label htmlFor="is_active" className="text-sm font-bold text-gray-700 cursor-pointer">Is Active (Visible on site)</label>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button 
              type="submit" disabled={loading}
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Advertisement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
