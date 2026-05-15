import React from 'react';

const GOTRA_OPTIONS = [
  'Any', 'Kashyap', 'Bharadwaj', 'Vashisht', 'Gautam', 'Atri',
  'Vishwamitra', 'Jamadagni', 'Shandilya', 'Parashar', 'Garg',
  'Angiras', 'Pulastya', 'Agastya', 'Dhananjay', 'Mudgal',
];

const EDUCATION_OPTIONS = [
  'Any', '10th Pass', '12th Pass', 'Diploma', 'Any Bachelors',
  'B.Tech / BE', 'MBBS / Medical', 'BBA / BCA', 'Any Masters',
  'MBA', 'M.Tech / ME', 'Doctorate (PhD)',
];

const OCCUPATION_OPTIONS = [
  'Any', 'Agriculture', 'Business / Self Employed', 'Government Job',
  'Private Sector', 'Doctor', 'Engineer', 'Teacher / Professor',
  'Lawyer', 'Accountant / CA', 'IT Professional', 'Defence / Police',
];

const INCOME_OPTIONS = [
  'Any', 'Below 2 LPA', '2-5 LPA', '5-10 LPA',
  '10-15 LPA', '15-25 LPA', '25+ LPA',
];

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
  // Apply
  onReset,
}) => {
  const inputClasses =
    'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none transition-colors bg-white';

  const Label = ({ children }) => (
    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 mt-5 first:mt-0">
      {children}
    </p>
  );

  const MARITAL_OPTIONS = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'];
  const MANGLIK_OPTIONS = ['Any', 'Yes', 'No', 'Partial'];
  const COMPLEXION_OPTIONS = ['Any', 'Fair', 'Wheatish', 'Dark'];

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
      <Label>Marital Status</Label>
      <div className="space-y-2">
        {MARITAL_OPTIONS.map(k => (
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

      {/* Gotra */}
      <Label>Gotra</Label>
      <select value={gotra} onChange={e => setGotra(e.target.value)} className={inputClasses}>
        {GOTRA_OPTIONS.map(g => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      {/* Manglik */}
      <Label>Manglik</Label>
      <div className="flex flex-wrap gap-2">
        {MANGLIK_OPTIONS.map(m => (
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

      {/* Complexion */}
      <Label>Complexion</Label>
      <div className="flex flex-wrap gap-2">
        {COMPLEXION_OPTIONS.map(c => (
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

      {/* Education */}
      <Label>Education</Label>
      <select value={education} onChange={e => setEducation(e.target.value)} className={inputClasses}>
        {EDUCATION_OPTIONS.map(e => (
          <option key={e} value={e}>{e}</option>
        ))}
      </select>

      {/* Occupation */}
      <Label>Occupation</Label>
      <select value={occupation} onChange={e => setOccupation(e.target.value)} className={inputClasses}>
        {OCCUPATION_OPTIONS.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>

      {/* Annual Income */}
      <Label>Annual Income</Label>
      <select value={income} onChange={e => setIncome(e.target.value)} className={inputClasses}>
        {INCOME_OPTIONS.map(i => (
          <option key={i} value={i}>{i}</option>
        ))}
      </select>

      {/* Location */}
      <Label>City / Location</Label>
      <input
        value={location}
        onChange={e => setLocation(e.target.value)}
        placeholder="e.g. Mumbai, Raipur..."
        className={inputClasses}
      />
    </aside>
  );
};

export default MatrimonialFilterSidebar;
