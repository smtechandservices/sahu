'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, Lock, QrCode } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// UPI QR (decodes to upi://pay?pa=arp-zyr-102412@ypbiz, The Bihar State Co-operative Bank)
const QR_SRC = '/assets/donate-qr.png';

const DonateSidebar = ({ canShowQr = false }) => {
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

      <DonateQr canShowQr={canShowQr} />
    </aside>
  );
};

// The QR stays blurred until the visitor chooses to reveal it
const DonateQr = ({ canShowQr }) => {
  const { t } = useLanguage();
  const [revealed, setRevealed] = useState(false);
  // Re-blurs if a field is cleared after revealing
  const visible = revealed && QR_SRC && canShowQr;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-primary rounded-full" />
        {t('Scan to Donate', 'दान के लिए स्कैन करें')}
      </h2>
      <p className="text-xs text-gray-400 mb-6">{t('Pay using any UPI app.', 'किसी भी UPI ऐप से भुगतान करें।')}</p>

      <div className="relative aspect-square w-full mx-auto rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
        {QR_SRC ? (
          <Image
            src={QR_SRC}
            alt={t('Donation QR code', 'दान QR कोड')}
            fill
            sizes="(max-width: 1024px) 90vw, 400px"
            className={`object-contain p-3 transition-[filter] duration-300 ${visible ? '' : 'blur-md scale-105'}`}
          />
        ) : (
          <QrCode className="absolute inset-0 m-auto w-3/4 h-3/4 text-gray-300 blur-sm" strokeWidth={1} />
        )}
        {!visible && (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            disabled={!QR_SRC || !canShowQr}
            className="absolute inset-0 flex items-center justify-center bg-white/30 cursor-pointer disabled:cursor-not-allowed"
          >
            <span className="inline-flex items-center gap-2 bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg shadow-md">
              {!QR_SRC ? (
                t('Coming soon', 'जल्द उपलब्ध')
              ) : canShowQr ? (
                <><Eye size={16} /> {t('Show QR', 'QR दिखाएँ')}</>
              ) : (
                <><Lock size={16} /> {t('Fill details first', 'पहले विवरण भरें')}</>
              )}
            </span>
          </button>
        )}
      </div>

      {QR_SRC && !canShowQr && (
        <p className="mt-3 text-xs text-center text-gray-400">
          {t(
            'Fill in your name, phone number, purpose and amount to see the QR.',
            'QR देखने के लिए अपना नाम, फ़ोन नंबर, उद्देश्य और राशि भरें।'
          )}
        </p>
      )}

      {/* Account holder's bank, shown under the QR */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <Image src="/assets/bank-logo.png" alt="" width={48} height={48} className="w-12 h-12 shrink-0" />
        <p className="text-sm font-bold text-[#1f4d36] leading-tight">
          The Bihar State<br />Co-Operative Bank Ltd
        </p>
      </div>

      {visible && (
        <button
          type="button"
          onClick={() => setRevealed(false)}
          className="mt-4 mx-auto flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <EyeOff size={14} />
          {t('Hide QR', 'QR छिपाएँ')}
        </button>
      )}
    </div>
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
