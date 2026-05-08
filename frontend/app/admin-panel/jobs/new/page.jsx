'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../../../lib/api';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function JobForm() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    type: 'Full-time',
    location: '',
    description: '',
    apply_link: '',
    is_active: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await fetchApi('/career/jobs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      router.push('/admin-panel/jobs');
    } catch (err) {
      console.error(err);
      setError('Failed to save job. ' + JSON.stringify(err.data || {}));
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
        <h2 className="text-2xl font-bold text-gray-900">Add New Job</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700">Job Title</label>
              <input 
                name="title" value={formData.title} onChange={handleChange} required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Company Name</label>
              <input 
                name="company" value={formData.company} onChange={handleChange} required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Job Type</label>
              <select 
                name="type" value={formData.type} onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700">Location</label>
              <input 
                name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Mumbai, MH"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700">Description / Requirements</label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange} required rows={5}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700">Application Link (Optional)</label>
              <input 
                type="url" name="apply_link" value={formData.apply_link} onChange={handleChange} placeholder="https://..."
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
              {loading ? 'Saving...' : 'Save Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
