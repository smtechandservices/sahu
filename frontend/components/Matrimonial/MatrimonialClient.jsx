"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import MatrimonialHero from "./MatrimonialHero";
import MatrimonialFilterSidebar from "./MatrimonialFilterSidebar";
import MatrimonialCard from "./MatrimonialCard";
import MatrimonialModal from "./MatrimonialModal";
import { useAuth } from "../../context/AuthContext";

// Helper: height_cm → display string e.g. "5' 7\""
function cmToFeet(cm) {
  if (!cm) return "N/A";
  const totalInches = Math.round(cm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}' ${inches}"`;
}

export default function MatrimonialClient() {
  const { user, loading: authLoading } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // --- Filter States ---
  const [gender, setGender] = useState("Any");
  const [ageMin, setAgeMin] = useState("21");
  const [ageMax, setAgeMax] = useState("45");
  const [maritalStatus, setMaritalStatus] = useState(["Never Married"]);
  const [gotra, setGotra] = useState("Any");
  const [manglik, setManglik] = useState("Any");
  const [complexion, setComplexion] = useState("Any");
  const [education, setEducation] = useState("Any");
  const [occupation, setOccupation] = useState("Any");
  const [income, setIncome] = useState("Any");
  const [location, setLocation] = useState("");

  // Applied filters (only applied when user clicks "Apply Filters")
  const [appliedFilters, setAppliedFilters] = useState(null);

  const [shortlisted, setShortlisted] = useState([]);
  const [liked, setLiked] = useState([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      if (typeof window !== "undefined") window.location.href = "/login";
      return;
    }

    import("../../lib/api").then(({ fetchApi }) => {
      fetchApi("/matrimonial/")
        .then(data => {
          const formatted = data.map(p => ({
            id: p.id,
            name: p.user_detail?.name || "Unknown",
            age: p.age,
            height: cmToFeet(p.height_cm),
            height_cm: p.height_cm || null,
            education: p.education,
            profession: p.occupation,
            location: p.city,
            gender: (p.gender || "").toLowerCase(),
            quote: p.bio ? p.bio.substring(0, 60) + "…" : "",
            about: p.bio,
            religion: "Hindu",
            marital: p.marital_status || "Never Married",
            gothra: p.gotra || "—",
            manglik: p.manglik || "No",
            complexion: p.complexion || "—",
            annual_income: p.annual_income || "—",
            mother_tongue: p.mother_tongue || "—",
            family_type: p.family_type || "—",
            avatar: p.photo
              ? `data:${p.photo_mimetype || "image/jpeg"};base64,${p.photo}`
              : p.gender === "Male"
              ? "/assets/avatar_male.png"
              : "/assets/avatar_female.png",
            bgColor: p.gender === "Male" ? "#1a7a6e" : "#1a2a4a",
          }));
          setProfiles(formatted);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    });
  }, [user, authLoading]);

  // Apply filters
  const handleApply = () => {
    setAppliedFilters({
      gender, ageMin, ageMax, maritalStatus,
      gotra, manglik, complexion, education,
      occupation, income, location,
    });
  };

  const handleReset = () => {
    setGender("Any");
    setAgeMin("21");
    setAgeMax("45");
    setMaritalStatus(["Never Married"]);
    setGotra("Any");
    setManglik("Any");
    setComplexion("Any");
    setEducation("Any");
    setOccupation("Any");
    setIncome("Any");
    setLocation("");
    setAppliedFilters(null);
    setSearchQuery("");
  };

  // Derived filtered list
  const filteredProfiles = useMemo(() => {
    const f = appliedFilters;
    return profiles.filter(p => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.location.toLowerCase().includes(q) &&
          !String(p.id).includes(q)
        )
          return false;
      }
      if (!f) return true;

      // Gender
      if (f.gender !== "Any" && p.gender !== f.gender.toLowerCase()) return false;

      // Age
      if (f.ageMin && p.age < parseInt(f.ageMin)) return false;
      if (f.ageMax && p.age > parseInt(f.ageMax)) return false;

      // Marital status (multi-select)
      if (f.maritalStatus.length > 0 && !f.maritalStatus.includes(p.marital)) return false;

      // Gotra
      if (f.gotra !== "Any" && p.gothra !== f.gotra) return false;

      // Manglik
      if (f.manglik !== "Any" && p.manglik !== f.manglik) return false;

      // Complexion
      if (f.complexion !== "Any" && p.complexion !== f.complexion) return false;

      // Education
      if (f.education !== "Any" && !p.education.toLowerCase().includes(f.education.toLowerCase()))
        return false;

      // Occupation
      if (f.occupation !== "Any" && !p.profession.toLowerCase().includes(f.occupation.toLowerCase()))
        return false;

      // Location
      if (f.location && !p.location.toLowerCase().includes(f.location.toLowerCase())) return false;

      return true;
    });
  }, [profiles, appliedFilters, searchQuery]);

  if (authLoading || loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading profiles…</p>
        </div>
      </div>
    );

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen pb-20">
        <MatrimonialHero />

        <div className="px-8 mt-10">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <MatrimonialFilterSidebar
              gender={gender} setGender={setGender}
              ageMin={ageMin} setAgeMin={setAgeMin}
              ageMax={ageMax} setAgeMax={setAgeMax}
              maritalStatus={maritalStatus} setMaritalStatus={setMaritalStatus}
              gotra={gotra} setGotra={setGotra}
              manglik={manglik} setManglik={setManglik}
              complexion={complexion} setComplexion={setComplexion}
              education={education} setEducation={setEducation}
              occupation={occupation} setOccupation={setOccupation}
              income={income} setIncome={setIncome}
              location={location} setLocation={setLocation}
              onApply={handleApply}
              onReset={handleReset}
            />

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Search & Actions Bar */}
              <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative flex-1 w-full">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  </div>
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by name, ID, or city…"
                    className="w-full bg-gray-50 border-none rounded-lg py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <span className="text-sm text-gray-400 whitespace-nowrap hidden sm:inline">
                    Sort by: <span className="text-gray-900 font-bold">Newest</span>
                  </span>
                  <div className="h-8 w-px bg-gray-100 hidden sm:block" />
                  <p className="text-sm text-gray-900 font-bold whitespace-nowrap">
                    {filteredProfiles.length}{" "}
                    <span className="text-gray-400 font-normal">Results</span>
                  </p>
                </div>
              </div>

              {/* Active Filter Pills */}
              {appliedFilters && (
                <div className="flex flex-wrap gap-2">
                  {appliedFilters.gender !== "Any" && (
                    <FilterPill label={`Gender: ${appliedFilters.gender}`} onRemove={() => { setGender("Any"); setAppliedFilters(f => ({ ...f, gender: "Any" })); }} />
                  )}
                  {appliedFilters.gotra !== "Any" && (
                    <FilterPill label={`Gotra: ${appliedFilters.gotra}`} onRemove={() => { setGotra("Any"); setAppliedFilters(f => ({ ...f, gotra: "Any" })); }} />
                  )}
                  {appliedFilters.manglik !== "Any" && (
                    <FilterPill label={`Manglik: ${appliedFilters.manglik}`} onRemove={() => { setManglik("Any"); setAppliedFilters(f => ({ ...f, manglik: "Any" })); }} />
                  )}
                  {appliedFilters.complexion !== "Any" && (
                    <FilterPill label={`Complexion: ${appliedFilters.complexion}`} onRemove={() => { setComplexion("Any"); setAppliedFilters(f => ({ ...f, complexion: "Any" })); }} />
                  )}
                  {appliedFilters.maritalStatus.length > 0 && (
                    <FilterPill label={`Status: ${appliedFilters.maritalStatus.join(", ")}`} onRemove={() => { setMaritalStatus([]); setAppliedFilters(f => ({ ...f, maritalStatus: [] })); }} />
                  )}
                </div>
              )}

              {/* Cards Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredProfiles.map(p => (
                  <MatrimonialCard
                    key={p.id}
                    profile={p}
                    liked={liked}
                    onLike={() =>
                      setLiked(prev =>
                        prev.includes(p.id)
                          ? prev.filter(x => x !== p.id)
                          : [...prev, p.id]
                      )
                    }
                    onView={() => setSelectedProfile(p)}
                  />
                ))}
                {filteredProfiles.length === 0 && (
                  <div className="xl:col-span-2 bg-white rounded-2xl p-16 text-center border border-dashed border-gray-200">
                    <svg className="mx-auto mb-4 text-gray-200" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
                    </svg>
                    <p className="text-gray-400 font-bold text-lg">No profiles match your filters</p>
                    <p className="text-gray-300 text-sm mt-1">Try adjusting your filter criteria</p>
                    <button onClick={handleReset} className="mt-4 text-primary font-bold text-sm hover:underline">
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filteredProfiles.length > 0 && (
                <div className="flex justify-center items-center gap-3 pt-8">
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-primary hover:text-primary transition-all cursor-pointer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border bg-primary border-primary text-white shadow-lg shadow-primary/20 font-bold text-sm transition-all cursor-pointer">
                    1
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-primary hover:text-primary transition-all cursor-pointer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
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
          onShortlist={() =>
            setShortlisted(prev =>
              prev.includes(selectedProfile.id)
                ? prev.filter(x => x !== selectedProfile.id)
                : [...prev, selectedProfile.id]
            )
          }
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </>
  );
}

function FilterPill({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-primary/60 transition-colors">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}
