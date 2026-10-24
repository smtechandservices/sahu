"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import AccommodationHero from "./AccommodationHero";
import AccommodationFilterSidebar from "./AccommodationFilterSidebar";
import AccommodationCard from "./AccommodationCard";
import Pagination from "../Pagination/Pagination";
import { useAuth } from "../../context/AuthContext";
import { fetchApi } from "../../lib/api";
import { Search, History, Calendar, Clock, MapPin, Loader2 } from "lucide-react";
import { useLanguage } from '../../context/LanguageContext';

const serviceTypes = ["Hostel", "Community Hall", "Guest Rooms", "Library"];
const allTypesSelected = () => Object.fromEntries(serviceTypes.map((type) => [type, true]));
const ALL_LOCATIONS = "All Locations";

export default function AccommodationClient() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' or 'enquiries'
  const [selectedTypes, setSelectedTypes] = useState(allTypesSelected);
  const [selectedLocation, setSelectedLocation] = useState(ALL_LOCATIONS);
  const [accommodations, setAccommodations] = useState([]);
  const [myEnquiries, setMyEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const { t, tv } = useLanguage();

  useEffect(() => {
    fetchApi('/accommodations/')
      .then(data => setAccommodations(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'enquiries' && user) {
      setEnquiriesLoading(true);
      fetchApi('/bookings/')
        .then(data => setMyEnquiries(data))
        .catch(err => console.error(err))
        .finally(() => setEnquiriesLoading(false));
    }
  }, [activeTab, user]);

  const locations = useMemo(() => {
    const unique = [
      ...new Set(
        accommodations.map((a) => a.location).filter((loc) => loc && loc.trim())
      ),
    ].sort((a, b) => a.localeCompare(b));
    return [ALL_LOCATIONS, ...unique];
  }, [accommodations]);

  useEffect(() => {
    if (selectedLocation !== ALL_LOCATIONS && !locations.includes(selectedLocation)) {
      setSelectedLocation(ALL_LOCATIONS);
    }
  }, [locations, selectedLocation]);

  const toggleType = (type) => {
    setSelectedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const clearFilters = () => {
    setSelectedTypes(allTypesSelected());
    setSelectedLocation(ALL_LOCATIONS);
  };

  const filtered = accommodations.filter((a) => {
    const typeMatch = selectedTypes[a.type];
    const locMatch =
      selectedLocation === ALL_LOCATIONS || a.location === selectedLocation;
    return typeMatch && locMatch;
  });

  // --- Pagination ---
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever filters change
  useEffect(() => { setCurrentPage(1); }, [filtered.length, selectedTypes, selectedLocation]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen pb-20">
        <AccommodationHero />

        <div className="px-4 sm:px-6 md:px-8 mt-10 mx-auto">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-sm text-gray-400 font-medium">
                {t(`${filtered.length} accommodations found`, `${filtered.length} आवास मिले`)}
              </p>
            </div>
            {user && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('explore')}
                  className={`cursor-pointer flex items-center gap-2 btn-outline rounded-lg px-5 py-2.5 text-sm font-bold ${activeTab === 'explore' ? 'bg-primary/10 border-primary text-primary' : 'bg-white'}`}
                >
                  <Search size={16} />
                  {t('Explore', 'खोजें')}
                </button>
                <button
                  onClick={() => setActiveTab('enquiries')}
                  className={`cursor-pointer flex items-center gap-2 btn-outline rounded-lg px-5 py-2.5 text-sm font-bold ${activeTab === 'enquiries' ? 'bg-primary/10 border-primary text-primary' : 'bg-white'}`}
                >
                  <History size={16} />
                  {t('My Enquiries', 'मेरी पूछताछ')}
                </button>
              </div>
            )}
          </div>

          {activeTab === 'explore' ? (
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Filters Sidebar */}
              <AccommodationFilterSidebar 
                serviceTypes={serviceTypes}
                locations={locations}
                selectedTypes={selectedTypes}
                toggleType={toggleType}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                clearFilters={clearFilters}
              />

              {/* Cards Grid */}
              <div className="flex-1">
                {loading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                    <p className="text-xl font-bold text-gray-400">{t('No results found', 'कोई परिणाम नहीं मिला')}</p>
                    <p className="text-gray-400 mt-2">{t("Try adjusting your filters to find what you're looking for.", 'जो आप खोज रहे हैं उसे पाने के लिए फ़िल्टर बदलकर देखें।')}</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {paginated.map((item) => (
                        <AccommodationCard key={item.id} item={item} />
                      ))}
                    </div>
                    {totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        total={filtered.length}
                        perPage={ITEMS_PER_PAGE}
                        onChange={page => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">{t('Your Recent Enquiries', 'आपकी हाल की पूछताछ')}</h2>
                  <p className="text-gray-500 font-medium text-sm">{t('Track the status of your accommodation requests.', 'अपने आवास अनुरोधों की स्थिति देखें।')}</p>
                </div>
              </div>

              {enquiriesLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
              ) : myEnquiries.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl font-bold text-gray-400">{t('No enquiries yet', 'अभी तक कोई पूछताछ नहीं')}</p>
                  <p className="text-gray-400 mt-2">{t('Any accommodation requests you make will appear here.', 'आपके द्वारा किए गए सभी आवास अनुरोध यहाँ दिखेंगे।')}</p>
                  <button 
                    onClick={() => setActiveTab('explore')}
                    className="mt-6 text-primary font-bold hover:underline"
                  >
                    {t('Start Exploring', 'खोज शुरू करें')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {myEnquiries.map((enq) => (
                    <div key={enq.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-5">
                          <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <MapPin className="text-primary w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{enq.accommodation_title}</h3>
                            <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-400">
                              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary" /> {enq.check_in} - {enq.check_out}</span>
                              <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary" /> {enq.check_in_time || '12:00'} - {enq.check_out_time || '11:00'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between md:justify-end gap-10 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('Status', 'स्थिति')}</p>
                            <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full ${
                              enq.status === 'Confirmed' ? 'bg-green-100 text-green-600' : 
                              enq.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 
                              enq.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'
                            }`}>
                              {tv(enq.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
