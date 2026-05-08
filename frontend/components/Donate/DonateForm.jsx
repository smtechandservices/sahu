import React from 'react';

const DonateForm = ({ formData, setFormData, onDonate }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-primary mb-8">
        Make Your Contribution
      </h2>
      
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Rahul Sahu"
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
            <div className="flex">
              <span className="bg-gray-100 border border-r-0 border-gray-100 rounded-l-xl px-3 flex items-center text-sm text-gray-500">+91</span>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="98765 43210"
                className="w-full bg-gray-50 border border-gray-100 rounded-r-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Purpose of Donation</label>
            <select 
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none cursor-pointer"
            >
              <option value="General Welfare">General Welfare Fund</option>
              <option value="Education">Education & Scholarships</option>
              <option value="Hostel">Hostel Maintenance</option>
              <option value="Medical">Community Medical Aid</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Donation Amount (₹)</label>
          <input 
            type="number" 
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0"
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xl font-bold text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>

        <button 
          onClick={onDonate}
          className="w-full btn-primary py-4 rounded-xl text-base font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-3 mt-4"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          Contribute Now
        </button>
      </div>
    </div>
  );
};

export default DonateForm;
