'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchApi } from '../../lib/api';
import {
  Plus, MapPin, Edit, Trash2, CheckCircle, X, Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ACCOMMODATION_TYPES = ['Hostel', 'Community Hall', 'Guest Rooms'];

const EMPTY_FORM = {
  title: '',
  description: '',
  type: 'Hostel',
  badge: '',
  price: '',
  unit: '/ night',
  location: '',
  is_active: true,
  image: null,
  image_mimetype: null,
};

export default function AccommodationManager() {
  const [accommodations, setAccommodations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAcc, setEditingAcc] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [accData, bookData] = await Promise.all([
        fetchApi('/accommodations/'),
        fetchApi('/bookings/'),
      ]);
      setAccommodations(accData);
      setBookings(bookData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingAcc(null);
    setForm(EMPTY_FORM);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEdit = (e, acc) => {
    e.stopPropagation();
    setEditingAcc(acc);
    setForm({
      title: acc.title || '',
      description: acc.description || '',
      type: acc.type || 'Hostel',
      badge: acc.badge || '',
      price: acc.price != null ? String(acc.price) : '',
      unit: acc.unit || '/ night',
      location: acc.location || '',
      is_active: acc.is_active ?? true,
      image: acc.image || null,
      image_mimetype: acc.image_mimetype || null,
    });
    setImagePreview(
      acc.image ? `data:${acc.image_mimetype || 'image/jpeg'};base64,${acc.image}` : null
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingAcc(null);
    setForm(EMPTY_FORM);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setImagePreview(base64);
      const b64data = base64.split('base64,')[1];
      setForm((f) => ({ ...f, image: b64data, image_mimetype: file.type }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingAcc && !form.image) {
      alert('Please upload a property image.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        type: form.type,
        badge: form.badge || null,
        price: form.price,
        unit: form.unit,
        location: form.location,
        is_active: form.is_active,
        ...(form.image && { image: form.image, image_mimetype: form.image_mimetype }),
      };

      if (editingAcc) {
        await fetchApi(`/accommodations/${editingAcc.id}/`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchApi('/accommodations/', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      await fetchData();
      closeModal();
    } catch (err) {
      alert(err.message || 'Failed to save property');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this property? Existing bookings linked to it will also be removed.')) return;
    setDeletingId(id);
    try {
      await fetchApi(`/accommodations/${id}/`, { method: 'DELETE' });
      setAccommodations((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete property');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await fetchApi(`/bookings/${bookingId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Accommodation Management</h1>
          <p className="text-gray-500 font-medium">Manage properties, rooms, and community hall bookings.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={20} />
          Add New Property
        </button>
      </div>

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
        loading ? (
          <div className="py-20 text-center text-gray-400 font-bold">Loading properties...</div>
        ) : accommodations.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-400 font-bold">No properties yet. Add your first one.</p>
          </div>
        ) : (
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
                  {!acc.is_active && (
                    <div className="absolute top-4 left-4 bg-gray-700 text-white px-3 py-1 rounded-full text-[10px] font-bold">
                      Inactive
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{acc.title}</h3>
                  <p className="text-gray-400 text-sm flex items-center gap-1 mb-4">
                    <MapPin size={14} /> {acc.location}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-primary font-bold">
                      ₹{acc.price} <span className="text-[10px] text-gray-400">{acc.unit}</span>
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                        onClick={(e) => openEdit(e, acc)}
                        title="Edit Property"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40"
                        onClick={(e) => handleDelete(e, acc.id)}
                        disabled={deletingId === acc.id}
                        title="Delete Property"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
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
                    <p className="text-sm font-medium text-gray-600">
                      {booking.check_in}{' '}
                      <span className="text-[10px] text-gray-400">({booking.check_in_time || '12:00'})</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      to {booking.check_out}{' '}
                      <span className="text-[10px] text-gray-400">({booking.check_out_time || '11:00'})</span>
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                        booking.status === 'Confirmed'
                          ? 'bg-green-100 text-green-600'
                          : booking.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-600'
                            : booking.status === 'Cancelled'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-gray-100 text-gray-600'
                      }`}
                    >
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

      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-2xl font-black text-gray-900">
                  {editingAcc ? 'Edit Property' : 'Add New Property'}
                </h2>
                <button
                  onClick={closeModal}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Property Image {!editingAcc && <span className="text-red-400">*</span>}
                  </label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="w-full h-40 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all overflow-hidden relative"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-gray-400">
                        <Upload size={28} className="mx-auto mb-2" />
                        <p className="text-sm font-medium">Click to upload image</p>
                      </div>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Property title"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Describe the property..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Type <span className="text-red-400">*</span>
                    </label>
                    <select
                      required
                      value={form.type}
                      onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                      {ACCOMMODATION_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Badge</label>
                    <input
                      type="text"
                      value={form.badge}
                      onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                      placeholder="e.g. Popular, Budget"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Price <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                      placeholder="450"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Unit</label>
                    <input
                      type="text"
                      value={form.unit}
                      onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                      placeholder="/ night"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Location <span className="text-red-400">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="City or area"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Active</p>
                    <p className="text-xs text-gray-400">Visible on the public site</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                    className={`w-12 h-6 rounded-full transition-all duration-300 relative ${form.is_active ? 'bg-primary' : 'bg-gray-300'}`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${form.is_active ? 'left-7' : 'left-1'}`}
                    />
                  </button>
                </div>
              </form>

              <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-white transition-all"
                >
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">
                  {saving ? 'Saving...' : editingAcc ? 'Save Changes' : 'Create Property'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
