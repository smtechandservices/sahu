import React from 'react';
import Image from 'next/image';

const MatrimonialModal = ({ profile, liked, isMatch, onLike, onClose, isOwn, onEdit }) => {
  const isLiked = liked?.includes(profile.id);

  const InfoRow = ({ label, value }) =>
    value && value !== '—' ? (
      <li className="flex justify-between py-2 border-b border-gray-50 last:border-0">
        <span className="text-gray-400 text-sm">{label}</span>
        <span className="font-semibold text-gray-800 text-sm text-right max-w-[55%]">{value}</span>
      </li>
    ) : null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary-light p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-primary transition-colors shadow-sm text-lg"
          >
            ×
          </button>

          <div className="flex gap-5 items-start">
            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary/10 to-primary/5 text-primary/30 shadow-md relative border-4 border-white flex items-center justify-center">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-0.5 truncate">{profile.name}</h2>
              <p className="text-sm text-gray-600 mb-2">
                {profile.age} yrs • {profile.height} • {profile.religion}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge color="primary">{profile.gender === 'male' ? '♂ Male' : '♀ Female'}</Badge>
                {profile.marital && <Badge color="green">{profile.marital}</Badge>}
                {profile.manglik && profile.manglik !== '—' && (
                  <Badge color={profile.manglik === 'Yes' ? 'red' : 'gray'}>
                    Manglik: {profile.manglik}
                  </Badge>
                )}
                {isMatch && <Badge color="match">Match</Badge>}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* About */}
          <section>
            <SectionTitle icon={<UserIcon />}>About</SectionTitle>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-sm text-gray-600 leading-relaxed italic">"{profile.about}"</p>
            </div>
          </section>

          {/* Two-column details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Background */}
            <section>
              <SectionTitle icon={<BriefcaseIcon />}>Background</SectionTitle>
              <ul>
                <InfoRow label="Education" value={profile.education} />
                <InfoRow label="Occupation" value={profile.profession} />
                <InfoRow label="Annual Income" value={profile.annual_income} />
                <InfoRow label="Mother Tongue" value={profile.mother_tongue} />
              </ul>
            </section>

            {/* Personal */}
            <section>
              <SectionTitle icon={<HeartIcon />}>Personal</SectionTitle>
              <ul>
                <InfoRow label="Marital Status" value={profile.marital} />
                <InfoRow label="Gotra" value={profile.gothra} />
                <InfoRow label="Manglik" value={profile.manglik} />
                <InfoRow label="Complexion" value={profile.complexion} />
                <InfoRow label="Family Type" value={profile.family_type} />
              </ul>
            </section>
          </div>

          {/* Location */}
          <section>
            <SectionTitle icon={<MapPinIcon />}>Location</SectionTitle>
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              <span className="text-sm font-semibold text-gray-800">{profile.location}</span>
            </div>
          </section>

          {/* Contact — only for mutual matches */}
          {isMatch && profile.contactPhone && !isOwn && (
            <section>
              <SectionTitle icon={<PhoneIcon />}>Contact</SectionTitle>
              <div className="bg-primary/5 rounded-xl px-4 py-4 border border-primary/20">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
                  Phone number
                </p>
                <a
                  href={`tel:${profile.contactPhone}`}
                  className="text-lg font-bold text-gray-900 hover:text-primary transition-colors"
                >
                  {formatPhone(profile.contactPhone)}
                </a>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          {isOwn ? (
            <button
              onClick={onEdit}
              className="btn-primary px-7 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Profile
            </button>
          ) : (
            <button
              onClick={onLike}
              className={`px-7 py-2.5 rounded-lg text-sm transition-all font-bold ${
                isMatch
                  ? 'bg-gradient-to-r from-pink-500/10 to-primary/10 text-primary border border-primary/30 shadow-none'
                  : isLiked
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-none'
                  : 'btn-primary shadow-lg shadow-primary/20'
              }`}
            >
              {isMatch ? "It's a Match!" : isLiked ? 'Interest Sent ✓' : 'Send Interest'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---- Helpers ---- */
function SectionTitle({ icon, children }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 text-sm">{children}</h3>
    </div>
  );
}

function Badge({ color = 'gray', children }) {
  const colors = {
    primary: 'bg-primary/10 text-primary',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-gray-100 text-gray-600',
    match: 'bg-gradient-to-r from-pink-500/15 to-primary/15 text-primary',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${colors[color]}`}>
      {children}
    </span>
  );
}

// Icons
const UserIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const BriefcaseIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg>;
const HeartIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>;
const MapPinIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>;
const PhoneIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>;

function formatPhone(phone) {
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  return phone;
}

export default MatrimonialModal;
