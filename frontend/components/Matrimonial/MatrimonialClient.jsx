"use client";

import { useState, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import MatrimonialHero from "./MatrimonialHero";
import MatrimonialFilterSidebar from "./MatrimonialFilterSidebar";
import MatrimonialCard from "./MatrimonialCard";
import MatrimonialModal from "./MatrimonialModal";
import { useAuth } from "../../context/AuthContext";

const heightOptions = ["4' 6\"","4' 8\"","4'10\"","5' 0\"","5' 1\"","5' 2\"","5' 3\"","5' 4\"","5' 5\"","5' 6\"","5' 7\"","5' 8\"","5' 9\"","5'10\"","5'11\"","6' 0\"","6' 1\"","6' 2\"","6' 3\""];

export default function MatrimonialClient() {
  const { user, loading: authLoading } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProfile, setSelectedProfile] = useState(null);
  const [marital, setMarital] = useState({ "Never Married": true, Divorced: false, Widowed: false });
  const [ageMin, setAgeMin] = useState("21");
  const [ageMax, setAgeMax] = useState("35");
  const [htMin, setHtMin] = useState("5' 0\"");
  const [htMax, setHtMax] = useState("6' 0\"");
  const [shortlisted, setShortlisted] = useState([]);
  const [liked, setLiked] = useState([]);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return;
    }

    import('../../lib/api').then(({ fetchApi }) => {
      fetchApi('/matrimonial/')
        .then(data => {
          // Map to match frontend structure
          const formatted = data.map(p => ({
            id: p.id,
            name: p.user_detail?.name || 'Unknown',
            age: p.age,
            height: "5' 5\"", // Hardcoded for now unless backend adds height
            education: p.education,
            profession: p.occupation,
            location: p.city,
            gender: p.gender.toLowerCase(),
            quote: p.bio.substring(0, 50) + "...",
            about: p.bio,
            religion: "Hindu", // Hardcoded
            marital: "Never Married",
            gothra: "Sahu",
            avatar: p.photo ? `data:${p.photo_mimetype || 'image/jpeg'};base64,${p.photo}` : (p.gender === 'Male' ? "/assets/avatar_male.png" : "/assets/avatar_female.png"),
            bgColor: p.gender === 'Male' ? "#1a7a6e" : "#1a2a4a",
          }));
          setProfiles(formatted);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    });
  }, [user, authLoading]);

  if (authLoading || loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen pb-20">
        <MatrimonialHero />

        <div className="px-8 mt-10">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <MatrimonialFilterSidebar 
              ageMin={ageMin} setAgeMin={setAgeMin}
              ageMax={ageMax} setAgeMax={setAgeMax}
              heightOptions={heightOptions}
              htMin={htMin} setHtMin={setHtMin}
              htMax={htMax} setHtMax={setHtMax}
              marital={marital} setMarital={setMarital}
            />

            {/* Main Content */}
            <div className="flex-1 space-y-8">
              {/* Search & Actions Bar */}
              <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative flex-1 w-full">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                  </div>
                  <input 
                    placeholder="Search by Profile ID or Name" 
                    className="w-full bg-gray-50 border-none rounded-lg py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <span className="text-sm text-gray-400 whitespace-nowrap hidden sm:inline">Sort by: <span className="text-gray-900 font-bold">Newest</span></span>
                  <div className="h-8 w-px bg-gray-100 hidden sm:block" />
                  <p className="text-sm text-gray-900 font-bold whitespace-nowrap">{profiles.length} <span className="text-gray-400 font-normal">Results</span></p>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {profiles.map(p => (
                  <MatrimonialCard 
                    key={p.id} 
                    profile={p} 
                    liked={liked} 
                    onLike={() => setLiked(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])} 
                    onView={() => setSelectedProfile(p)} 
                  />
                ))}
                {profiles.length === 0 && <p>No profiles found.</p>}
              </div>

              {/* Pagination */}
              {profiles.length > 0 && (
                <div className="flex justify-center items-center gap-3 pt-8">
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-primary hover:text-primary transition-all cursor-pointer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border bg-primary border-primary text-white shadow-lg shadow-primary/20 font-bold text-sm transition-all cursor-pointer">1</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-primary hover:text-primary transition-all cursor-pointer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Profile Modal */}
      {selectedProfile && (
        <MatrimonialModal 
          profile={selectedProfile} 
          shortlisted={shortlisted} 
          onShortlist={() => setShortlisted(prev => prev.includes(selectedProfile.id) ? prev.filter(x => x !== selectedProfile.id) : [...prev, selectedProfile.id])} 
          onClose={() => setSelectedProfile(null)} 
        />
      )}
    </>
  );
}
