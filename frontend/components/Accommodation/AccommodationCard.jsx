import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import EnquiryModal from './EnquiryModal';
import { useLanguage } from '../../context/LanguageContext';

const AccommodationCard = ({ item }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const { t } = useLanguage();

  const photos = item.images?.length ? item.images.map((p) => p.image) : [item.image || '/placeholder.png'];
  const showPhoto = (step) => setPhotoIndex((i) => (i + step + photos.length) % photos.length);

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
            unoptimized
            src={photos[photoIndex] || photos[0]}
            alt={item.title || t('Accommodation', 'आवास')}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => showPhoto(-1)}
                aria-label={t('Previous photo', 'पिछली फ़ोटो')}
                className="cursor-pointer absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-gray-800 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => showPhoto(1)}
                aria-label={t('Next photo', 'अगली फ़ोटो')}
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-gray-800 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPhotoIndex(i)}
                    aria-label={`${t('Photo', 'फ़ोटो')} ${i + 1}`}
                    className={`cursor-pointer h-1.5 rounded-full transition-all ${i === photoIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'}`}
                  />
                ))}
              </div>
            </>
          )}
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

          {/* Location */}
          <div className="flex items-end justify-between mb-6">
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
            {t('Send Enquiry', 'पूछताछ भेजें')}
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
