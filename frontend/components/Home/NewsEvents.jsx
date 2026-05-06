import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';

const events = [
  {
    date: 'OCT 24, 2024',
    title: 'Annual General Meeting & Cultural Fest',
    desc: 'Join us for the yearly review of community initiatives followed by cultural performances by our youth.',
    image: '/assets/event1.png',
  },
  {
    date: 'NOV 05, 2024',
    title: 'Youth Professional Networking Mixer',
    desc: 'An evening designed for young professionals to connect, share industry insights, and find mentorship.',
    image: '/assets/event2.png',
  },
  {
    date: 'DEC 12, 2024',
    title: 'Daanveer Bhamashah Jayanti Celebration',
    desc: 'Commemorating the legacy of Daanveer Bhamashah with traditional rituals, cultural programs, and community dining.',
    image: '/assets/event3.png',
  },
  {
    date: 'JAN 20, 2025',
    title: 'Community Health & Wellness Camp',
    desc: 'Free health check-ups, specialist consultations, and wellness workshops for all community members.',
    image: '/assets/event4.png',
  }
];

const news = [
  {
    category: 'Education',
    time: '2 days ago',
    title: 'Scholarship Program 2024 Recipients Announced',
  },
  {
    category: 'Community',
    time: '1 week ago',
    title: 'New Centralized Office Inaugurated in the Capital',
  },
  {
    category: 'Health',
    time: '2 weeks ago',
    title: 'Successful Free Medical Camp Concludes with 500+ Attendees',
  }
];

const NewsEvents = () => {
  return (
    <section className="pb-12 bg-white overflow-hidden">
      <div className="px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Upcoming Events Column - Spans 2/3 on desktop */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-4xl font-bold text-slate-900">Upcoming Events</h2>
              <Link href="/events" className="text-yellow-700 font-bold text-sm hover:underline transition-all">
                View Calendar
              </Link>
            </div>
            
            {/* Scrollable Container - Can scroll across full width on desktop */}
            <div className="flex overflow-x-auto flex-nowrap scrollbar-hide gap-8 pb-8 snap-x snap-mandatory relative z-0 lg:pr-[40%]">
              {events.map((event, index) => (
                <div key={index} className="min-w-[450px] bg-white rounded-xl border border-yellow-100 overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col snap-start">
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image 
                      src={event.image} 
                      alt={event.title} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-yellow-600 font-bold text-xs uppercase mb-4">
                      <Calendar size={14} />
                      {event.date}
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-slate-900 group-hover:text-yellow-700 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-1">
                      {event.desc}
                    </p>
                    <Link href="/register" className="text-yellow-700 font-bold text-sm hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Register to Attend
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Latest News Column - Positioned to the right */}
          <div className="flex flex-col lg:pl-8 bg-white z-10">
            <h2 className="text-4xl font-bold text-slate-900 mb-12">Latest News</h2>
            
            <div className="space-y-6 flex-1 bg-white">
              {news.map((item, index) => (
                <div key={index} className="bg-white p-8 rounded-xl border border-yellow-100 hover:shadow-md transition-all duration-300 group cursor-pointer">
                  <div className="text-slate-500 text-sm mb-2 flex items-center gap-2">
                    <span className="font-medium text-slate-700">{item.category}</span>
                    <span>•</span>
                    <span>{item.time}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-yellow-700 transition-colors leading-tight">
                    {item.title}
                  </h3>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-10 bg-slate-50 border border-slate-200 py-4 rounded-md font-bold text-slate-700 hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
              View All News
            </button>
          </div>
          
        </div>
        {/* Subtle gradient overlay to enhance the "scroll under" effect */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[35%] bg-gradient-to-r from-transparent via-white/80 to-white z-[5] pointer-events-none"></div>
      </div>
    </section>
  );
};

export default NewsEvents;
