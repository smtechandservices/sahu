'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import {
  Home, Plus, Search, Filter,
  MapPin, Edit, Trash2, CheckCircle, Clock, X
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccommodationManager() {
  const [accommodations, setAccommodations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'bookings'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [accData, bookData] = await Promise.all([
        fetchApi('/accommodations/'),
        fetchApi('/bookings/')
      ]);
      setAccommodations(accData);
      setBookings(bookData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await fetchApi(`/bookings/${bookingId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      fetchData(); // Refresh
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Accommodation Management</h1>
          <p className="text-gray-500 font-medium">Manage properties, rooms, and community hall bookings.</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          Add New Property
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-8 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'inventory' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Property Inventory ({accommodations.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-8 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'bookings' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Recent Enquiries ({bookings.length})
        </button>
      </div>

      {activeTab === 'inventory' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accommodations.map((acc) => (
            <div key={acc.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
              <div className="h-48 bg-gray-100 relative">
                {acc.image && (
                  <img
                    src={`data:${acc.image_mimetype || 'image/jpeg'};base64,${acc.image}`}
                    alt={acc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-gray-900">
                  {acc.type}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{acc.title}</h3>
                <p className="text-gray-400 text-sm flex items-center gap-1 mb-4">
                  <MapPin size={14} /> {acc.location}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-primary font-bold">₹{acc.price} <span className="text-[10px] text-gray-400">{acc.unit}</span></span>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"><Edit size={18} /></button>
                    <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Guest</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Property</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Dates</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition-all">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">{booking.user_name || 'Guest'}</p>
                    <p className="text-xs text-gray-400">{booking.user_phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-600">{booking.accommodation_title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-600">{booking.check_in} <span className="text-[10px] text-gray-400">({booking.check_in_time || '12:00'})</span></p>
                    <p className="text-xs text-gray-400">to {booking.check_out} <span className="text-[10px] text-gray-400">({booking.check_out_time || '11:00'})</span></p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-600' :
                        booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                          booking.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {booking.status === 'Pending' ? (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'Confirmed')}
                          className="text-xs font-bold text-green-600 hover:underline flex items-center gap-1"
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'Cancelled')}
                          className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
                        >
                          <X size={14} /> Deny
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300 italic">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
