"use client";

import { HandHeart } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

const Support = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleContribute = () => {
    if (!user) {
      router.push('/login');
    } else {
      router.push('/donate');
    }
  };

  return (
    <section className="pb-8 bg-white">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="bg-[#f5b301] rounded-xl p-6 sm:p-10 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <div className="max-w-2xl text-left">
            <h2 className="text-[#502600] text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 leading-tight">
              Support Our Community Initiatives
            </h2>
            <p className="text-[#502600] text-base sm:text-lg lg:text-xl leading-relaxed font-medium">
              Your contributions help fund educational scholarships, maintain our hostels, and organize welfare camps. Together, we can build a stronger, more resilient heritage.
            </p>
          </div>

          <div className="shrink-0 w-full lg:w-auto text-center">
            <button
              onClick={handleContribute}
              disabled={!user}
              className={`w-full lg:w-auto bg-[#c08200] hover:bg-[#a06c00] text-white px-8 py-4 sm:px-12 sm:py-6 rounded-lg font-bold flex items-center justify-center gap-3 sm:gap-4 transition-all shadow-lg group ${!user ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
            >
              <HandHeart className={`${user ? 'group-hover:scale-110' : ''} transition-transform`} size={24} />
              <span className="text-lg sm:text-xl">Contribute Now</span>
            </button>
            {!user && (
              <p className="text-[#502600] text-sm mt-3 font-bold animate-pulse">
                Please login to contribute to community initiatives
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;
