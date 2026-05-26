'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchApi } from '../../lib/api';
import { Images, Plus, Trash2, Search, X, Upload, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const EMPTY_FORM = { title: '', is_active: true, image: null, image_mimetype: null };

export default function GalleryManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => { fetchImages(); }, []);

  const fetchImages = async () => {
    try {
      const data = await fetchApi('/gallery/');
      setImages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = images.filter(img =>
    !searchQuery || img.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreate = () => {
    setEditingImage(null);
    setForm(EMPTY_FORM);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEdit = (e, img) => {
    e.stopPropagation();
    setEditingImage(img);
    setForm({ title: img.title || '', is_active: img.is_active ?? true, image: null, image_mimetype: null });
    setImagePreview(img.image ? `data:${img.image_mimetype || 'image/jpeg'};base64,${img.image}` : null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingImage(null);
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
      setForm(f => ({ ...f, image: base64.split('base64,')[1], image_mimetype: file.type }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingImage && !form.image) {
      Swal.fire({ icon: 'warning', title: 'Image Required', text: 'Please select an image to upload.' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        is_active: form.is_active,
        ...(form.image && { image: form.image, image_mimetype: form.image_mimetype }),
      };
      if (editingImage) {
        await fetchApi(`/gallery/${editingImage.id}/`, { method: 'PATCH', body: JSON.stringify(payload) });
      } else {
        await fetchApi('/gallery/', { method: 'POST', body: JSON.stringify(payload) });
      }
      await fetchImages();
      closeModal();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Save Failed', text: err.message || 'Failed to save image' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: 'Delete image?',
      text: 'This cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Delete',
    });
    if (!result.isConfirmed) return;
    setDeletingId(id);
    try {
      await fetchApi(`/gallery/${id}/`, { method: 'DELETE' });
      setImages(prev => prev.filter(img => img.id !== id));
    } catch {
      Swal.fire({ icon: 'error', title: 'Delete Failed', text: 'Failed to delete image' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Gallery</h1>
          <p className="text-gray-500 font-medium">Manage community photo gallery images.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={20} />
          Upload Image
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        <span className="text-sm font-bold text-gray-400 shrink-0">{images.length} images</span>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400 font-bold">Loading gallery...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <Images size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold">No images found.</p>
          <button onClick={openCreate} className="btn-primary mt-4">Upload First Image</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(img => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all bg-gray-100"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={`data:${img.image_mimetype || 'image/jpeg'};base64,${img.image}`}
                  alt={img.title || 'Gallery image'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={(e) => openEdit(e, img)}
                    className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, img.id)}
                    disabled={deletingId === img.id}
                    className="w-8 h-8 rounded-lg bg-red-500/80 hover:bg-red-500 backdrop-blur-sm flex items-center justify-center text-white transition-all disabled:opacity-40"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                {img.title && (
                  <p className="text-white text-xs font-bold truncate">{img.title}</p>
                )}
              </div>

              {!img.is_active && (
                <div className="absolute top-2 left-2 bg-gray-800/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Hidden
                </div>
              )}
            </motion.div>
          ))}
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
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-black text-gray-900">
                  {editingImage ? 'Edit Image' : 'Upload Image'}
                </h2>
                <button onClick={closeModal} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-all">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Image {!editingImage && <span className="text-red-400">*</span>}
                  </label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="w-full h-52 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all overflow-hidden"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-gray-400">
                        <Upload size={28} className="mx-auto mb-2" />
                        <p className="text-sm font-medium">Click to upload</p>
                      </div>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Annual Day 2025"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Visible to public</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                    className={`w-12 h-6 rounded-full transition-all duration-300 relative ${form.is_active ? 'bg-primary' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${form.is_active ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">
                    {saving ? 'Saving...' : editingImage ? 'Save Changes' : 'Upload'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
