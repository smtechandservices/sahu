import React from 'react';
import Image from 'next/image';

const AdCard = ({ ad }) => {
  const StoreIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );

  const CartIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6" />
    </svg>
  );

  const PhoneIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );

  const LocationIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const CtaIcon = ad.ctaIcon === "store" ? StoreIcon : CartIcon;
  const SecondaryIcon = ad.secondaryIcon === "phone" ? PhoneIcon : LocationIcon;

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
      <div className="relative h-48 w-full overflow-hidden">
        <Image 
          src={ad.image} 
          alt={ad.name} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <p className="text-white text-xs font-medium">Verified Partner</p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">{ad.name}</h3>
          <span 
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm"
            style={{ backgroundColor: ad.categoryColor.bg, color: ad.categoryColor.text }}
          >
            {ad.category}
          </span>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          {ad.description}
        </p>

        <div className="flex gap-3">
          <button className="flex-1 btn-primary !py-2.5 rounded-lg text-xs flex items-center justify-center gap-2">
            <CtaIcon /> 
            <span>{ad.cta}</span>
          </button>
          <button className="w-12 h-11 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors">
            <SecondaryIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdCard;
