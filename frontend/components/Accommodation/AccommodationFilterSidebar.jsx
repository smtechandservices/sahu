import React, { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

const AccommodationFilterSidebar = ({
  serviceTypes,
  locations,
  selectedTypes,
  toggleType,
  selectedLocation,
  setSelectedLocation,
  clearFilters
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      {/* Mobile toggle button */}
      <button
        className="lg:hidden w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 mb-2 shadow-sm font-bold text-gray-700"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span className="flex items-center gap-2 text-sm">
          <SlidersHorizontal size={16} className="text-primary" />
          Filters
        </span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${mobileOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter panel */}
      <div className={`${mobileOpen ? 'block' : 'hidden'} lg:block bg-white border border-gray-200 rounded-lg p-6 h-fit lg:sticky top-24`}>
        <div className="flex justify-between items-center mb-6">
          <span className="font-bold text-gray-900">Filters</span>
          <button
            onClick={clearFilters}
            className="text-xs text-primary font-semibold hover:underline bg-none border-none cursor-pointer p-0"
          >
            Clear All
          </button>
        </div>

        <div className="mb-8">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            Service Type
          </p>
          <div className="flex flex-col gap-3">
            {serviceTypes.map((type) => (
              <label
                key={type}
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => toggleType(type)}
              >
                <div className={`
                  w-5 h-5 rounded border flex items-center justify-center transition-all
                  ${selectedTypes[type]
                    ? 'bg-primary border-primary'
                    : 'bg-white border-gray-300 group-hover:border-primary'}
                `}>
                  {selectedTypes[type] && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm transition-colors ${selectedTypes[type] ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                  {type}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            Location
          </p>
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-700 appearance-none cursor-pointer outline-none focus:border-primary transition-colors"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AccommodationFilterSidebar;
