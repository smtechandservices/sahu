import React from 'react';

const MatrimonialFilterSidebar = ({
  // Age
  ageMin, setAgeMin, ageMax, setAgeMax,
  // Gender
  gender, setGender,
  // Marital Status
  maritalStatus, setMaritalStatus,
  // Gotra
  gotra, setGotra,
  // Manglik
  manglik, setManglik,
  // Complexion
  complexion, setComplexion,
  // Education
  education, setEducation,
  // Occupation
  occupation, setOccupation,
  // Income
  income, setIncome,
  // Location
  location, setLocation,
  // Dynamic options from API
  filterOptions = {},
  // Apply
  onReset,
}) => {
  const {
    gotra: gotraOptions = [],
    education: educationOptions = [],
    occupation: occupationOptions = [],
    annual_income: incomeOptions = [],
    city: cityOptions = [],
    marital_status: maritalOptions = [],
    manglik: manglikOptions = [],
    complexion: complexionOptions = [],
  } = filterOptions;

  const inputClasses =
    'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none transition-colors bg-white';

  const Label = ({ children }) => (
    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 mt-5 first:mt-0">
      {children}
    </p>
  );

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 bg-white border border-gray-200 rounded-xl p-6 h-fit sticky top-24 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Filter Matches</h2>
        <button
          onClick={onReset}
          className="text-xs text-primary font-bold hover:underline"
        >
          Reset All
        </button>
      </div>

      {/* Gender */}
      <Label>Gender</Label>
      <div className="flex gap-2">
        {['Any', 'Male', 'Female'].map(g => (
          <button
            key={g}
            onClick={() => setGender(g)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              gender === g
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Age */}
      <Label>Age (Yrs)</Label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={ageMin}
          onChange={e => setAgeMin(e.target.value)}
          className={inputClasses}
          placeholder="Min"
          min={18}
          max={80}
        />
        <span className="text-gray-400 text-xs font-medium">–</span>
        <input
          type="number"
          value={ageMax}
          onChange={e => setAgeMax(e.target.value)}
          className={inputClasses}
          placeholder="Max"
          min={18}
          max={80}
        />
      </div>

      {/* Marital Status */}
      {maritalOptions.length > 0 && (
        <>
          <Label>Marital Status</Label>
          <div className="space-y-2">
            {maritalOptions.map(k => (
              <label key={k} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() =>
                    setMaritalStatus(prev =>
                      prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]
                    )
                  }
                  className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                    maritalStatus.includes(k)
                      ? 'bg-primary border-primary'
                      : 'bg-white border-gray-300 group-hover:border-primary'
                  }`}
                >
                  {maritalStatus.includes(k) && (
                    <svg width="9" height="8" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${maritalStatus.includes(k) ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
                  {k}
                </span>
              </label>
            ))}
          </div>
        </>
      )}

      {/* Gotra */}
      {gotraOptions.length > 0 && (
        <>
          <Label>Gotra</Label>
          <select value={gotra} onChange={e => setGotra(e.target.value)} className={inputClasses}>
            <option value="Any">Any</option>
            {gotraOptions.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </>
      )}

      {/* Manglik */}
      {manglikOptions.length > 0 && (
        <>
          <Label>Manglik</Label>
          <div className="flex flex-wrap gap-2">
            {['Any', ...manglikOptions].map(m => (
              <button
                key={m}
                onClick={() => setManglik(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  manglik === m
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Complexion */}
      {complexionOptions.length > 0 && (
        <>
          <Label>Complexion</Label>
          <div className="flex flex-wrap gap-2">
            {['Any', ...complexionOptions].map(c => (
              <button
                key={c}
                onClick={() => setComplexion(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  complexion === c
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Education */}
      {educationOptions.length > 0 && (
        <>
          <Label>Education</Label>
          <select value={education} onChange={e => setEducation(e.target.value)} className={inputClasses}>
            <option value="Any">Any</option>
            {educationOptions.map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </>
      )}

      {/* Occupation */}
      {occupationOptions.length > 0 && (
        <>
          <Label>Occupation</Label>
          <select value={occupation} onChange={e => setOccupation(e.target.value)} className={inputClasses}>
            <option value="Any">Any</option>
            {occupationOptions.map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </>
      )}

      {/* Annual Income */}
      {incomeOptions.length > 0 && (
        <>
          <Label>Annual Income</Label>
          <select value={income} onChange={e => setIncome(e.target.value)} className={inputClasses}>
            <option value="Any">Any</option>
            {incomeOptions.map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </>
      )}

      {/* Location */}
      <Label>City / Location</Label>
      {cityOptions.length > 0 ? (
        <select value={location} onChange={e => setLocation(e.target.value)} className={inputClasses}>
          <option value="">Any</option>
          {cityOptions.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      ) : (
        <input
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="e.g. Mumbai, Raipur..."
          className={inputClasses}
        />
      )}
    </aside>
  );
};

export default MatrimonialFilterSidebar;
