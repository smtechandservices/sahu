'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../../../lib/api';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AccommodationForm({ searchParams }) {
  const router = useRouter();
  // If searchParams is not available in Next.js 13+ client component easily without useSearchParams
  // let's just make this a simple "New" page or use useSearchParams
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Hostel',
    price: '',
    price_label: 'Starting from',
    unit: '/ month',
    location: '',
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
      } else {
        // Mock image for testing if not provided to pass validation
        // In reality, image is required on backend unless changed
        return setError('Please upload an image.');
      }

      await fetchApi('/accommodations/', {
        method: 'POST',
        body: data, // No JSON.stringify for FormData
      });

      router.push('/admin-panel/accommodations');
    } catch (err) {
      console.error(err);
      setError('Failed to save accommodation. ' + JSON.stringify(err.data || {}));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin-panel/accommodations" className="p-2 hover:bg-gray-200 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Add Accommodation</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700">Title</label>
              <input 
                name="title" value={formData.title} onChange={handleChange} required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700">Description</label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange} required rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Type</label>
              <select 
                name="type" value={formData.type} onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
              >
                <option value="Hostel">Hostel</option>
                <option value="Community Hall">Community Hall</option>
                <option value="Guest Rooms">Guest Rooms</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Location</label>
              <input 
                name="location" value={formData.location} onChange={handleChange} required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Price (₹)</label>
              <input 
                type="number" name="price" value={formData.price} onChange={handleChange} required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Pricing Unit</label>
              <input 
                name="unit" value={formData.unit} onChange={handleChange} placeholder="/ month"
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
              {loading ? 'Saving...' : 'Save Accommodation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
