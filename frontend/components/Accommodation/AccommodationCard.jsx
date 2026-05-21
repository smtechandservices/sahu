import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import EnquiryModal from './EnquiryModal';

const AccommodationCard = ({ item }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEnquiry = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow group">
        {/* Image with badge */}
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={item.image ? `data:${item.image_mimetype || 'image/jpeg'};base64,${item.image}` : '/placeholder.png'}
            alt={item.title || 'Accommodation'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Badge */}
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-gray-800 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
            {item.badge}
          </span>
        </div>

        {/* Card Body */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
            {item.description}
          </p>

          {/* Price Row */}
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-2xl font-bold text-primary leading-none">
                ₹{item.price}
                <span className="text-xs font-normal text-gray-400 ml-1 italic">{item.unit}</span>
              </p>
            </div>
            {/* Location */}
            <div className="flex items-center gap-1.5 text-gray-400 text-xs bg-gray-50 px-2 py-1 rounded-md">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {item.location}
            </div>
          </div>

          {/* CTA Button */}
          <button 
            onClick={handleEnquiry}
            className="cursor-pointer w-full btn-primary py-3 rounded-lg text-sm tracking-wide font-bold"
          >
            Send Enquiry
          </button>
        </div>
      </div>

      <EnquiryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        accommodation={item} 
      />
    </>
  );
};

export default AccommodationCard;
