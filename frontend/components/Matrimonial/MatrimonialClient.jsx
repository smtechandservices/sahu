"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import MatrimonialHero from "./MatrimonialHero";
import MatrimonialFilterSidebar from "./MatrimonialFilterSidebar";
import MatrimonialCard from "./MatrimonialCard";
import MatrimonialModal from "./MatrimonialModal";
import CreateProfileModal from "./CreateProfileModal";
import EditProfileModal from "./EditProfileModal";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { useLanguage } from '../../context/LanguageContext';

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMyInterest, setShowMyInterest] = useState(false);
  const [liked, setLiked] = useState([]); // profile IDs we sent interest to (server-synced)
  const [matches, setMatches] = useState([]); // mutual interest profile IDs
  const [receivedProfiles, setReceivedProfiles] = useState([]); // profiles that sent interest to us
  const { t, tv } = useLanguage();

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

  // --- Dynamic Filter Options (populated from API) ---
  const [filterOptions, setFilterOptions] = useState({
    gotra: [], education: [], occupation: [], annual_income: [],
    city: [], marital_status: [], manglik: [], complexion: [],
  });

  // --- Pagination ---
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);



  const formatProfile = (p) => ({
    id: p.id,
    userId: p.user,
    name: p.user_detail?.name || "Unknown",
    contactPhone: p.contact_phone || null,
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
      ? p.photo
      : p.gender === "Male"
      ? "/assets/avatar_male.png"
      : "/assets/avatar_female.png",
    bgColor: p.gender === "Male" ? "#1a7a6e" : "#1a2a4a",
    payment: p.payment || null, // own profile only, when the fee was paid
  });

  const loadMatrimonialData = async () => {
    const { fetchApi } = await import("../../lib/api");
    const [allData, sentData, receivedData, options] = await Promise.all([
      fetchApi("/matrimonial/"),
      fetchApi("/matrimonial/my_sent_interests/"),
      fetchApi("/matrimonial/received_interests/"),
      fetchApi("/matrimonial/filter_options/"),
    ]);
    setProfiles(allData.map(formatProfile));
    setLiked(sentData.profile_ids || []);
    setMatches(sentData.match_ids || []);
    setReceivedProfiles(
      Array.isArray(receivedData) ? receivedData.map(formatProfile) : []
    );
    if (options && typeof options === "object") {
      setFilterOptions(options);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      if (typeof window !== "undefined") window.location.href = "/login";
      return;
    }

    loadMatrimonialData()
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

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
    setSearchQuery("");
  };

  const myProfile = profiles.find((p) => p.userId === user?.id) || null;

  // Toggle send interest — syncs with backend
  const handleToggleInterest = async (profileId) => {
    if (!myProfile) {
      Swal.fire({
        title: t('Profile Required', 'प्रोफ़ाइल आवश्यक है'),
        text: t('You need a matrimonial profile to send interest. Create your profile now?', 'रुचि भेजने के लिए आपकी वैवाहिक प्रोफ़ाइल होनी चाहिए। क्या अभी प्रोफ़ाइल बनाएँ?'),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EAB308",
        cancelButtonColor: "#d33",
        confirmButtonText: t('Yes, create it!', 'हाँ, बनाएँ!'),
        cancelButtonText: t('Cancel', 'रद्द करें')
      }).then((result) => {
        if (result.isConfirmed) {
          setShowCreateModal(true);
        }
      });
      return;
    }

    const alreadyLiked = liked.includes(profileId);
    setLiked((prev) =>
      alreadyLiked ? prev.filter((x) => x !== profileId) : [...prev, profileId]
    );
    try {
      const { fetchApi } = await import("../../lib/api");
      await fetchApi(`/matrimonial/${profileId}/interest/`, {
        method: alreadyLiked ? "DELETE" : "POST",
      });
      await loadMatrimonialData();
    } catch (err) {
      setLiked((prev) =>
        alreadyLiked ? [...prev, profileId] : prev.filter((x) => x !== profileId)
      );
      const msg =
        err?.data?.error ||
        (typeof err?.data === "string" ? err.data : null) ||
        t('Could not update interest. Please try again.', 'रुचि अपडेट नहीं हो सकी। कृपया फिर से प्रयास करें।');
      Swal.fire({
        icon: "error",
        title: t('Interest Failed', 'रुचि भेजना विफल'),
        text: msg,
        confirmButtonColor: "#EAB308",
      });
      console.error(err);
    }
  };

  // Derived filtered list
  const filteredProfiles = useMemo(() => {
    const receivedIds = new Set(receivedProfiles.map(p => p.id));

    const browseList = profiles.filter(p => {
      // Exclude current user's own profile
      if (p.userId === user?.id) return false;

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

      // My Interest Filter — show only profiles I sent interest to (received shown separately below)
      if (showMyInterest) {
        if (!liked.includes(p.id)) return false;
      }

      // Gender
      if (gender !== "Any" && p.gender !== gender.toLowerCase()) return false;

      // Age
      if (ageMin && p.age < parseInt(ageMin)) return false;
      if (ageMax && p.age > parseInt(ageMax)) return false;

      // Marital status (multi-select)
      if (maritalStatus.length > 0 && !maritalStatus.includes(p.marital)) return false;

      // Gotra
      if (gotra !== "Any" && p.gothra !== gotra) return false;

      // Manglik
      if (manglik !== "Any" && p.manglik !== manglik) return false;

      // Complexion
      if (complexion !== "Any" && p.complexion !== complexion) return false;

      // Education
      if (education !== "Any" && !p.education.toLowerCase().includes(education.toLowerCase()))
        return false;

      // Occupation
      if (occupation !== "Any" && !p.profession.toLowerCase().includes(occupation.toLowerCase()))
        return false;

      // Location
      if (location && !p.location.toLowerCase().includes(location.toLowerCase())) return false;

      // Annual Income
      if (income !== "Any" && p.annual_income !== income) return false;

      return true;
    });

    // In "My Interest" mode, append received profiles (deduplicated)
    let result = browseList;
    if (showMyInterest) {
      const browseIds = new Set(browseList.map(p => p.id));
      const extraReceived = receivedProfiles.filter(p => !browseIds.has(p.id) && p.userId !== user?.id);
      result = [...browseList, ...extraReceived];
    }

    const matchSet = new Set(matches);
    return [...result].sort((a, b) => {
      const aMatch = matchSet.has(a.id);
      const bMatch = matchSet.has(b.id);
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
  }, [profiles, receivedProfiles, searchQuery, showMyInterest, liked, matches, gender, ageMin, ageMax, maritalStatus, gotra, manglik, complexion, education, occupation, income, location, user]);

  // Reset to page 1 whenever filters change
  useEffect(() => { setCurrentPage(1); }, [filteredProfiles]);

  const totalPages = Math.ceil(filteredProfiles.length / ITEMS_PER_PAGE);
  const paginatedProfiles = filteredProfiles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (authLoading || loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">{t('Loading profiles…', 'प्रोफ़ाइल लोड हो रही हैं…')}</p>
        </div>
      </div>
    );

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen pb-20">
        <MatrimonialHero />

        <div className="px-4 sm:px-6 md:px-8 mt-10">
          {/* Action bar — above filters and content */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-sm text-gray-400 font-medium">
                {t(`${filteredProfiles.length} profiles found`, `${filteredProfiles.length} प्रोफ़ाइल मिलीं`)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMyInterest(!showMyInterest)}
                className={`cursor-pointer btn-outline rounded-lg px-5 py-2.5 text-sm font-bold ${showMyInterest ? 'bg-primary/10 border-primary text-primary' : 'bg-white'}`}
              >
                {showMyInterest ? t('Show All', 'सभी दिखाएँ') : t('My Interest', 'मेरी रुचि')}
              </button>
              {myProfile ? (
                <button
                  onClick={() => setSelectedProfile(myProfile)}
                  className="cursor-pointer btn-primary rounded-lg px-5 py-2.5 text-sm font-bold shadow-md shadow-primary/20 flex items-center gap-2"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                  {t('My Profile', 'मेरी प्रोफ़ाइल')}
                </button>
              ) : (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="cursor-pointer btn-primary rounded-lg px-5 py-2.5 text-sm font-bold shadow-md shadow-primary/20"
                >
                  {t('Create Profile', 'प्रोफ़ाइल बनाएँ')}
                </button>
              )}
            </div>
          </div>

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
              filterOptions={filterOptions}
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
                    placeholder={t('Search by name, ID, or city…', 'नाम, आईडी या शहर से खोजें…')}
                    className="w-full bg-gray-50 border-none rounded-lg py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <span className="text-sm text-gray-400 whitespace-nowrap hidden sm:inline">
                    {t('Sort by:', 'क्रम:')} <span className="text-gray-900 font-bold">{t('Newest', 'नवीनतम')}</span>
                  </span>
                  <div className="h-8 w-px bg-gray-100 hidden sm:block" />
                  <p className="text-sm text-gray-900 font-bold whitespace-nowrap">
                    {filteredProfiles.length}{" "}
                    <span className="text-gray-400 font-normal">{t('Results', 'परिणाम')}</span>
                  </p>
                </div>
              </div>

              {/* Active Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {gender !== "Any" && (
                  <FilterPill label={`${t('Gender', 'लिंग')}: ${tv(gender)}`} onRemove={() => setGender("Any")} />
                )}
                {gotra !== "Any" && (
                  <FilterPill label={`${t('Gotra', 'गोत्र')}: ${gotra}`} onRemove={() => setGotra("Any")} />
                )}
                {manglik !== "Any" && (
                  <FilterPill label={`${t('Manglik', 'मांगलिक')}: ${tv(manglik)}`} onRemove={() => setManglik("Any")} />
                )}
                {complexion !== "Any" && (
                  <FilterPill label={`${t('Complexion', 'रंग')}: ${tv(complexion)}`} onRemove={() => setComplexion("Any")} />
                )}
                {maritalStatus.length > 0 && maritalStatus[0] !== "Never Married" && (
                  <FilterPill label={`${t('Status', 'स्थिति')}: ${maritalStatus.map(tv).join(", ")}`} onRemove={() => setMaritalStatus(["Never Married"])} />
                )}
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {paginatedProfiles.map(p => (
                  <MatrimonialCard
                    key={p.id}
                    profile={p}
                    liked={liked}
                    isMatch={matches.includes(p.id)}
                    onLike={() => handleToggleInterest(p.id)}
                    onView={() => setSelectedProfile(p)}
                    receivedInterest={
                      !matches.includes(p.id) &&
                      receivedProfiles.some((r) => r.id === p.id)
                    }
                  />
                ))}
                {filteredProfiles.length === 0 && (
                  <div className="xl:col-span-2 bg-white rounded-2xl p-16 text-center border border-dashed border-gray-200">
                    <svg className="mx-auto mb-4 text-gray-200" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
                    </svg>
                    <p className="text-gray-400 font-bold text-lg">{t('No profiles match your filters', 'आपके फ़िल्टर से कोई प्रोफ़ाइल मेल नहीं खाती')}</p>
                    <p className="text-gray-300 text-sm mt-1">{t('Try adjusting your filter criteria', 'फ़िल्टर बदलकर देखें')}</p>
                    <button onClick={handleReset} className="mt-4 text-primary font-bold text-sm hover:underline">
                      {t('Reset Filters', 'फ़िल्टर रीसेट करें')}
                    </button>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  total={filteredProfiles.length}
                  perPage={ITEMS_PER_PAGE}
                  onChange={page => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Create Profile Modal */}
      <CreateProfileModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={async () => {
          setShowCreateModal(false);
          try {
            await loadMatrimonialData();
          } catch (err) {
            console.error(err);
          }
        }}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setSelectedProfile(null); }}
        profile={selectedProfile}
      />

      {/* Profile Modal */}
      {selectedProfile && (
        <MatrimonialModal
          profile={selectedProfile}
          liked={liked}
          isMatch={matches.includes(selectedProfile.id)}
          onLike={() => handleToggleInterest(selectedProfile.id)}
          isOwn={selectedProfile?.userId === user?.id}
          onEdit={() => { setShowEditModal(true); }}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </>
  );
}

function Pagination({ currentPage, totalPages, total, perPage, onChange }) {
  const { lang, t } = useLanguage();
  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  // Build page numbers with ellipsis
  const pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('…');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('…');
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col items-center gap-3 pt-8">
      <p className="text-sm text-gray-400">
        {lang === 'hi' ? (
          <>कुल <span className="font-bold text-gray-700">{total}</span> में से <span className="font-bold text-gray-700">{from}–{to}</span> प्रोफ़ाइल</>
        ) : (
          <>Showing <span className="font-bold text-gray-700">{from}–{to}</span> of <span className="font-bold text-gray-700">{total}</span> profiles</>
        )}
      </p>
      <div className="flex items-center gap-1.5">
        {/* Prev */}
        <button
          onClick={() => onChange(currentPage - 1)}
          aria-label={t('Previous page', 'पिछला पृष्ठ')}
          disabled={currentPage === 1}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
        </button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-bold transition-all ${
                p === currentPage
                  ? 'bg-primary border-primary text-white shadow-md shadow-primary/25'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-primary hover:text-primary'
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onChange(currentPage + 1)}
          aria-label={t('Next page', 'अगला पृष्ठ')}
          disabled={currentPage === totalPages}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </div>
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
