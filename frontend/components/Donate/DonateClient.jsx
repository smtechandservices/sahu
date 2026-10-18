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

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

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
        title: 'Invalid Amount',
        text: 'Please enter a valid donation amount.',
        confirmButtonColor: '#EAB308',
      });
      return;
    }
    if (!formData.name.trim() || !formData.phone.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Details',
        text: 'Please enter your name and phone number.',
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
        title: 'Thank You!',
        text: `Your contribution of ₹${Number(formData.amount).toLocaleString('en-IN')} has been recorded. Our team will contact you to complete the payment.`,
        confirmButtonColor: '#EAB308',
      });
      setSelectedTier(null);
      setFormData(prev => ({ ...prev, amount: '' }));
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong',
        text: err.message || 'Could not record your donation. Please try again.',
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
