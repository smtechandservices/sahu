"use client";

import { useState, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import AccommodationHero from "./AccommodationHero";
import AccommodationFilterSidebar from "./AccommodationFilterSidebar";
import AccommodationCard from "./AccommodationCard";

// removed hardcoded accommodations array

const serviceTypes = ["Hostel", "Community Hall", "Guest Rooms"];
const locations = [
  "All Locations",
  "New Delhi Central",
  "Jaipur Heritage",
  "Mumbai Suburban",
];

// Metadata moved from layout.jsx
// Note: Next.js 13+ client components cannot export metadata directly.
// But since this is a "use client" file, we might need a separate server component for metadata 
// OR just accept it as it is if the user wants it simple. 
// Actually, usually I'd keep the page as a server component and have a client child, 
// but for now I'll stick to the user's request of "no layout file".
// Wait, if I use "use client", I can't export metadata.
// I should split it into a server page and a client component.

export default function AccommodationClient() {
  const [selectedTypes, setSelectedTypes] = useState({
    Hostel: true,
    "Community Hall": true,
    "Guest Rooms": true,
  });
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('../../lib/api').then(({ fetchApi }) => {
      fetchApi('/accommodations/')
        .then(data => setAccommodations(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    });
  }, []);

  const toggleType = (type) => {
    setSelectedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const clearFilters = () => {
    setSelectedTypes({ Hostel: true, "Community Hall": true, "Guest Rooms": true });
    setSelectedLocation("All Locations");
  };

  const filtered = accommodations.filter((a) => {
    const typeMatch = selectedTypes[a.type];
    const locMatch =
      selectedLocation === "All Locations" || a.location === selectedLocation;
    return typeMatch && locMatch;
  });

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen pb-20">
        <AccommodationHero />

        <div className="px-8 mt-10">
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
              {filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                  <p className="text-xl font-bold text-gray-400">No results found</p>
                  <p className="text-gray-400 mt-2">Try adjusting your filters to find what you're looking for.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtered.map((item) => (
                    <AccommodationCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
