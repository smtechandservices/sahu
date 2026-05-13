'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import {
  Heart, Search, Check, X, Eye, Trash2,
  User, MapPin, GraduationCap, Briefcase, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MatrimonialManager() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterGotra, setFilterGotra] = useState('All');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [processing, setProcessing] = useState(null);

  useEffect(() => { fetchProfiles(); }, []);

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

  const handleApprove = async (id) => {
    setProcessing(id);
    try {
      await fetchApi(`/matrimonial/${id}/`, { method: 'PATCH', body: JSON.stringify({ is_approved: true }) });
      setProfiles(prev => prev.map(p => p.id === id ? { ...p, is_approved: true } : p));
      if (selectedProfile?.id === id) setSelectedProfile(p => ({ ...p, is_approved: true }));
    } catch (err) {
      alert('Failed to approve profile');
    } finally {
      setProcessing(null);
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
      alert('Failed to delete profile');
    } finally {
      setProcessing(null);
    }
  };

  const filtered = profiles.filter(p => {
    const name = p.user_detail?.name || '';
    const matchSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGender = filterGender === 'All' || p.gender === filterGender;
    const matchStatus = filterStatus === 'All' ||
      (filterStatus === 'Approved' && p.is_approved) ||
      (filterStatus === 'Pending' && !p.is_approved);
    const matchGotra = filterGotra === 'All' || (p.gotra || '').toLowerCase() === filterGotra.toLowerCase();
    return matchSearch && matchGender && matchStatus && matchGotra;
  });

  const pending = profiles.filter(p => !p.is_approved).length;
  const approved = profiles.filter(p => p.is_approved).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900">Matrimonial Approvals</h1>
        <p className="text-gray-500 font-medium">Review and approve community matrimonial profiles.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Profiles', value: profiles.length, color: 'text-gray-900' },
          { label: 'Pending Review', value: pending, color: 'text-yellow-600' },
          { label: 'Approved', value: approved, color: 'text-green-600' },
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
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="input-field pl-12"
          />
        </div>
        <select value={filterGender} onChange={e => setFilterGender(e.target.value)} className="input-field md:w-36">
          <option value="All">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-field md:w-36">
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
        </select>
        <select value={filterGotra} onChange={e => setFilterGotra(e.target.value)} className="input-field md:w-40">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(profile => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all"
            >
              {/* Photo */}
              <div className="relative h-52 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                {profile.photo ? (
                  <img src={`data:${profile.photo_mimetype || 'image/jpeg'};base64,${profile.photo}`}
                    alt={profile.user_detail?.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={56} className="text-primary/30" />
                )}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase ${profile.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {profile.is_approved ? 'Approved' : 'Pending'}
                </div>
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
                  {!profile.is_approved && (
                    <button onClick={() => handleApprove(profile.id)} disabled={processing === profile.id}
                      className="flex-1 py-2 text-xs font-bold text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-all flex items-center justify-center gap-1 disabled:opacity-50">
                      <Check size={14} /> Approve
                    </button>
                  )}
                  <button onClick={() => handleDelete(profile.id)} disabled={processing === profile.id}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
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

              <div className="relative h-56 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0">
                {selectedProfile.photo ? (
                  <img src={`data:${selectedProfile.photo_mimetype || 'image/jpeg'};base64,${selectedProfile.photo}`}
                    alt={selectedProfile.user_detail?.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={72} className="text-primary/30" />
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

                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Bio</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedProfile.bio}</p>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                {!selectedProfile.is_approved && (
                  <button
                    onClick={() => handleApprove(selectedProfile.id)}
                    disabled={processing === selectedProfile.id}
                    className="flex-1 btn-primary rounded-xl py-3 disabled:opacity-60"
                  >
                    <Check size={16} /> {processing === selectedProfile.id ? 'Approving...' : 'Approve Profile'}
                  </button>
                )}
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
    </div>
  );
}
