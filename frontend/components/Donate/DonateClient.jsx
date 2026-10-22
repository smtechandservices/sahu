"use client";

import React, { useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import DonateHero from './DonateHero';
import DonateTiers from './DonateTiers';
import DonateForm from './DonateForm';
import DonateSidebar from './DonateSidebar';

import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { Lock } from 'lucide-react';

import Swal from 'sweetalert2';
import { fetchApi } from '../../lib/api';
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
      // Saved as Pending; the Sabha team confirms it once the payment is received.
      // Payment gateway integration would go here.
      await fetchApi('/donations/', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone,
          purpose: formData.purpose,
          amount: formData.amount,
        }),
      });
      Swal.fire({
        icon: 'success',
        title: t('Thank You!', 'धन्यवाद!'),
        text: t(
          `Your contribution of ₹${Number(formData.amount).toLocaleString('en-IN')} has been recorded. Our team will contact you to complete the payment.`,
          `आपका ₹${Number(formData.amount).toLocaleString('en-IN')} का योगदान दर्ज कर लिया गया है। भुगतान पूरा करने के लिए हमारी टीम आपसे संपर्क करेगी।`
        ),
        confirmButtonColor: '#EAB308',
      });
      setSelectedTier(null);
      setFormData(prev => ({ ...prev, amount: '' }));
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: t('Something went wrong', 'कुछ गलत हो गया'),
        text: err.message || t('Could not record your donation. Please try again.', 'आपका दान दर्ज नहीं हो सका। कृपया फिर से प्रयास करें।'),
        confirmButtonColor: '#EAB308',
      });
    } finally {
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
            <div className="lg:col-span-4">
              <DonateSidebar />
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DonateClient;
