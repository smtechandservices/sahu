'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import Pagination from '../../components/Pagination/Pagination';
import {
  HandCoins, IndianRupee, Clock, Users, TrendingUp, Search, Plus, Edit, Trash2, X,
  Download, Phone, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import Swal from 'sweetalert2';

const PAGE_SIZE = 20;
const STATUSES = ['Pending', 'Completed', 'Failed', 'Refunded'];
const METHODS = ['Online', 'UPI', 'Cash', 'Cheque', 'Bank Transfer'];
const PURPOSES = [
  { value: 'General Welfare', label: 'General Welfare Fund' },
  { value: 'Education', label: 'Education & Scholarships' },
  { value: 'Hostel', label: 'Hostel Maintenance' },
  { value: 'Medical', label: 'Community Medical Aid' },
];
const PURPOSE_COLORS = {
  'General Welfare': 'bg-primary',
  'Education': 'bg-blue-500',
  'Hostel': 'bg-green-500',
  'Medical': 'bg-pink-500',
};
const STATUS_STYLES = {
  Pending: 'bg-amber-50 text-amber-600',
  Completed: 'bg-green-50 text-green-600',
  Failed: 'bg-red-50 text-red-500',
  Refunded: 'bg-gray-100 text-gray-500',
};

const EMPTY_FORM = {
  name: '', phone: '', email: '', amount: '', purpose: 'General Welfare',
  status: 'Completed', payment_method: 'Cash', transaction_ref: '', notes: '',
};

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
const shortInr = (n) => {
  const v = Number(n || 0);
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(1)}Cr`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(1)}L`;
  if (v >= 1e3) return `₹${(v / 1e3).toFixed(0)}k`;
  return `₹${v}`;
};

export default function DonationsManager() {
  const [donations, setDonations] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [summary, setSummary] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = recording a new offline donation
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Bump to re-fetch the list and the summary (after a save or delete)
  const [reloadKey, setReloadKey] = useState(0);
  const refresh = () => {
    setLoading(true);
    setReloadKey(k => k + 1);
  };

  // Any filter change goes back to page 1
  const withReset = (setter) => (value) => {
    setLoading(true);
    setter(value);
    setPage(1);
  };

  const goToPage = (p) => {
    setLoading(true);
    setPage(p);
  };

  // Wait for the admin to stop typing before searching
  useEffect(() => {
    const query = searchQuery.trim();
    if (query === debouncedSearch) return;
    const t = setTimeout(() => {
      setLoading(true);
      setDebouncedSearch(query);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery, debouncedSearch]);

  const buildParams = () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (purposeFilter) params.set('purpose', purposeFilter);
    if (methodFilter) params.set('payment_method', methodFilter);
    if (dateFrom) params.set('from', dateFrom);
    if (dateTo) params.set('to', dateTo);
    if (debouncedSearch) params.set('search', debouncedSearch);
    return params;
  };

  useEffect(() => {
    let cancelled = false;
    const params = buildParams();
    params.set('page', page);
    params.set('page_size', PAGE_SIZE);
    fetchApi(`/donations/?${params}`)
      .then((data) => {
        if (cancelled) return;
        // A delete can leave the last page empty — step back one page
        if (data.results.length === 0 && page > 1) {
          setPage(p => p - 1);
          return;
        }
        setDonations(data.results);
        setTotalCount(data.count);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, purposeFilter, methodFilter, dateFrom, dateTo, debouncedSearch, reloadKey]);

  useEffect(() => {
    let cancelled = false;
    fetchApi('/donations/summary/')
      .then((data) => { if (!cancelled) setSummary(data); })
      .catch(console.error);
    return () => { cancelled = true; };
  }, [reloadKey]);

  const hasFilters = statusFilter || purposeFilter || methodFilter || dateFrom || dateTo || debouncedSearch;
  const clearFilters = () => {
    setLoading(true);
    setStatusFilter(''); setPurposeFilter(''); setMethodFilter('');
    setDateFrom(''); setDateTo(''); setSearchQuery(''); setDebouncedSearch('');
    setPage(1);
  };

  const openRecord = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (d) => {
    setEditing(d);
    setForm({
      name: d.name || '', phone: d.phone || '', email: d.email || '', amount: d.amount,
      purpose: d.purpose, status: d.status, payment_method: d.payment_method,
      transaction_ref: d.transaction_ref || '', notes: d.notes || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const body = JSON.stringify({ ...form, email: form.email || null });
    try {
      if (editing) {
        await fetchApi(`/donations/${editing.id}/`, { method: 'PATCH', body });
      } else {
        await fetchApi('/donations/record/', { method: 'POST', body });
      }
      closeModal();
      refresh();
      Swal.fire({
        icon: 'success',
        title: editing ? 'Donation updated' : 'Donation recorded',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed to save', text: err.message, confirmButtonColor: '#EAB308' });
    } finally {
      setSaving(false);
    }
  };

  // Quick status change straight from the table
  const quickStatus = async (d, newStatus) => {
    if (newStatus === d.status) return;
    try {
      await fetchApi(`/donations/${d.id}/`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
      refresh();
    } catch (err) {
      Swal.fire('Error', err.message || 'Failed to update status.', 'error');
    }
  };

  const handleDelete = (d) => {
    Swal.fire({
      title: 'Delete donation?',
      text: `${inr(d.amount)} from ${d.name}. This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it',
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await fetchApi(`/donations/${d.id}/`, { method: 'DELETE' });
        refresh();
      } catch (err) {
        Swal.fire('Error', err.message || 'Failed to delete donation.', 'error');
      }
    });
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const csv = await fetchApi(`/donations/export/?${buildParams()}`);
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `donations-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      Swal.fire('Error', err.message || 'Export failed.', 'error');
    } finally {
      setExporting(false);
    }
  };

  const purposeMax = Math.max(1, ...(summary?.by_purpose || []).map(p => Number(p.total)));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Donations</h1>
          <p className="text-gray-500 font-medium">Track every contribution made to the Sabha.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-60 transition-all"
          >
            {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Export CSV
          </button>
          <button onClick={openRecord} className="btn-primary">
            <Plus size={18} /> Record Donation
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<IndianRupee className="text-green-500" />}
          label="Total Received"
          value={summary ? inr(summary.total_received) : '—'}
          sub={summary ? `${summary.completed_count} completed donations` : ''}
        />
        <StatCard
          icon={<TrendingUp className="text-primary" />}
          label="This Month"
          value={summary ? inr(summary.received_this_month) : '—'}
          sub={summary ? `Avg. ${inr(summary.average_donation)} per donation` : ''}
        />
        <StatCard
          icon={<Clock className="text-amber-500" />}
          label="Pending"
          value={summary ? inr(summary.pending_amount) : '—'}
          sub={summary ? `${summary.pending_count} awaiting confirmation` : ''}
          onClick={() => withReset(setStatusFilter)('Pending')}
        />
        <StatCard
          icon={<Users className="text-blue-500" />}
          label="Donors"
          value={summary ? summary.donor_count.toLocaleString('en-IN') : '—'}
          sub="Unique donors (completed)"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 min-w-0 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900">Monthly Collections</h3>
          <p className="text-sm text-gray-400 mb-6">Completed donations over the last 6 months</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={(summary?.monthly || []).map(m => ({ ...m, total: Number(m.total) }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} tickFormatter={shortInr} width={60} />
                <Tooltip
                  cursor={{ fill: '#FEF9C3', opacity: 0.5 }}
                  formatter={(v) => [inr(v), 'Collected']}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="total" fill="#EAB308" radius={[8, 8, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900">By Purpose</h3>
          <p className="text-sm text-gray-400 mb-6">Completed donations, all time</p>
          <div className="flex flex-col gap-2 -mx-3">
            {(summary?.by_purpose || []).map(p => (
              <button
                key={p.purpose}
                onClick={() => withReset(setPurposeFilter)(purposeFilter === p.purpose ? '' : p.purpose)}
                className={`w-full text-left rounded-xl px-3 py-3 transition-all ${purposeFilter === p.purpose ? 'bg-primary/10' : 'hover:bg-gray-50'}`}
              >
                <div className="flex justify-between items-baseline gap-3 text-sm">
                  <span className="font-medium text-gray-700 truncate">{p.label}</span>
                  <span className="font-bold text-gray-900 whitespace-nowrap">{inr(p.total)}</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mt-2.5">
                  <div
                    className={`h-full rounded-full ${PURPOSE_COLORS[p.purpose] || 'bg-gray-400'}`}
                    style={{ width: `${(Number(p.total) / purposeMax) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">{p.count} donations</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-wrap gap-2">
          {['', ...STATUSES].map(s => (
            <button
              key={s || 'all'}
              onClick={() => withReset(setStatusFilter)(s)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                statusFilter === s ? 'bg-primary text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              {s || 'All'}
              {s && summary?.status_counts?.[s] != null && (
                <span className={`ml-2 text-xs ${statusFilter === s ? 'text-white/80' : 'text-gray-400'}`}>
                  {summary.status_counts[s]}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, phone, email or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12"
            />
          </div>
          <select value={purposeFilter} onChange={(e) => withReset(setPurposeFilter)(e.target.value)} className="input-field lg:w-56">
            <option value="">All Purposes</option>
            {PURPOSES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          <select value={methodFilter} onChange={(e) => withReset(setMethodFilter)(e.target.value)} className="input-field lg:w-44">
            <option value="">All Methods</option>
            {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input type="date" value={dateFrom} max={dateTo || undefined} onChange={(e) => withReset(setDateFrom)(e.target.value)} className="input-field lg:w-40" title="From date" />
          <input type="date" value={dateTo} min={dateFrom || undefined} onChange={(e) => withReset(setDateTo)(e.target.value)} className="input-field lg:w-40" title="To date" />
          {hasFilters && (
            <button onClick={clearFilters} className="inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100 whitespace-nowrap">
              <X size={16} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {loading && donations.length === 0 ? (
        <div className="py-20 text-center text-gray-400 font-bold">Loading donations...</div>
      ) : donations.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
          <HandCoins size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold">No donations found.</p>
        </div>
      ) : (
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-opacity ${loading ? 'opacity-60' : ''}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  {['Donor', 'Amount', 'Purpose', 'Method', 'Reference', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {donations.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                          {d.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate">{d.name}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1"><Phone size={10} />{d.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900 whitespace-nowrap">{inr(d.amount)}</td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      <span className="inline-flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${PURPOSE_COLORS[d.purpose] || 'bg-gray-400'}`} />
                        {PURPOSES.find(p => p.value === d.purpose)?.label || d.purpose}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {d.payment_method}
                      {d.recorded_by_name && <p className="text-[11px] text-gray-400">by {d.recorded_by_name}</p>}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs font-mono max-w-[160px] truncate" title={d.transaction_ref}>
                      {d.transaction_ref || <span className="text-gray-300 font-sans">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={d.status}
                        onChange={(e) => quickStatus(d, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border-0 outline-none cursor-pointer ${STATUS_STYLES[d.status] || ''}`}
                        title="Change status"
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs font-medium whitespace-nowrap">
                      {new Date(d.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      <p>{new Date(d.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(d)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(d)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            totalCount={totalCount}
            onPageChange={goToPage}
            disabled={loading}
            className="px-6 py-4 border-t border-gray-100"
          />
        </div>
      )}

      {/* Record / Edit modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">{editing ? 'Edit Donation' : 'Record Donation'}</h2>
                  <p className="text-sm text-gray-400 font-medium mt-1">
                    {editing
                      ? `#${editing.id} · ${editing.user_name ? `website donation by ${editing.user_name}` : editing.recorded_by_name ? `recorded by ${editing.recorded_by_name}` : 'donation'}`
                      : 'Add a cash, cheque or bank transfer received offline.'}
                  </p>
                </div>
                <button onClick={closeModal} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <form id="donation-form" onSubmit={handleSave} className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Donor Name *">
                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g. Rahul Sahu" />
                  </Field>
                  <Field label="Phone *">
                    <input required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="10-digit mobile number" />
                  </Field>
                  <Field label="Email">
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="optional" />
                  </Field>
                  <Field label="Amount (₹) *">
                    <input required type="number" min="1" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="input-field font-bold" placeholder="0" />
                  </Field>
                  <Field label="Purpose *">
                    <select value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} className="input-field">
                      {PURPOSES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Payment Method *">
                    <select value={form.payment_method} onChange={e => setForm({ ...form, payment_method: e.target.value })} className="input-field">
                      {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </Field>
                  <Field label="Status *">
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="input-field">
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Transaction / Receipt Ref">
                    <input value={form.transaction_ref} onChange={e => setForm({ ...form, transaction_ref: e.target.value })} className="input-field font-mono" placeholder="UPI ref, cheque no., receipt no." />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Notes">
                      <textarea rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="input-field resize-none" placeholder="Anything worth remembering about this donation" />
                    </Field>
                  </div>
                </div>
              </form>

              <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
                <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-white transition-all">
                  Cancel
                </button>
                <button type="submit" form="donation-form" disabled={saving} className="btn-primary disabled:opacity-60">
                  {saving ? 'Saving...' : editing ? 'Save Changes' : 'Record Donation'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon, label, value, sub, onClick }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left ${onClick ? 'hover:border-primary/30 transition-all' : ''}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">{icon}</div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </Tag>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</label>
      {children}
    </div>
  );
}
