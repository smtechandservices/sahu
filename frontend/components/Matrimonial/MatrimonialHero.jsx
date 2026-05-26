import React from 'react';

const MatrimonialHero = ({ onMyInterest, showMyInterest, onCreateProfile, onViewMyProfile, myProfile }) => {
  return (
    <section className="bg-white pt-12 pb-10 border-b border-gray-100">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4">
              SACRED UNIONS
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Community <span className="text-primary text-serif italic font-medium">Matrimony</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Find your soulmate within our trusted community.
              Bridging traditions with modern preferences for a perfect match.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {myProfile ? (
              <button onClick={() => onViewMyProfile(myProfile)} className="btn-primary rounded-lg px-8 py-3 shadow-lg shadow-primary/20 flex items-center gap-2 justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                My Profile
              </button>
            ) : (
              <button onClick={onCreateProfile} className="btn-primary rounded-lg px-8 py-3 shadow-lg shadow-primary/20 flex items-center justify-center">
                Create Profile
              </button>
            )}
            <button 
              onClick={onMyInterest} 
              className={`btn-outline rounded-lg px-8 py-3 ${showMyInterest ? 'bg-primary/10 border-primary text-primary' : 'bg-white'}`}
            >
              {showMyInterest ? 'Show All' : 'My Interest'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MatrimonialHero;
