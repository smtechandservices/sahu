'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchApi } from '../../lib/api';
import {
  BookOpen, Plus, Search, Edit, Trash2,
  X, Image as ImageIcon, Tag, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Magazine', 'News', 'Community', 'Health', 'Culture'];

const emptyForm = {
  title: '', content: '', category: 'News',
  image: null, image_mimetype: '', is_published: true,
};

export default function MagazineManager() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previewArticle, setPreviewArticle] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => { fetchArticles(); }, []);

  const fetchArticles = async () => {
    try {
      const data = await fetchApi('/articles/');
      setArticles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingArticle(null);
    setForm(emptyForm);
    setPreview(null);
    setShowModal(true);
  };

  const openEdit = (article) => {
    setEditingArticle(article);
    setForm({
      title: article.title,
      content: article.content,
      category: article.category,
      image: article.image || null,
      image_mimetype: article.image_mimetype || '',
      is_published: article.is_published,
    });
    setPreview(article.image
      ? `data:${article.image_mimetype || 'image/jpeg'};base64,${article.image}`
      : null
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingArticle(null);
    setPreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setPreview(base64);
      const b64data = base64.split('base64,')[1];
      setForm(f => ({ ...f, image: b64data, image_mimetype: file.type }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      content: form.content,
      category: form.category,
      is_published: form.is_published,
      ...(form.image && { image: form.image, image_mimetype: form.image_mimetype }),
    };
    try {
      if (editingArticle) {
        await fetchApi(`/articles/${editingArticle.id}/`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await fetchApi('/articles/', { method: 'POST', body: JSON.stringify(payload) });
      }
      await fetchArticles();
      closeModal();
    } catch (err) {
      alert(err.message || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article permanently?')) return;
    setDeletingId(id);
    try {
      await fetchApi(`/articles/${id}/`, { method: 'DELETE' });
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      alert('Failed to delete article');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = articles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCategory === 'All' || a.category === filterCategory;
    return matchSearch && matchCat;
  });

  const catColor = {
    'Magazine': 'bg-indigo-100 text-indigo-700',
    'News': 'bg-yellow-100 text-yellow-700',
    'Community': 'bg-green-100 text-green-700',
    'Health': 'bg-red-100 text-red-700',
    'Culture': 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Magazine &amp; News</h1>
          <p className="text-gray-500 font-medium">Publish articles, community news, and magazine content.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={18} /> New Article
        </button>
      </div>

      {/* Category Stats */}
      <div className="flex flex-wrap gap-3">
        {['All', ...CATEGORIES].map(cat => {
          const count = cat === 'All' ? articles.length : articles.filter(a => a.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                filterCategory === cat
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-100 bg-white text-gray-500 hover:border-primary/30'
              }`}
            >
              {cat} <span className="ml-1.5 text-xs font-black opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text" placeholder="Search articles..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="input-field pl-12"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 font-bold">Loading articles...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
          <BookOpen size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold">No articles found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(article => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all flex flex-col"
            >
              {/* Thumbnail */}
              <div className="h-44 bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden flex items-center justify-center">
                {article.image ? (
                  <img
                    src={`data:${article.image_mimetype || 'image/jpeg'};base64,${article.image}`}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <ImageIcon size={40} className="text-gray-200" />
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${catColor[article.category] || 'bg-gray-100 text-gray-600'}`}>
                    {article.category}
                  </span>
                  {!article.is_published && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-gray-800 text-white">
                      Draft
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2">
                  {new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-3 flex-1">{article.content}</p>

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                  <button
                    onClick={() => setPreviewArticle(article)}
                    className="flex-1 py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-1"
                  >
                    <Eye size={13} /> Preview
                  </button>
                  <button
                    onClick={() => openEdit(article)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    disabled={deletingId === article.id}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
            >
              <div className="p-7 border-b border-gray-100 flex items-center justify-between shrink-0">
                <h2 className="text-2xl font-black text-gray-900">
                  {editingArticle ? 'Edit Article' : 'New Article'}
                </h2>
                <button onClick={closeModal} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-7 space-y-5">
                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cover Image</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative h-44 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer overflow-hidden flex items-center justify-center"
                  >
                    {preview ? (
                      <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <ImageIcon size={32} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-xs font-bold text-gray-400">Click to upload image</p>
                      </div>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Title *</label>
                    <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                      className="input-field" placeholder="Article headline..." />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category *</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="flex items-center gap-3 self-end pb-1">
                    <button type="button" onClick={() => setForm({ ...form, is_published: !form.is_published })}
                      className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${form.is_published ? 'bg-primary' : 'bg-gray-200'}`}>
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.is_published ? 'left-6' : 'left-0.5'}`} />
                    </button>
                    <label className="text-sm font-bold text-gray-700">Published</label>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Content *</label>
                    <textarea required rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                      className="input-field resize-none" placeholder="Write the article content here..." />
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={closeModal}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="flex-1 btn-primary rounded-xl py-3 disabled:opacity-60">
                    {saving ? 'Publishing...' : editingArticle ? 'Save Changes' : 'Publish Article'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setPreviewArticle(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {previewArticle.image && (
                <div className="h-56 shrink-0 overflow-hidden">
                  <img
                    src={`data:${previewArticle.image_mimetype || 'image/jpeg'};base64,${previewArticle.image}`}
                    alt={previewArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${catColor[previewArticle.category] || 'bg-gray-100 text-gray-600'}`}>
                    {previewArticle.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(previewArticle.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-6">{previewArticle.title}</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{previewArticle.content}</p>
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-3">
                <button onClick={() => { setPreviewArticle(null); openEdit(previewArticle); }}
                  className="flex-1 btn-primary rounded-xl py-3">
                  <Edit size={16} /> Edit Article
                </button>
                <button onClick={() => setPreviewArticle(null)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
