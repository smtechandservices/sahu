import React from 'react';

const MatrimonialFilterSidebar = ({
  ageMin, setAgeMin,
  ageMax, setAgeMax,
  heightOptions,
  htMin, setHtMin,
  htMax, setHtMax,
  marital, setMarital,
}) => {
  const Label = ({ children }) => (
    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-6 first:mt-0">
      {children}
    </p>
  );

  const inputClasses = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none transition-colors";

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 bg-white border border-gray-200 rounded-xl p-6 h-fit sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Filter Matches</h2>

      <Label>Age (Yrs)</Label>
      <div className="flex items-center gap-3">
        <input 
          type="number" 
          value={ageMin} 
          onChange={e => setAgeMin(e.target.value)} 
          className={inputClasses}
          placeholder="Min"
        />
        <span className="text-gray-400 text-sm">to</span>
        <input 
          type="number" 
          value={ageMax} 
          onChange={e => setAgeMax(e.target.value)} 
          className={inputClasses}
          placeholder="Max"
        />
      </div>

      <Label>Height</Label>
      <div className="flex items-center gap-3">
        <select value={htMin} onChange={e => setHtMin(e.target.value)} className={inputClasses}>
          {heightOptions.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
        <span className="text-gray-400 text-sm">to</span>
        <select value={htMax} onChange={e => setHtMax(e.target.value)} className={inputClasses}>
          {heightOptions.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>

      <Label>Marital Status</Label>
      <div className="space-y-2">
        {Object.keys(marital).map(k => (
          <label key={k} className="flex items-center gap-3 cursor-pointer group">
            <div 
              onClick={() => setMarital(p => ({ ...p, [k]: !p[k] }))} 
              className={`
                w-5 h-5 rounded border flex items-center justify-center transition-all
                ${marital[k] ? 'bg-primary border-primary' : 'bg-white border-gray-300 group-hover:border-primary'}
              `}
            >
              {marital[k] && (
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className={`text-sm ${marital[k] ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{k}</span>
          </label>
        ))}
      </div>

      <Label>Education</Label>
      <select className={inputClasses}>
        <option>Any Bachelors</option>
        <option>Any Masters</option>
        <option>Doctorate</option>
      </select>

      <Label>Location</Label>
      <input placeholder="e.g. Mumbai" className={inputClasses} />

      <button className="w-full btn-primary mt-8 py-3 rounded-lg text-sm shadow-md shadow-primary/10">
        Apply Filters
      </button>
    </aside>
  );
};

export default MatrimonialFilterSidebar;
