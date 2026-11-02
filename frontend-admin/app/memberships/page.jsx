'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import { membershipTierName } from '../../lib/membership';
import Pagination from '../../components/Pagination/Pagination';
import { UserCheck, Search, X, Check, Ban, ShieldCheck, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const PAGE_SIZE = 20;

// Payment states as the Transactions page shows them
const PAYMENT_STATUS = { Paid: 'Success', Failed: 'Failed', Pending: 'Initiated' };
const PAYMENT_STYLES = {
  Success: 'bg-green-50 text-green-600',
  Initiated: 'bg-blue-50 text-blue-600',
  Failed: 'bg-red-50 text-red-600',
};
const APPROVAL_STYLES = {
  Pending: 'bg-amber-50 text-amber-700',
  Approved: 'bg-green-50 text-green-700',
  Rejected: 'bg-red-50 text-red-600',
};

const TABS = [
  { key: 'awaiting', label: 'Awaiting Approval', match: (a) => a.status === 'Paid' && a.approval_status === 'Pending' },
  { key: 'approved', label: 'Approved', match: (a) => a.approval_status === 'Approved' },
  { key: 'rejected', label: 'Rejected', match: (a) => a.approval_status === 'Rejected' },
  { key: 'unpaid', label: 'Payment Not Completed', match: (a) => a.status !== 'Paid' && a.approval_status === 'Pending' },
];

const inr = (amount) => `₹${Number(amount).toLocaleString('en-IN')}`;
const formatDate = (value) => value
  ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  : '—';

export default function MembershipRequests() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('awaiting');
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchApi('/membership-applications/')
      .then(setApplications)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Approving creates the member's account so they can log in; rejecting leaves them without one
  const handleReview = async (application, action) => {
    const prompt = action === 'approve'
      ? `Approve ${application.name}'s membership? This creates their account so they can log in.`
      : `Reject ${application.name}'s membership application? No account will be created. Any refund has to be made from the Razorpay dashboard.`;
    if (!window.confirm(prompt)) return;
    setProcessing(application.id);
    try {
      const updated = await fetchApi(`/membership-applications/${application.id}/${action}/`, { method: 'POST' });
      setApplications(prev => prev.map(a => a.id === application.id ? updated : a));
      if (selected?.id === application.id) setSelected(updated);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Update Failed', text: err.message || `Could not ${action} the application` });
    } finally {
      setProcessing(null);
    }
  };

  const query = searchQuery.toLowerCase();
  const activeTab = TABS.find(t => t.key === tab);
  const filtered = applications.filter(a => activeTab.match(a) && (
    a.name.toLowerCase().includes(query) || a.phone.includes(query) ||
    (a.city || '').toLowerCase().includes(query) || (a.razorpay_payment_id || '').toLowerCase().includes(query)
  ));

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Membership Requests</h1>
        <p className="text-gray-500 font-medium">Join page applications. After the fee is paid, the member can log in only once you approve the application.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); setPage(1); }}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === t.key ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white border border-gray-100 text-gray-500 hover:text-gray-800'}`}>
            {t.label}
            <span className={`ml-2 text-xs ${tab === t.key ? 'text-white/80' : 'text-gray-400'}`}>{applications.filter(t.match).length}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, phone, city or payment ID..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400 font-bold">Loading applications...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
          <UserCheck size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold">No applications here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  {['Applicant', 'Phone', 'Membership', 'Payment', 'Approval', 'Applied', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pageItems.map(a => {
                  const payment = PAYMENT_STATUS[a.status] || a.status;
                  return (
                    <tr key={a.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{a.name}</p>
                        {a.city && <p className="text-xs text-gray-400">{a.city}</p>}
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-mono">{a.phone}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-800">{inr(a.amount)}</p>
                        {membershipTierName(a.amount) && <p className="text-xs text-gray-400">{membershipTierName(a.amount)}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${PAYMENT_STYLES[payment] || 'bg-gray-100 text-gray-500'}`}>{payment}</span>
                        {a.razorpay_payment_id && <p className="text-[11px] text-gray-400 font-mono mt-1">{a.razorpay_payment_id}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${APPROVAL_STYLES[a.approval_status]}`}>{a.approval_status}</span>
                        {a.reviewed_at && <p className="text-[11px] text-gray-400 mt-1">{formatDate(a.reviewed_at)}</p>}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(a.created_at)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelected(a)} title="View KYC"
                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                            <ShieldCheck size={16} />
                          </button>
                          <ReviewButtons application={a} processing={processing} onReview={handleReview} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            page={currentPage}
            pageSize={PAGE_SIZE}
            totalCount={filtered.length}
            onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm"
          />
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <ApplicationModal application={selected} processing={processing} onReview={handleReview} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Only paid applications can be approved; an approved one already has an account, so it can't be rejected
function ReviewButtons({ application, processing, onReview }) {
  const busy = processing === application.id;
  const canApprove = application.status === 'Paid' && application.approval_status !== 'Approved';
  const canReject = application.approval_status === 'Pending';
  return (
    <>
      {canApprove && (
        <button onClick={() => onReview(application, 'approve')} disabled={busy}
          className="px-3 py-2 text-xs font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all flex items-center gap-1 disabled:opacity-50">
          <Check size={14} /> Approve
        </button>
      )}
      {canReject && (
        <button onClick={() => onReview(application, 'reject')} disabled={busy}
          className="px-3 py-2 text-xs font-bold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-all flex items-center gap-1 disabled:opacity-50">
          <Ban size={14} /> Reject
        </button>
      )}
    </>
  );
}

// KYC submitted on the Join page with the payment, for review before approving
function ApplicationModal({ application, processing, onReview, onClose }) {
  const aadhaar = application.aadhaar_number.replace(/(\d{4})(?=\d)/g, '$1 ');
  const isImage = application.kyc_document_mimetype?.startsWith('image/');
  const payment = PAYMENT_STATUS[application.status] || application.status;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-black text-gray-900">Membership Application</h2>
            <p className="text-sm text-gray-500">{application.name} · {application.phone}</p>
          </div>
          <button onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Aadhaar Number', value: aadhaar },
              { label: 'City', value: application.city || '—' },
              { label: 'Membership', value: [membershipTierName(application.amount), inr(application.amount)].filter(Boolean).join(' · ') },
              { label: 'Payment', value: payment },
              { label: 'Payment ID', value: application.razorpay_payment_id || '—' },
              { label: 'Paid On', value: formatDate(application.paid_at) },
              { label: 'Approval', value: application.approval_status },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-sm font-bold text-gray-800 tracking-wide break-all">{value}</p>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">KYC Document</p>
              {application.kyc_document && (
                <a href={application.kyc_document} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                  Open in new tab <ExternalLink size={12} />
                </a>
              )}
            </div>
            {!application.kyc_document ? (
              <p className="text-sm text-gray-400">No document uploaded.</p>
            ) : isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={application.kyc_document} alt={`KYC document of ${application.name}`}
                className="w-full rounded-xl border border-gray-100 bg-gray-50 object-contain max-h-[50vh]" />
            ) : (
              <iframe src={application.kyc_document} title={`KYC document of ${application.name}`}
                className="w-full h-[50vh] rounded-xl border border-gray-100 bg-gray-50" />
            )}
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
          <ReviewButtons application={application} processing={processing} onReview={onReview} />
        </div>
      </motion.div>
    </div>
  );
}
