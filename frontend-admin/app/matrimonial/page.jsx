'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import {
  Heart, Search, X, Eye, Trash2, Edit,
  User, MapPin, GraduationCap, Briefcase, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import Pagination from '../../components/Pagination/Pagination';

const PAGE_SIZE = 12;

export default function MatrimonialManager() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState('All');
  const [filterFee, setFilterFee] = useState('All');
  const [filterGotra, setFilterGotra] = useState('All');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => { fetchProfiles(); }, []);

  // Any filter change goes back to page 1
  const withReset = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const fetchProfiles = async () => {
    try {
      const data = await fetchApi('/matrimonial/');
      setProfiles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this matrimonial profile permanently?')) return;
    setProcessing(id);
    try {
      await fetchApi(`/matrimonial/${id}/`, { method: 'DELETE' });
      setProfiles(prev => prev.filter(p => p.id !== id));
      if (selectedProfile?.id === id) setSelectedProfile(null);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Delete Failed', text: 'Failed to delete profile' });
    } finally {
      setProcessing(null);
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setProcessing('edit');
    try {
      const { id, city, bio, occupation, education } = editingProfile;
      await fetchApi(`/matrimonial/${id}/`, { 
        method: 'PATCH', 
        body: JSON.stringify({ city, bio, occupation, education }) 
      });
      setProfiles(prev => prev.map(p => p.id === id ? { ...p, city, bio, occupation, education } : p));
      setEditingProfile(null);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Save Failed', text: 'Failed to save profile' });
    } finally {
      setProcessing(null);
    }
  };

  const filtered = profiles.filter(p => {
    const name = p.user_detail?.name || '';
    const matchSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGender = filterGender === 'All' || p.gender === filterGender;
    const matchFee = filterFee === 'All' ||
      (filterFee === 'Paid' && p.amount_paid) ||
      (filterFee === 'NoPayment' && !p.amount_paid);
    const matchGotra = filterGotra === 'All' || (p.gotra || '').toLowerCase() === filterGotra.toLowerCase();
    return matchSearch && matchGender && matchFee && matchGotra;
  });

  // A delete can leave the last page empty — show the new last page instead
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageProfiles = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const goToPage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Profiles created before the creation fee have no amount_paid
  const paidProfiles = profiles.filter(p => p.amount_paid);
  const feeCollected = paidProfiles.reduce((sum, p) => sum + Number(p.amount_paid), 0);
  const male = profiles.filter(p => p.gender === 'Male').length;
  const female = profiles.filter(p => p.gender === 'Female').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900">Matrimonial Profiles</h1>
        <p className="text-gray-500 font-medium">Profiles go live once the creation fee (₹1,000 male / ₹500 female) is paid.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Profiles', value: profiles.length, color: 'text-gray-900' },
          { label: 'Male', value: male, color: 'text-blue-600' },
          { label: 'Female', value: female, color: 'text-pink-600' },
          { label: 'Paid Online', value: paidProfiles.length, color: 'text-green-600' },
          { label: 'Fee Collected', value: `₹${feeCollected.toLocaleString('en-IN')}`, color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text" placeholder="Search by name or city..."
            value={searchQuery} onChange={withReset(setSearchQuery)}
            className="input-field pl-12"
          />
        </div>
        <select value={filterGender} onChange={withReset(setFilterGender)} className="input-field md:w-36">
          <option value="All">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select value={filterFee} onChange={withReset(setFilterFee)} className="input-field md:w-44">
          <option value="All">All Profiles</option>
          <option value="Paid">Fee Paid</option>
          <option value="NoPayment">No Payment Record</option>
        </select>
        <select value={filterGotra} onChange={withReset(setFilterGotra)} className="input-field md:w-40">
          <option value="All">All Gotras</option>
          {['Kashyap','Bharadwaj','Vashisht','Gautam','Atri','Vishwamitra','Jamadagni','Shandilya','Parashar','Garg','Angiras'].map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Profiles Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 font-bold">Loading profiles...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
          <Heart size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold">No profiles found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageProfiles.map(profile => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all"
              >
                {/* Photo */}
                <div className="relative h-52 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary/30">
                  {profile.photo ? (
                    <img src={profile.photo} alt={profile.user_detail?.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={56} />
                  )}
                  {profile.amount_paid && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-green-100 text-green-700">
                      Paid ₹{Number(profile.amount_paid).toLocaleString('en-IN')}
                    </div>
                  )}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-white/90 text-gray-700">
                    {profile.gender}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{profile.user_detail?.name}</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><MapPin size={12} />{profile.city}</span>
                    <span className="flex items-center gap-1"><User size={12} />{profile.age} yrs</span>
                    <span className="flex items-center gap-1"><GraduationCap size={12} />{profile.education}</span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-4">{profile.bio}</p>

                  <div className="flex gap-2 pt-4 border-t border-gray-50">
                    <button onClick={() => setSelectedProfile(profile)}
                      className="flex-1 py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-1">
                      <Eye size={14} /> View
                    </button>
                    <button onClick={() => setEditingProfile(profile)}
                      className="flex-1 py-2 text-xs font-bold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-1">
                      <Edit size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(profile.id)} disabled={processing === profile.id}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Pagination
            page={currentPage}
            pageSize={PAGE_SIZE}
            totalCount={filtered.length}
            onPageChange={goToPage}
            className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm"
          />
        </div>
      )}

      {/* Profile Detail Modal */}
      <AnimatePresence>
        {selectedProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProfile(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

              <div className="relative h-56 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0 text-primary/30">
                {selectedProfile?.photo ? (
                  <img src={selectedProfile.photo} alt={selectedProfile.user_detail?.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={72} />
                )}
                <button onClick={() => setSelectedProfile(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-600 hover:bg-white transition-all">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">{selectedProfile.user_detail?.name}</h2>
                  <p className="text-gray-500">{selectedProfile.user_detail?.phone}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: User, label: 'Age', value: `${selectedProfile.age} years` },
                    { icon: Users, label: 'Gender', value: selectedProfile.gender },
                    { icon: MapPin, label: 'City', value: selectedProfile.city },
                    { icon: Users, label: 'Family Type', value: selectedProfile.family_type },
                    { icon: GraduationCap, label: 'Education', value: selectedProfile.education },
                    { icon: Briefcase, label: 'Occupation', value: selectedProfile.occupation },
                    { icon: Users, label: 'Marital Status', value: selectedProfile.marital_status || '—' },
                    { icon: Users, label: 'Gotra', value: selectedProfile.gotra || '—' },
                    { icon: Users, label: 'Manglik', value: selectedProfile.manglik || '—' },
                    { icon: Users, label: 'Complexion', value: selectedProfile.complexion || '—' },
                    { icon: Briefcase, label: 'Annual Income', value: selectedProfile.annual_income || '—' },
                    { icon: Users, label: 'Mother Tongue', value: selectedProfile.mother_tongue || '—' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5"><Icon size={13} className="text-primary" />{value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Profile Fee</p>
                  {selectedProfile.amount_paid ? (
                    <p className="text-sm font-bold text-gray-800">
                      ₹{Number(selectedProfile.amount_paid).toLocaleString('en-IN')} paid
                      {selectedProfile.paid_at && ` on ${new Date(selectedProfile.paid_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                      <span className="block text-xs font-medium text-gray-400 mt-0.5">Payment ID: {selectedProfile.razorpay_payment_id}</span>
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-gray-500">No payment record (created before the profile fee)</p>
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Bio</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedProfile.bio}</p>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => handleDelete(selectedProfile.id)}
                  disabled={processing === selectedProfile.id}
                  className="flex-1 py-3 rounded-xl border border-red-200 text-red-500 font-bold text-sm hover:bg-red-50 transition-all disabled:opacity-50"
                >
                  Delete Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editingProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEditingProfile(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-black text-gray-900">Edit Profile</h2>
                <button onClick={() => setEditingProfile(null)} className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-all">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleEditSave} className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">City</label>
                  <input type="text" value={editingProfile.city} onChange={e => setEditingProfile({...editingProfile, city: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Occupation</label>
                  <input type="text" value={editingProfile.occupation} onChange={e => setEditingProfile({...editingProfile, occupation: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Education</label>
                  <input type="text" value={editingProfile.education} onChange={e => setEditingProfile({...editingProfile, education: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Bio</label>
                  <textarea rows={3} value={editingProfile.bio} onChange={e => setEditingProfile({...editingProfile, bio: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:border-primary outline-none" />
                </div>
              </form>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                <button type="button" onClick={() => setEditingProfile(null)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm hover:bg-white transition-all">Cancel</button>
                <button onClick={handleEditSave} disabled={processing === 'edit'} className="flex-1 btn-primary rounded-xl py-3 disabled:opacity-60">
                  {processing === 'edit' ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
