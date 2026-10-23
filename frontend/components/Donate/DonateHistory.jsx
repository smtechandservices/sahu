'use client';

import React, { useEffect, useState } from 'react';
import { Download, HeartHandshake, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { fetchApi } from '../../lib/api';
import { downloadDonationReceipt } from '../../lib/receipts';
import { useLanguage } from '../../context/LanguageContext';

const PURPOSE_LABELS = {
  'General Welfare': ['General Welfare Fund', 'सामान्य कल्याण कोष'],
  Education: ['Education & Scholarships', 'शिक्षा एवं छात्रवृत्ति'],
  Hostel: ['Hostel Maintenance', 'छात्रावास रख-रखाव'],
  Medical: ['Community Medical Aid', 'सामुदायिक चिकित्सा सहायता'],
};

const formatAmount = (amount) => `₹${Number(amount).toLocaleString('en-IN')}`;

// Completed donations made by the logged-in user or with their phone number.
// Bump `reloadKey` to refetch after a new donation goes through.
const DonateHistory = ({ user, reloadKey = 0 }) => {
  const { t } = useLanguage();
  const [donations, setDonations] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchApi('/donations/?status=Completed&page_size=100')
      .then((data) => { if (!cancelled) setDonations(data?.results ?? data ?? []); })
      .catch(() => { if (!cancelled) setDonations([]); });
    return () => { cancelled = true; };
  }, [reloadKey]);

  const handleDownload = async (donation) => {
    setDownloadingId(donation.id);
    try {
      await downloadDonationReceipt(donation, donation.razorpay_payment_id);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: t('Could not create the receipt', 'रसीद नहीं बन सकी'),
        text: t('Please try again.', 'कृपया फिर से प्रयास करें।'),
        confirmButtonColor: '#EAB308',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const total = (donations || []).reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-primary rounded-full" />
        {t('Your Past Donations', 'आपके पिछले दान')}
      </h2>
      <p className="text-xs text-gray-400 mb-6">
        {t(`Donations made with +91 ${user.phone}`, `+91 ${user.phone} से किए गए दान`)}
      </p>

      {donations?.length > 0 && (
        <div className="flex items-center justify-between bg-primary/10 rounded-xl px-4 py-3 mb-2">
          <span className="text-xs font-bold text-primary-dark uppercase tracking-wider">{t('Total Donated', 'कुल दान')}</span>
          <span className="text-xl font-bold text-gray-900">{formatAmount(total)}</span>
        </div>
      )}

      {donations === null ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : donations.length === 0 ? (
        <div className="text-center py-8">
          <HeartHandshake className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-400">{t('No donations yet.', 'अभी तक कोई दान नहीं।')}</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {donations.map((donation) => {
            const canDownload = donation.payment_method === 'Online' && donation.razorpay_payment_id;
            return (
              <li key={donation.id} className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="font-bold text-gray-900">
                    {PURPOSE_LABELS[donation.purpose] ? t(...PURPOSE_LABELS[donation.purpose]) : donation.purpose}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(donation.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' · '}
                    {donation.payment_method}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-gray-900">{formatAmount(donation.amount)}</span>
                  {canDownload && (
                    <button
                      type="button"
                      onClick={() => handleDownload(donation)}
                      disabled={downloadingId === donation.id}
                      title={t('Download receipt', 'रसीद डाउनलोड करें')}
                      aria-label={t('Download receipt', 'रसीद डाउनलोड करें')}
                      className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {downloadingId === donation.id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default DonateHistory;
