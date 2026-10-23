"use client";

import React, { useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import DonateHero from './DonateHero';
import DonateTiers from './DonateTiers';
import DonateForm from './DonateForm';
import DonateSidebar from './DonateSidebar';
import DonateHistory from './DonateHistory';

import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { Lock } from 'lucide-react';

import Swal from 'sweetalert2';
import { fetchApi } from '../../lib/api';
import { downloadDonationReceipt } from '../../lib/receipts';
import { loadRazorpayCheckout, errorMessage } from '../../lib/razorpay';
import { useLanguage } from '../../context/LanguageContext';

const DonateClient = () => {
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    purpose: 'General Welfare',
    amount: ''
  });

  const [selectedTier, setSelectedTier] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);
  const { t } = useLanguage();

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">{t('Loading...', 'लोड हो रहा है...')}</div>;

  const handleSelectTier = (amount) => {
    if (amount === 'Custom') {
      setSelectedTier('Custom');
      setFormData(prev => ({ ...prev, amount: '' }));
    } else {
      setSelectedTier(amount);
      setFormData(prev => ({ ...prev, amount: amount }));
    }
  };

  const handleDonate = async () => {
    if (!formData.amount || formData.amount <= 0) {
      Swal.fire({
        icon: 'warning',
        title: t('Invalid Amount', 'अमान्य राशि'),
        text: t('Please enter a valid donation amount.', 'कृपया सही दान राशि दर्ज करें।'),
        confirmButtonColor: '#EAB308',
      });
      return;
    }
    if (!formData.name.trim() || !formData.phone.trim()) {
      Swal.fire({
        icon: 'warning',
        title: t('Missing Details', 'जानकारी अधूरी है'),
        text: t('Please enter your name and phone number.', 'कृपया अपना नाम और फ़ोन नंबर दर्ज करें।'),
        confirmButtonColor: '#EAB308',
      });
      return;
    }

    setSubmitting(true);
    try {
      const loaded = await loadRazorpayCheckout();
      if (!loaded) throw new Error(t('Could not load the payment window. Check your connection and try again.', 'भुगतान विंडो लोड नहीं हो सकी। अपना कनेक्शन जाँचें और फिर से प्रयास करें।'));

      // Saved as Pending; it becomes Completed once Razorpay confirms the payment
      const donation = await fetchApi('/donations/', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone,
          purpose: formData.purpose,
          amount: formData.amount,
        }),
      });

      const checkout = new window.Razorpay({
        key: donation.razorpay.key_id,
        order_id: donation.razorpay.order_id,
        amount: donation.razorpay.amount,
        currency: donation.razorpay.currency,
        name: 'Sahu Sabha',
        description: t('Donation', 'दान'),
        prefill: { name: formData.name.trim(), contact: formData.phone },
        theme: { color: '#EAB308' },
        handler: async (payment) => {
          try {
            const confirmed = await fetchApi('/donations/verify/', { method: 'POST', body: JSON.stringify(payment) });
            setSelectedTier(null);
            setFormData(prev => ({ ...prev, amount: '' }));
            setSubmitting(false);
            setHistoryKey(k => k + 1);
            // The donor can only close this by downloading their receipt
            Swal.fire({
              icon: 'success',
              title: t('Thank You!', 'धन्यवाद!'),
              text: t(
                `Your donation of ₹${Number(confirmed.amount).toLocaleString('en-IN')} was received. Payment ID: ${payment.razorpay_payment_id}`,
                `आपका ₹${Number(confirmed.amount).toLocaleString('en-IN')} का दान प्राप्त हो गया है। भुगतान आईडी: ${payment.razorpay_payment_id}`
              ),
              confirmButtonText: t('Download Receipt', 'रसीद डाउनलोड करें'),
              confirmButtonColor: '#EAB308',
              allowOutsideClick: false,
              allowEscapeKey: false,
              showLoaderOnConfirm: true,
              preConfirm: () =>
                downloadDonationReceipt(confirmed, payment.razorpay_payment_id).catch((err) => {
                  console.error(err);
                  Swal.showValidationMessage(t('Could not create the receipt. Please try again.', 'रसीद नहीं बन सकी। कृपया फिर से प्रयास करें।'));
                  return false;
                }),
            });
          } catch (err) {
            // The money was taken but we couldn't confirm it; the team can match it by payment ID
            Swal.fire({
              icon: 'info',
              title: t('Payment Received', 'भुगतान प्राप्त'),
              text: t(
                `We received your payment (ID: ${payment.razorpay_payment_id}) but could not confirm it yet. Our team will confirm it; please keep this ID for reference.`,
                `आपका भुगतान (आईडी: ${payment.razorpay_payment_id}) प्राप्त हुआ, लेकिन अभी पुष्टि नहीं हो सकी। हमारी टीम इसकी पुष्टि करेगी; कृपया संदर्भ के लिए यह आईडी रखें।`
              ),
              confirmButtonColor: '#EAB308',
            });
          } finally {
            setSubmitting(false);
          }
        },
        modal: { ondismiss: () => setSubmitting(false) },
      });
      checkout.open();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: t('Something went wrong', 'कुछ गलत हो गया'),
        text: errorMessage(err) || t('Could not start your donation. Please try again.', 'आपका दान शुरू नहीं हो सका। कृपया फिर से प्रयास करें।'),
        confirmButtonColor: '#EAB308',
      });
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen pb-20">
        <DonateHero />
        <div className="px-4 sm:px-6 md:px-8 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Tiers & Form */}
            <div className="lg:col-span-8 space-y-12">
              <section>
                <DonateTiers 
                  selectedAmount={selectedTier} 
                  onSelect={handleSelectTier} 
                />
              </section>

              <DonateForm 
                formData={formData} 
                setFormData={setFormData} 
                onDonate={handleDonate}
                submitting={submitting}
              />
            </div>

            {/* Right Column: Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              <DonateSidebar />
              {user && <DonateHistory user={user} reloadKey={historyKey} />}
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DonateClient;
