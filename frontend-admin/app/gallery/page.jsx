'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchApi } from '../../lib/api';
import { Images, Plus, Trash2, Search, X, Upload, Edit, Image, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const EMPTY_FORM = { title: '', media_type: 'gallery', is_active: true, image: null, image_mimetype: null };

const isVideo = (mimetype) => mimetype?.startsWith('video/');
const MAX_VIDEO_MB = 14;
const MAX_IMAGE_MB = 6;

const TYPE_TABS = [
  { key: 'all', label: 'All' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'media', label: 'Media' },
];

const TYPE_BADGE = {
  gallery: { label: 'Gallery', cls: 'bg-emerald-500/80 text-white' },
  media:   { label: 'Media',   cls: 'bg-blue-500/80 text-white' },
};

export default function MediaManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const data = await fetchApi('/media/');
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = items.filter(item => {
    const matchesTab = activeTab === 'all' || item.media_type === activeTab;
    const matchesSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const counts = {
    all: items.length,
    gallery: items.filter(i => i.media_type === 'gallery').length,
    media: items.filter(i => i.media_type === 'media').length,
  };

  const openCreate = () => {
    setEditingItem(null);
    setForm({ ...EMPTY_FORM, media_type: activeTab === 'all' ? 'gallery' : activeTab });
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEdit = (e, item) => {
    e.stopPropagation();
    setEditingItem(item);
    setForm({
      title: item.title || '',
      media_type: item.media_type || 'gallery',
      is_active: item.is_active ?? true,
      image: null,
      image_mimetype: null,
    });
    setImagePreview(item.image_url || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const limitMB = isVideo(file.type) ? MAX_VIDEO_MB : MAX_IMAGE_MB;
    if (file.size > limitMB * 1024 * 1024) {
      Swal.fire({ icon: 'warning', title: 'File Too Large', text: `Max size is ${limitMB}MB for ${isVideo(file.type) ? 'videos' : 'images'}.` });
      return;
    }
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
    if (!editingItem && !form.image) {
      Swal.fire({ icon: 'warning', title: 'File Required', text: 'Please select an image, GIF, or video to upload.' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        media_type: form.media_type,
        is_active: form.is_active,
        ...(form.image && { image: form.image, image_mimetype: form.image_mimetype }),
      };
      if (editingItem) {
        await fetchApi(`/media/${editingItem.id}/`, { method: 'PATCH', body: JSON.stringify(payload) });
      } else {
        await fetchApi('/media/', { method: 'POST', body: JSON.stringify(payload) });
      }
      await fetchItems();
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
      await fetchApi(`/media/${id}/`, { method: 'DELETE' });
      setItems(prev => prev.filter(item => item.id !== id));
    } catch {
      Swal.fire({ icon: 'error', title: 'Delete Failed', text: 'Failed to delete image' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Media</h1>
          <p className="text-gray-500 font-medium">Manage gallery photos, GIFs and videos.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={20} />
          Upload
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl w-fit">
        {TYPE_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-bold ${
              activeTab === tab.key ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-400'
            }`}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
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
        <span className="text-sm font-bold text-gray-400 shrink-0">{filtered.length} images</span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 font-bold">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <Images size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold">No images found.</p>
          <button onClick={openCreate} className="btn-primary mt-4">Upload First Image</button>
        </div>
      ) : (
        /* Pinterest masonry — CSS columns, natural heights */
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5" style={{ columnGap: '10px' }}>
          {filtered.map(item => {
            const badge = TYPE_BADGE[item.media_type] || TYPE_BADGE.gallery;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="break-inside-avoid mb-[10px] group relative hover:z-10 rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                {/* Natural-height media — image or video */}
                {isVideo(item.image_mimetype) ? (
                  <video
                    src={item.image_url}
                    className="w-full h-auto block"
                    muted loop playsInline
                    onMouseEnter={e => e.currentTarget.play()}
                    onMouseLeave={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                  />
                ) : (
                  <img
                    src={item.image_url}
                    alt={item.title || 'Image'}
                    className="w-full h-auto block group-hover:scale-[1.03] transition-transform duration-500"
                  />
                )}

                {/* Hover overlay with actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors duration-300 rounded-2xl" />

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2.5">
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={(e) => openEdit(e, item)}
                      className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/35 backdrop-blur-sm flex items-center justify-center text-white transition-all"
                    >
                      <Edit size={13} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      disabled={deletingId === item.id}
                      className="w-8 h-8 rounded-xl bg-red-500/80 hover:bg-red-500 backdrop-blur-sm flex items-center justify-center text-white transition-all disabled:opacity-40"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  {item.title && (
                    <p className="text-white text-[11px] font-bold line-clamp-2 leading-tight">{item.title}</p>
                  )}
                </div>

                {/* Type badge */}
                <div className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${badge.cls}`}>
                  {badge.label}
                </div>
                {isVideo(item.image_mimetype) && (
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    ▶ Video
                  </div>
                )}

                {!item.is_active && (
                  <div className="absolute top-2 right-2 bg-gray-800/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Hidden
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal */}
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
                  {editingItem ? 'Edit' : 'Upload'}
                </h2>
                <button onClick={closeModal} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-all">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5">
                {/* Image upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    File {!editingItem && <span className="text-red-400">*</span>}
                  </label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="w-full h-52 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all overflow-hidden"
                  >
                    {imagePreview ? (
                      isVideo(form.image_mimetype) ? (
                        <video src={imagePreview} className="w-full h-full object-cover" muted autoPlay loop playsInline />
                      ) : (
                        <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                      )
                    ) : (
                      <div className="text-center text-gray-400">
                        <Upload size={28} className="mx-auto mb-2" />
                        <p className="text-sm font-medium">Click to upload</p>
                        <p className="text-xs mt-1 text-gray-300">Image, GIF or Video (max {MAX_VIDEO_MB}MB)</p>
                      </div>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*,video/mp4,video/webm,video/mov" className="hidden" onChange={handleImageChange} />
                </div>

                {/* Title */}
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

                {/* Type selector */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'gallery', label: 'Gallery', desc: 'Community moments & events', icon: Image },
                      { key: 'media',   label: 'Media',   desc: 'Official media & press',   icon: Film  },
                    ].map(({ key, label, desc, icon: Icon }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, media_type: key }))}
                        className={`flex flex-col items-start gap-1 p-3 rounded-2xl border-2 transition-all text-left ${
                          form.media_type === key
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          form.media_type === key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Icon size={16} />
                        </div>
                        <p className="font-bold text-sm text-gray-800">{label}</p>
                        <p className="text-[11px] text-gray-400 leading-tight">{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visibility toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <p className="font-bold text-gray-800 text-sm">Visible to public</p>
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
                  <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                    {saving ? 'Saving...' : editingItem ? 'Save Changes' : 'Upload'}
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
