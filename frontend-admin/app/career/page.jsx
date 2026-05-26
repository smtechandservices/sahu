'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import {
  Briefcase, Plus, Search, Edit, Trash2,
  MapPin, Clock, ExternalLink, X, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Contract'];

const emptyForm = {
  title: '', company: '', location: '', type: 'Full-time',
  description: '', apply_link: '', is_active: true
};

export default function CareerManager() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const data = await fetchApi('/jobs/');
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => { setEditingJob(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (job) => { setEditingJob(job); setForm({ ...job }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditingJob(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingJob) {
        await fetchApi(`/jobs/${editingJob.id}/`, { method: 'PUT', body: JSON.stringify(form) });
      } else {
        await fetchApi('/jobs/', { method: 'POST', body: JSON.stringify(form) });
      }
      await fetchJobs();
      closeModal();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Save Failed', text: err.message || 'Failed to save job listing' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job listing?')) return;
    setDeletingId(id);
    try {
      await fetchApi(`/jobs/${id}/`, { method: 'DELETE' });
      setJobs(prev => prev.filter(j => j.id !== id));
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Delete Failed', text: 'Failed to delete' });
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === 'All' || j.type === filterType;
    return matchSearch && matchType;
  });

  const typeColor = {
    'Full-time': 'bg-blue-100 text-blue-700',
    'Part-time': 'bg-purple-100 text-purple-700',
    'Remote': 'bg-green-100 text-green-700',
    'Contract': 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Career Portal</h1>
          <p className="text-gray-500 font-medium">Manage job listings and community opportunities.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={18} /> Add Job Listing
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['All', ...JOB_TYPES].map(type => {
          const count = type === 'All' ? jobs.length : jobs.filter(j => j.type === type).length;
          return (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`p-4 rounded-2xl border text-left transition-all ${filterType === type ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-primary/30'}`}
            >
              <p className="text-2xl font-black text-gray-900">{count}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{type}</p>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input-field pl-12"
          />
        </div>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 font-bold">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
          <Briefcase size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold">No job listings found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(job => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center gap-6 group hover:border-primary/30 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl shrink-0">
                {job.company.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${typeColor[job.type] || 'bg-gray-100 text-gray-600'}`}>
                    {job.type}
                  </span>
                  {!job.is_active && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-600">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-2">{job.company}</p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span>
                  <span className="flex items-center gap-1"><Clock size={12} />{new Date(job.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a href={job.apply_link} target="_blank" rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="Open Link">
                  <ExternalLink size={18} />
                </a>
                <button onClick={() => openEdit(job)}
                  className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(job.id)} disabled={deletingId === job.id}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50">
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900">{editingJob ? 'Edit Job Listing' : 'Add New Job'}</h2>
                <button onClick={closeModal} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Job Title *</label>
                    <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g. Software Engineer" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company *</label>
                    <input required value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="input-field" placeholder="e.g. Sahu Enterprises" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location *</label>
                    <input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="input-field" placeholder="e.g. Raipur, CG" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Job Type *</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input-field">
                      {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Apply Link *</label>
                    <input required type="url" value={form.apply_link} onChange={e => setForm({ ...form, apply_link: e.target.value })} className="input-field" placeholder="https://..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description *</label>
                    <textarea required rows={5} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field resize-none" placeholder="Describe the job role and requirements..." />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-3">
                    <button type="button" onClick={() => setForm({ ...form, is_active: !form.is_active })}
                      className={`w-12 h-6 rounded-full transition-all relative ${form.is_active ? 'bg-primary' : 'bg-gray-200'}`}>
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.is_active ? 'left-6' : 'left-0.5'}`} />
                    </button>
                    <label className="text-sm font-bold text-gray-700">Active (visible to users)</label>
                  </div>
                </div>
                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="flex-1 btn-primary py-3 rounded-xl disabled:opacity-60">
                    {saving ? 'Saving...' : editingJob ? 'Save Changes' : 'Add Job'}
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
