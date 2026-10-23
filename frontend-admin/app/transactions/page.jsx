'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import Pagination from '../../components/Pagination/Pagination';
import {
  ReceiptIndianRupee, Search, Download, Loader2, RefreshCw, X, UserCheck,
  HandCoins, BadgeCheck, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const PAGE_SIZE = 25;
const STATUSES = ['Success', 'Initiated', 'Pending', 'Failed', 'Refunded'];
const TYPES = ['Donation', 'Membership', 'Matrimonial'];

const STATUS_STYLES = {
  Success: 'bg-green-50 text-green-600',
  Initiated: 'bg-blue-50 text-blue-600',
  Pending: 'bg-amber-50 text-amber-600',
  Failed: 'bg-red-50 text-red-500',
  Refunded: 'bg-gray-100 text-gray-500',
};
const STATUS_HELP = {
  Success: 'Payment received',
  Initiated: 'Payment window opened, not confirmed yet',
  Pending: 'Offline payment awaiting confirmation',
  Failed: 'Payment attempt failed',
  Refunded: 'Money returned to the payer',
};
const TYPE_STYLES = {
  Donation: { icon: HandCoins, className: 'bg-primary/10 text-primary-dark' },
  Membership: { icon: BadgeCheck, className: 'bg-blue-50 text-blue-600' },
  Matrimonial: { icon: Heart, className: 'bg-pink-50 text-pink-600' },
};

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
const formatDateTime = (iso) => iso
  ? new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })
  : '—';

export default function TransactionsPage() {
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [statusSummary, setStatusSummary] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selected, setSelected] = useState(null);

  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  // Wait for the admin to stop typing before searching, and go back to page 1
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

  const buildQuery = (extra = {}) => {
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (typeFilter) params.set('type', typeFilter);
    if (dateFrom) params.set('from', dateFrom);
    if (dateTo) params.set('to', dateTo);
    if (debouncedSearch) params.set('search', debouncedSearch);
    Object.entries(extra).forEach(([k, v]) => params.set(k, v));
    return params.toString();
  };

  useEffect(() => {
    let cancelled = false;
    fetchApi(`/admin/transactions/?${buildQuery({ page, page_size: PAGE_SIZE })}`)
      .then((data) => {
        if (cancelled) return;
        setRows(data.results);
        setTotalCount(data.count);
        setStatusSummary(data.status_summary || {});
      })
      .catch((err) => console.error(err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, typeFilter, dateFrom, dateTo, debouncedSearch, reloadKey]);

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

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetchApi('/admin/transactions/sync/', { method: 'POST' });
      Swal.fire({
        icon: res.errors?.length ? 'warning' : 'success',
        title: 'Checked with Razorpay',
        html: `Checked <b>${res.checked}</b> initiated payment${res.checked === 1 ? '' : 's'}:<br/>`
          + `<b>${res.completed}</b> paid · <b>${res.failed}</b> failed · <b>${res.unchanged}</b> still open`
          + (res.errors?.length ? `<br/><br/><small>${res.errors.join('<br/>')}</small>` : ''),
        confirmButtonColor: '#EAB308',
      });
      setLoading(true);
      setReloadKey((k) => k + 1);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Sync failed', text: err?.data?.error || 'Could not reach Razorpay.' });
    } finally {
      setSyncing(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await fetchApi(`/admin/transactions/?${buildQuery({ page: 1, page_size: 10000 })}`);
      const header = ['Transaction ID', 'Date', 'Type', 'Description', 'Status', 'Amount', 'Method', 'Name', 'Phone', 'Email',
        'Account', 'Razorpay Order ID', 'Razorpay Payment ID', 'Reference', 'Notes', 'Completed At'];
      const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
      const lines = data.results.map((r) => [
        r.id, formatDateTime(r.created_at), r.type, r.description, r.status, r.amount, r.method, r.name, r.phone, r.email,
        r.account ? `${r.account.name} (${r.account.phone})` : 'Guest', r.razorpay_order_id, r.razorpay_payment_id,
        r.reference, r.notes, formatDateTime(r.completed_at),
      ].map(escape).join(','));
      const blob = new Blob([[header.map(escape).join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Export failed', text: 'Could not export transactions.' });
    } finally {
      setExporting(false);
    }
  };

  const allCount = Object.values(statusSummary).reduce((sum, s) => sum + s.count, 0);
  const hasFilters = statusFilter || typeFilter || dateFrom || dateTo || debouncedSearch;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Transactions</h1>
          <p className="text-gray-500 font-medium">Every payment: donations, membership fees and matrimonial fees.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            title="Ask Razorpay what happened to recent Initiated payments"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-60 transition-all"
          >
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
            Check with Razorpay
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-60 transition-all"
          >
            {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Export CSV
          </button>
        </div>
      </div>

      {/* Status chips */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatusChip label="All" count={allCount} active={!statusFilter} onClick={() => withReset(setStatusFilter)('')} />
        {STATUSES.map((s) => (
          <StatusChip
            key={s}
            label={s}
            help={STATUS_HELP[s]}
            count={statusSummary[s]?.count || 0}
            amount={statusSummary[s]?.amount || 0}
            styleClass={STATUS_STYLES[s]}
            active={statusFilter === s}
            onClick={() => withReset(setStatusFilter)(statusFilter === s ? '' : s)}
          />
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search name, phone, email, transaction or payment ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12"
          />
        </div>
        <select value={typeFilter} onChange={(e) => withReset(setTypeFilter)(e.target.value)} className="input-field md:w-44">
          <option value="">All Types</option>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input type="date" value={dateFrom} max={dateTo || undefined} onChange={(e) => withReset(setDateFrom)(e.target.value)}
          className="input-field md:w-44" aria-label="From date" />
        <input type="date" value={dateTo} min={dateFrom || undefined} onChange={(e) => withReset(setDateTo)(e.target.value)}
          className="input-field md:w-44" aria-label="To date" />
        {hasFilters && (
          <button
            onClick={() => {
              setLoading(true);
              setStatusFilter(''); setTypeFilter(''); setDateFrom(''); setDateTo('');
              setSearchQuery(''); setDebouncedSearch(''); setPage(1);
            }}
            className="px-4 text-sm font-bold text-gray-400 hover:text-gray-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      {loading && rows.length === 0 ? (
        <div className="text-center py-20 text-gray-400 font-bold">Loading transactions...</div>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
          <ReceiptIndianRupee size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold">No transactions found.</p>
        </div>
      ) : (
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-opacity ${loading ? 'opacity-60' : ''}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  {['Date', 'Transaction', 'Payer', 'Type', 'Method', 'Amount', 'Status'].map((h) => (
                    <th key={h} className={`px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap ${h === 'Amount' ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((r) => {
                  const TypeIcon = TYPE_STYLES[r.type].icon;
                  return (
                    <tr key={r.id} onClick={() => setSelected(r)} className="hover:bg-gray-50/60 transition-colors cursor-pointer">
                      <td className="px-6 py-4 text-xs text-gray-500 font-medium whitespace-nowrap">{formatDateTime(r.created_at)}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{r.id}</p>
                        <p className="text-xs text-gray-400">{r.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900 flex items-center gap-1.5">
                          {r.name}
                          {r.account && <UserCheck size={14} className="text-green-500" title="Has an account" />}
                        </p>
                        <p className="text-xs text-gray-400">{r.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${TYPE_STYLES[r.type].className}`}>
                          <TypeIcon size={12} /> {r.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{r.method}</td>
                      <td className="px-6 py-4 text-right font-black text-gray-900 whitespace-nowrap">{inr(r.amount)}</td>
                      <td className="px-6 py-4">
                        <span title={STATUS_HELP[r.status]} className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${STATUS_STYLES[r.status] || 'bg-gray-100 text-gray-500'}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
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

      <AnimatePresence>
        {selected && <TransactionModal tx={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}

function StatusChip({ label, help, count, amount, styleClass, active, onClick }) {
  return (
    <button
      onClick={onClick}
      title={help}
      className={`bg-white p-5 rounded-2xl border shadow-sm text-left transition-all ${active ? 'border-primary ring-2 ring-primary/20' : 'border-gray-100 hover:border-primary/30'}`}
    >
      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${styleClass || 'bg-gray-900 text-white'}`}>{label}</span>
      <p className="text-2xl font-black text-gray-900 mt-3">{count.toLocaleString('en-IN')}</p>
      {amount !== undefined && <p className="text-xs font-bold text-gray-400 mt-0.5">{inr(amount)}</p>}
    </button>
  );
}

function TransactionModal({ tx, onClose }) {
  const details = [
    ['Transaction ID', tx.id],
    ['Type', tx.type],
    ['Description', tx.description],
    ['Status', tx.status],
    ['Amount', inr(tx.amount)],
    ['Method', tx.method],
    ['Initiated', formatDateTime(tx.created_at)],
    ['Completed', formatDateTime(tx.completed_at)],
    ['Razorpay Order ID', tx.razorpay_order_id || '—'],
    ['Razorpay Payment ID', tx.razorpay_payment_id || '—'],
    ...(tx.reference && tx.reference !== tx.razorpay_payment_id ? [['Reference', tx.reference]] : []),
    ...(tx.recorded_by ? [['Recorded By', tx.recorded_by]] : []),
  ];
  const payer = [
    ['Name', tx.name],
    ['Phone', tx.phone],
    ...(tx.email ? [['Email', tx.email]] : []),
    ...(tx.details?.city ? [['City', tx.details.city]] : []),
    ...(tx.details?.gender ? [['Gender', tx.details.gender]] : []),
    ...(tx.details?.aadhaar ? [['Aadhaar', tx.details.aadhaar]] : []),
    ['Account', tx.account ? `${tx.account.name} · ${tx.account.phone} (ID ${tx.account.id})` : 'Guest (no account)'],
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between px-8 py-5 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-gray-900">{inr(tx.amount)}</h2>
              <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${STATUS_STYLES[tx.status] || 'bg-gray-100 text-gray-500'}`}>{tx.status}</span>
            </div>
            <p className="text-sm text-gray-500">{tx.id} · {tx.description}</p>
            <p className="text-xs text-gray-400 mt-0.5">{STATUS_HELP[tx.status]}</p>
          </div>
          <button onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <DetailGrid title="Payment" items={details} />
          <DetailGrid title="Payer" items={payer} />
          {tx.notes && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Notes</p>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{tx.notes}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function DetailGrid({ title, items }) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-900 mb-3">{title}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map(([label, value]) => (
          <div key={label} className="bg-gray-50 rounded-xl p-3 min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-sm font-bold text-gray-800 break-all">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
