'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const DonateSidebar = () => {
  const { t } = useLanguage();
  return (
    <aside className="space-y-8">
      {/* Fund Allocation Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full" />
          {t('Fund Allocation', 'कोष आवंटन')}
        </h2>
        <div className="space-y-6">
          <AllocationItem label={t('Education & Scholarships', 'शिक्षा एवं छात्रवृत्ति')} percentage={60} color="bg-primary" />
          <AllocationItem label={t('Hostel Maintenance', 'छात्रावास रख-रखाव')} percentage={25} color="bg-blue-500" />
          <AllocationItem label={t('Community Events', 'सामुदायिक कार्यक्रम')} percentage={15} color="bg-green-500" />
        </div>
        <p className="text-xs text-gray-400 mt-8 leading-relaxed">
          {t('* Our allocation is audited quarterly by the Sabha board to ensure 100% transparency.', '* 100% पारदर्शिता सुनिश्चित करने के लिए सभा बोर्ड द्वारा हर तिमाही आवंटन का ऑडिट किया जाता है।')}
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full" />
          {t('Secure Payment', 'सुरक्षित भुगतान')}
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed flex gap-3">
          <ShieldCheck size={20} className="text-green-600 shrink-0 mt-0.5" />
          {t(
            'Donations are processed securely by Razorpay. Pay with UPI, cards, net banking or wallets.',
            'दान का भुगतान Razorpay द्वारा सुरक्षित रूप से किया जाता है। UPI, कार्ड, नेट बैंकिंग या वॉलेट से भुगतान करें।'
          )}
        </p>
      </div>
    </aside>
  );
};

const AllocationItem = ({ label, percentage, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      <span className="font-bold text-gray-900">{percentage}%</span>
    </div>
    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full transition-all duration-1000`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

export default DonateSidebar;
