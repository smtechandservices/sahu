import { HandHeart } from 'lucide-react';

const Support = () => {
  return (
    <section className="pb-8 bg-white">
      <div className="px-8">
        <div className="bg-[#f5b301] rounded-xl p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl text-left">
            <h2 className="text-[#502600] text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Support Our Community Initiatives
            </h2>
            <p className="text-[#502600] text-lg lg:text-xl  leading-relaxed font-medium">
              Your contributions help fund educational scholarships, maintain our hostels, and organize welfare camps. Together, we can build a stronger, more resilient heritage.
            </p>
          </div>
          
          <div className="shrink-0 w-full lg:w-auto">
            <button className="w-full lg:w-auto bg-[#c08200] hover:bg-[#a06c00] text-white px-12 py-8 font-bold flex items-center justify-center gap-6 transition-all shadow-lg group">
              <HandHeart className="group-hover:scale-110 transition-transform" size={32} />
              <span className="text-2xl">Contribute Now</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;
