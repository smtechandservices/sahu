'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, BookOpen, ChevronRight, Mail, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { fetchApi } from '../../lib/api';

export default function JoinCommunity() {
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    city: '',
    reason: ''
  });
  const [otp, setOtp] = React.useState('');
  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [resendCooldown, setResendCooldown] = React.useState(0);
  const [resendLoading, setResendLoading] = React.useState(false);
  const { login } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.name) return setError('Name and Phone are required');
    setLoading(true);
    setError('');
    try {
      await fetchApi('/auth/send-register-otp/', {
        method: 'POST',
        body: JSON.stringify({ phone: formData.phone })
      });
      setStep(2);
      setResendCooldown(30);
    } catch (err) {
      setError(err?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError('');
    try {
      await fetchApi('/auth/send-register-otp/', {
        method: 'POST',
        body: JSON.stringify({ phone: formData.phone })
      });
      setOtp('');
      setResendCooldown(30);
    } catch (err) {
      setError(err?.data?.error || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!otp) return setError('OTP is required');
    setLoading(true);
    setError('');
    try {
      const data = await fetchApi('/auth/register/', {
        method: 'POST',
        body: JSON.stringify({ 
          phone: formData.phone, 
          name: formData.name,
          code: otp 
        })
      });
      login(data.user, data.access, data.refresh);
      router.push('/');
    } catch (err) {
      setError(err?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary/30">
      <div className="px-8 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* Left Column: Branding & Info */}
          <div className="flex flex-col space-y-10">
            {/* Logo */}
            <Link href="/" className="inline-block transition-transform active:scale-95 duration-300">
              <Image 
                src="/assets/logo.png" 
                alt="Sahu Sabha Logo" 
                width={120} 
                height={60}
                style={{ height: 'auto' }}
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
                Preserving values,<br />
                <span className="text-primary">empowering community.</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed font-medium">
                Join thousands of members dedicated to heritage, administrative growth, and mutual support across generations.
              </p>
            </div>

            {/* Illustration */}
            <div className="relative w-full h-[250px] bg-[#F3F4F6] rounded-2xl overflow-hidden group">
              <Image 
                src="/assets/community_illustration.png" 
                alt="Community Illustration" 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 group">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-light flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Community Network</h3>
                  <p className="text-gray-600 font-medium">Connect with families and professionals to strengthen our shared cultural bonds.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 group">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-light flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Digital Magazine Access</h3>
                  <p className="text-gray-600 font-medium">Read exclusive articles, news, and updates curated for the Sahu Sabha members.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Form */}
          <div className="relative">
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary-light rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700" />

            <div className="relative bg-white border border-yellow-200 rounded-md shadow-md overflow-hidden">
              {/* Curve Decoration at top right */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFFBEB] rounded-bl-[100%] z-0 transform translate-x-12 -translate-y-12" />
              
              <div className="relative z-10 p-8 lg:p-12">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
                  <p className="text-gray-500 font-medium">Please fill in your details to register as a new member.</p>
                </div>

                <form className="space-y-6" onSubmit={step === 1 ? handleSendOtp : handleRegister}>
                  {step === 1 ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                        <input 
                          type="text" 
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 placeholder:text-gray-400 font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                        <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold border-r border-gray-300 pr-3">+91</span>
                          <input 
                            type="tel" 
                            placeholder="00000 00000"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            required
                            className="w-full pl-20 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 placeholder:text-gray-400 font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">City</label>
                        <input 
                          type="text" 
                          placeholder="Your current city"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 placeholder:text-gray-400 font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Reason for Joining</label>
                        <textarea 
                          rows={4}
                          placeholder="Briefly tell us why you want to join Sahu Sabha..."
                          value={formData.reason}
                          onChange={(e) => setFormData({...formData, reason: e.target.value})}
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 placeholder:text-gray-400 font-medium resize-none"
                        />
                      </div>
                    </>
                  ) : (
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
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 placeholder:text-gray-400 font-medium"
                      />
                    </div>
                  )}

                  {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                  <button 
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-5 rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50"
                  >
                    <span>{loading ? 'Please wait...' : (step === 1 ? 'Send OTP' : 'Register Now')}</span>
                  </button>

                </form>

                <p className="mt-8 text-center text-gray-500 text-sm font-medium">
                  Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer-like simple copyright */}
      <div className="p-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm font-medium gap-4">
        <p>© {new Date().getFullYear()} Sahu Sabha Digital Heritage. All rights reserved.</p>
        <div className="flex space-x-6">
          <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
