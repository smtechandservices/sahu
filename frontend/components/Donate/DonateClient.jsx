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

const DonateClient = () => {
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    purpose: 'General Welfare',
    amount: ''
  });

  const [selectedTier, setSelectedTier] = useState(null);

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

  const handleDonate = () => {
    if (!formData.amount || formData.amount <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Amount',
        text: 'Please enter a valid donation amount.',
        confirmButtonColor: '#EAB308',
      });
      return;
    }
    Swal.fire({
      icon: 'success',
      title: 'Thank You!',
      text: `Thank you for your generous contribution of ₹${formData.amount}!`,
      confirmButtonColor: '#EAB308',
    });
    // Payment integration logic would go here
  };

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen pb-20">
        <DonateHero />
        <div className="px-8 mt-12">
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
