'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchApi } from '../../lib/api';
import {
  BookOpen, Search, Edit, Trash2,
  X, Eye, Upload, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const emptyForm = {
  title: '', content: '', category: 'Magazine',
  image: null, image_mimetype: '',
  pdf: null, pdf_filename: '',
  is_published: true,
};

export default function MagazineManager() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previewArticle, setPreviewArticle] = useState(null);
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  useEffect(() => { fetchArticles(); }, []);

  const fetchArticles = async () => {
    try {
      const data = await fetchApi('/articles/');
      setArticles(data.filter(a => a.category === 'Magazine'));
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
      category: 'Magazine',
      image: article.image || null,
      image_mimetype: article.image_mimetype || '',
      pdf: article.pdf || null,
      pdf_filename: article.pdf_filename || '',
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

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64data = reader.result.split('base64,')[1];
      setForm(f => ({ ...f, pdf: b64data, pdf_filename: file.name }));
    };
    reader.readAsDataURL(file);
  };

  const openPdfBlob = (b64data) => {
    const binary = atob(b64data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'application/pdf' });
    window.open(URL.createObjectURL(blob), '_blank');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      content: form.content,
      category: 'Magazine',
      is_published: form.is_published,
      ...(form.image && { image: form.image, image_mimetype: form.image_mimetype }),
      ...(form.pdf && { pdf: form.pdf, pdf_filename: form.pdf_filename }),
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
      alert(err.message || 'Failed to save magazine');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this magazine permanently?')) return;
    setDeletingId(id);
    try {
      await fetchApi(`/articles/${id}/`, { method: 'DELETE' });
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      alert('Failed to delete magazine');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Magazine</h1>
          <p className="text-gray-500 font-medium">Upload and manage magazine issues.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Upload size={18} /> Upload Magazine
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <BookOpen size={20} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">{articles.length}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Issues</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <Eye size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">{articles.filter(a => a.is_published).length}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Published</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text" placeholder="Search magazines..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="input-field pl-12"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 font-bold">Loading magazines...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
          <BookOpen size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold">No magazines uploaded yet.</p>
          <button onClick={openCreate} className="mt-6 btn-primary">
            <Upload size={16} /> Upload First Magazine
          </button>
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
              <div className="h-52 bg-gradient-to-br from-indigo-50 to-gray-50 relative overflow-hidden flex items-center justify-center">
                {article.image ? (
                  <img
                    src={`data:${article.image_mimetype || 'image/jpeg'};base64,${article.image}`}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-center">
                    <FileText size={48} className="mx-auto text-indigo-200 mb-2" />
                    <p className="text-xs font-bold text-indigo-300">No Cover</p>
                  </div>
                )}
                {!article.is_published && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-gray-800 text-white">
                    Draft
                  </span>
                )}
                {article.pdf && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-red-500 text-white flex items-center gap-1">
                    <FileText size={10} /> PDF
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2">
                  {new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
                {article.content && (
                  <p className="text-xs text-gray-400 line-clamp-2 flex-1">{article.content}</p>
                )}
                {article.pdf_filename && (
                  <p className="text-[10px] text-red-400 font-bold mt-1 flex items-center gap-1">
                    <FileText size={10} /> {article.pdf_filename}
                  </p>
                )}

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                  <button
                    onClick={() => setPreviewArticle(article)}
                    className="flex-1 py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-1"
                  >
                    <Eye size={13} /> Preview
                  </button>
                  {article.pdf && (
                    <button
                      onClick={() => openPdfBlob(article.pdf)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="View PDF"
                    >
                      <FileText size={16} />
                    </button>
                  )}
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

      {/* Upload / Edit Modal */}
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
                  {editingArticle ? 'Edit Magazine' : 'Upload Magazine'}
                </h2>
                <button onClick={closeModal} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-7 space-y-5">
                {/* Cover Image Upload */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cover Image</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative h-52 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer overflow-hidden flex items-center justify-center"
                  >
                    {preview ? (
                      <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <Upload size={32} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-xs font-bold text-gray-400">Click to upload cover image</p>
                        <p className="text-[10px] text-gray-300 mt-1">PNG, JPG, WEBP supported</p>
                      </div>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>

                {/* PDF Upload */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Magazine PDF</label>
                  <div
                    onClick={() => pdfInputRef.current?.click()}
                    className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer flex items-center gap-4 px-5 py-4
                      ${form.pdf_filename ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-red-300 hover:bg-red-50/40'}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                      <FileText size={20} className="text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {form.pdf_filename ? (
                        <>
                          <p className="text-sm font-bold text-gray-800 truncate">{form.pdf_filename}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Click to replace</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-bold text-gray-400">Click to upload PDF</p>
                          <p className="text-[10px] text-gray-300 mt-0.5">PDF files only</p>
                        </>
                      )}
                    </div>
                    {form.pdf_filename && (
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, pdf: null, pdf_filename: '' })); }}
                        className="w-7 h-7 rounded-full bg-red-200 hover:bg-red-300 flex items-center justify-center text-red-600 transition-all shrink-0"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                  <input ref={pdfInputRef} type="file" accept="application/pdf" className="hidden" onChange={handlePdfChange} />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Magazine Title *</label>
                  <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="input-field" placeholder="e.g. Sahu Monthly — May 2026" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description *</label>
                  <textarea required rows={4} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                    className="input-field resize-none" placeholder="Brief description of this issue..." />
                </div>

                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setForm({ ...form, is_published: !form.is_published })}
                    className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${form.is_published ? 'bg-primary' : 'bg-gray-200'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.is_published ? 'left-6' : 'left-0.5'}`} />
                  </button>
                  <label className="text-sm font-bold text-gray-700">Published</label>
                </div>

                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={closeModal}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="flex-1 btn-primary rounded-xl py-3 disabled:opacity-60">
                    {saving ? 'Saving...' : editingArticle ? 'Save Changes' : 'Upload Magazine'}
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
                <div className="h-64 shrink-0 overflow-hidden">
                  <img
                    src={`data:${previewArticle.image_mimetype || 'image/jpeg'};base64,${previewArticle.image}`}
                    alt={previewArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-700">Magazine</span>
                  {previewArticle.pdf && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-600 flex items-center gap-1">
                      <FileText size={10} /> PDF
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(previewArticle.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-4">{previewArticle.title}</h2>
                {previewArticle.content && (
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{previewArticle.content}</p>
                )}
                {previewArticle.pdf && (
                  <button
                    onClick={() => openPdfBlob(previewArticle.pdf)}
                    className="mt-6 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-all"
                  >
                    <FileText size={16} /> Open PDF — {previewArticle.pdf_filename || 'magazine.pdf'}
                  </button>
                )}
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-3">
                <button onClick={() => { setPreviewArticle(null); openEdit(previewArticle); }}
                  className="flex-1 btn-primary rounded-xl py-3">
                  <Edit size={16} /> Edit
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
