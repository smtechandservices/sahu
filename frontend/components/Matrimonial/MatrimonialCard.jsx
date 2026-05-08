import React from 'react';
import Image from 'next/image';

const MatrimonialCard = ({ profile, liked, onLike, onView }) => {
  const isLiked = liked.includes(profile.id);

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col md:flex-row group hover:shadow-lg transition-all duration-300">
      {/* Avatar Section */}
      <div className="relative w-full md:w-48 h-64 md:h-auto flex-shrink-0 bg-gray-100 overflow-hidden">
        <Image 
          src={profile.avatar} 
          alt={profile.name} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] font-bold text-green-700 uppercase tracking-wider">Verified</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 flex flex-col relative">
        <button 
          onClick={(e) => { e.stopPropagation(); onLike(); }} 
          className="absolute top-6 right-6 transition-transform active:scale-125"
        >
          <svg 
            width="22" height="22" viewBox="0 0 24 24" 
            fill={isLiked ? "#EAB308" : "none"} 
            stroke={isLiked ? "#EAB308" : "#9CA3AF"} 
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>

        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-0.5 group-hover:text-primary transition-colors">
            {profile.name}
          </h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            ID: {profile.id}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6">
          <DetailItem icon={<UserIcon />} text={`${profile.age} Yrs, ${profile.height}`} />
          <DetailItem icon={<BookIcon />} text={profile.education} />
          <DetailItem icon={<BriefcaseIcon />} text={profile.profession} />
          <DetailItem icon={<MapPinIcon />} text={profile.location} />
        </div>

        <p className="text-sm text-gray-500 italic mb-6 line-clamp-2">
          "{profile.quote}"
        </p>

        <div className="mt-auto pt-4 border-t border-gray-50">
          <button 
            onClick={onView}
            className="w-full btn-primary !py-2.5 rounded-lg text-xs tracking-wide flex items-center justify-center gap-2 group/btn"
          >
            <HeartIcon />
            <span>Express Interest</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-gray-600">
    <div className="text-gray-400 flex-shrink-0">{icon}</div>
    <span className="text-xs truncate">{text}</span>
  </div>
);

// Icons
const UserIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const BookIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>;
const BriefcaseIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg>;
const MapPinIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>;
const HeartIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>;

export default MatrimonialCard;
