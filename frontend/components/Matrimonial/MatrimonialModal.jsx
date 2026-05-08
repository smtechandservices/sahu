import React from 'react';
import Image from 'next/image';

const MatrimonialModal = ({ profile, shortlisted, onShortlist, onClose }) => {
  const isShortlisted = shortlisted.includes(profile.id);

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
            className="absolute top-6 right-6 w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-primary transition-colors shadow-sm"
          >
            ×
          </button>
          
          <div className="flex gap-6 items-start">
            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-200 shadow-md relative border-4 border-white">
              <Image src={profile.avatar} alt={profile.name} fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h2>
              <p className="text-sm text-gray-600 mb-3">
                {profile.age} yrs • {profile.height} • {profile.religion}
              </p>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-primary" />
                {profile.location}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <UserIcon />
              </div>
              <h3 className="font-bold text-gray-900">About Profile</h3>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <p className="text-sm text-gray-600 leading-relaxed italic">
                "{profile.about}"
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <BriefcaseIcon />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">Background</h3>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-400">Education</span> <span className="font-medium">{profile.education}</span></li>
                <li className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-400">Profession</span> <span className="font-medium">{profile.profession}</span></li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <HeartIcon />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">Personal</h3>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-400">Marital Status</span> <span className="font-medium">{profile.marital}</span></li>
                <li className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-400">Gothra</span> <span className="font-medium">{profile.gothra}</span></li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 flex justify-end gap-4 bg-gray-50/50">
          <button 
            onClick={onShortlist}
            className={`
              px-6 py-3 rounded-lg text-sm font-bold flex items-center gap-2 transition-all
              ${isShortlisted 
                ? 'bg-primary/20 text-primary border border-primary' 
                : 'bg-white text-gray-500 border border-gray-200 hover:border-primary hover:text-primary'}
            `}
          >
            <BookmarkIcon fill={isShortlisted ? "currentColor" : "none"} />
            {isShortlisted ? "Shortlisted" : "Shortlist"}
          </button>
          <button className="btn-primary px-8 rounded-lg text-sm shadow-lg shadow-primary/20">
            Send Interest
          </button>
        </div>
      </div>
    </div>
  );
};

const UserIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const BriefcaseIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg>;
const HeartIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>;
const BookmarkIcon = ({ fill }) => <svg width="16" height="16" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>;

export default MatrimonialModal;
