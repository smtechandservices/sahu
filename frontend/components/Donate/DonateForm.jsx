import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const DonateForm = ({ formData, setFormData, onDonate, submitting = false }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user, setFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-primary mb-8">
        {t('Make Your Contribution', 'अपना योगदान दें')}
      </h2>
      
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('Full Name', 'पूरा नाम')}</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('e.g. Rahul Sahu', 'जैसे: राहुल साहू')}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('Phone Number', 'फ़ोन नंबर')}</label>
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
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('Purpose of Donation', 'दान का उद्देश्य')}</label>
            <select 
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none cursor-pointer"
            >
              <option value="General Welfare">{t('General Welfare Fund', 'सामान्य कल्याण कोष')}</option>
              <option value="Education">{t('Education & Scholarships', 'शिक्षा एवं छात्रवृत्ति')}</option>
              <option value="Hostel">{t('Hostel Maintenance', 'छात्रावास रख-रखाव')}</option>
              <option value="Medical">{t('Community Medical Aid', 'सामुदायिक चिकित्सा सहायता')}</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('Donation Amount (₹)', 'दान राशि (₹)')}</label>
          <input 
            type="number" 
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0"
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xl font-bold text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>

        <div className="text-center">
          <button 
            onClick={onDonate}
            disabled={submitting}
            className={`w-full btn-primary py-4 rounded-xl text-base font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-3 mt-4 ${submitting ? 'opacity-70 cursor-wait' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            {submitting ? t('Submitting...', 'भेजा जा रहा है...') : t('Contribute Now', 'अभी योगदान करें')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonateForm;
