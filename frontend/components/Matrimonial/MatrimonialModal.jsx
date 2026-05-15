import React from 'react';
import Image from 'next/image';

const MatrimonialModal = ({ profile, shortlisted, onShortlist, liked, onLike, onClose }) => {
  const isShortlisted = shortlisted.includes(profile.id);
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
            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-200 shadow-md relative border-4 border-white">
              <Image src={profile.avatar} alt={profile.name} fill className="object-cover" />
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
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button
            onClick={onShortlist}
            className={`
              px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all
              ${isShortlisted
                ? 'bg-primary/15 text-primary border border-primary'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-primary hover:text-primary'}
            `}
          >
            <BookmarkIcon fill={isShortlisted ? 'currentColor' : 'none'} />
            {isShortlisted ? 'Shortlisted' : 'Shortlist'}
          </button>
          <button 
            onClick={onLike}
            className={`px-7 py-2.5 rounded-lg text-sm shadow-lg shadow-primary/20 transition-all font-bold ${
              isLiked 
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-none' 
                : 'btn-primary'
            }`}
          >
            {isLiked ? 'Interest Sent ✓' : 'Send Interest'}
          </button>
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
const BookmarkIcon = ({ fill }) => <svg width="14" height="14" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>;

export default MatrimonialModal;
