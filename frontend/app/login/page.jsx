'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, LogIn, ChevronRight, ArrowLeft } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notRegistered, setNotRegistered] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(''), 2000);
    return () => clearTimeout(t);
  }, [error]);

  useEffect(() => {
    if (!notRegistered) return;
    const t = setTimeout(() => setNotRegistered(false), 2000);
    return () => clearTimeout(t);
  }, [notRegistered]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone) return setError('Phone is required');
    setLoading(true);
    setError('');
    setNotRegistered(false);
    try {
      await fetchApi('/auth/send-otp/', {
        method: 'POST',
        body: JSON.stringify({ phone })
      });
      setStep(2);
      setResendCooldown(30);
    } catch (err) {
      const msg = err?.data?.error || 'Failed to send OTP';
      if (err?.status === 404) {
        setNotRegistered(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError('');
    try {
      await fetchApi('/auth/send-otp/', {
        method: 'POST',
        body: JSON.stringify({ phone })
      });
      setOtp('');
      setResendCooldown(30);
    } catch (err) {
      setError(err?.data?.error || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return setError('OTP is required');
    setLoading(true);
    setError('');
    try {
      const data = await fetchApi('/auth/verify-otp/', {
        method: 'POST',
        body: JSON.stringify({ phone, code: otp })
      });
      login(data.user, data.access, data.refresh);
      window.location.href = '/';
    } catch (err) {
      setError(err?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary/30">
      <div className="px-4 sm:px-6 md:px-8 py-6 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 items-start">

          {/* Left Column: Branding & Info */}
          <div className="flex flex-col space-y-6 lg:space-y-10">
            {/* Logo */}
            <Link href="/" className="inline-block transition-transform active:scale-95 duration-300">
              <Image 
                src="/assets/logo.png" 
                alt="Sahu Sabha Logo" 
                width={120} 
                height={60} 
                style={{ height: 'auto' }}
                priority
              />
            </Link>
            
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-gray-500 hover:text-primary transition-colors duration-300 font-bold text-sm w-fit group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back to Home</span>
            </Link>

            <div className="space-y-6">
              <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 leading-[1.15] tracking-tight">
                Welcome back to<br />
                <span className="text-primary">Sahu Sabha.</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed font-medium">
                Log in to access your profile, connect with the community, and stay updated with the latest news.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 group">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-light flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Secure Access</h3>
                  <p className="text-gray-600 font-medium">Your data is protected with state-of-the-art security measures.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 group">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-light flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <LogIn className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Seamless Connectivity</h3>
                  <p className="text-gray-600 font-medium">Access all community services with a single login.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Login Form */}
          <div className="relative">
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary-light rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700" />

            <div className="relative bg-white border border-yellow-200 rounded-md shadow-md overflow-hidden">
              {/* Curve Decoration at top right */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFFBEB] rounded-bl-[100%] z-0 transform translate-x-12 -translate-y-12" />
              
              <div className="relative z-10 p-6 sm:p-8 lg:p-12">
                <div className="mb-6 lg:mb-10">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Login to your account</h2>
                  <p className="text-gray-500 font-medium">Enter your registered phone number to continue.</p>
                </div>

                <form className="space-y-6" onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp}>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold border-r border-gray-300 pr-3">+91</span>
                      <input 
                        type="tel" 
                        placeholder="00000 00000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={step === 2}
                        className="w-full pl-20 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 placeholder:text-gray-400 font-medium disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {step === 2 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between ml-1">
                        <label className="text-sm font-bold text-gray-700">OTP</label>
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={resendCooldown > 0 || resendLoading}
                          className="text-sm font-bold text-primary hover:underline disabled:text-gray-400 disabled:no-underline transition-colors"
                        >
                          {resendLoading ? 'Sending...' : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 placeholder:text-gray-400 font-medium"
                      />
                    </div>
                  )}

                  {notRegistered && (
                    <div className="bg-amber-50 text-amber-700 p-4 rounded-xl text-sm font-medium border border-amber-200">
                      This number is not registered.
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-100">
                      {error}
                    </div>
                  )}

                  <button 
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-5 rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-primary/20 cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <span>{loading ? 'Please wait...' : (step === 1 ? 'Send OTP' : 'Verify & Login')}</span>
                    {!loading && <ChevronRight className="w-5 h-5" />}
                  </button>

                </form>

                <p className="mt-8 text-center text-gray-500 text-sm font-medium">
                  Don't have an account? <Link href="/join" className="text-primary font-bold hover:underline">Register Now</Link>
                </p>
                <div className="mt-4 text-center">
                  <a href="tel:+919876543210" className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-primary transition-colors">
                    Need help?
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer-like simple copyright */}
      <div className="px-4 sm:px-6 md:px-8 py-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm font-medium gap-4">
        <p>© {new Date().getFullYear()} Sahu Sabha Digital Heritage. All rights reserved.</p>
        <div className="flex space-x-6">
          <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
