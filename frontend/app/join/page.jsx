'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, BookOpen, ChevronRight, Mail, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { fetchApi } from '../../lib/api';
import { useLanguage, LanguageToggle } from '../../context/LanguageContext';

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
  const { t } = useLanguage();

  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.name) return setError(t('Name and Phone are required', 'नाम और फ़ोन नंबर आवश्यक हैं'));
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
      setError(err?.data?.error || t('Failed to send OTP', 'OTP भेजा नहीं जा सका'));
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
      setError(err?.data?.error || t('Failed to resend OTP', 'OTP दोबारा भेजा नहीं जा सका'));
    } finally {
      setResendLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!otp) return setError(t('OTP is required', 'OTP आवश्यक है'));
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
      setError(err?.data?.error || t('Registration failed', 'पंजीकरण विफल'));
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
                src="/assets/logo-sahu.png" 
                alt={t('Sahu Sabha Logo', 'साहू सभा लोगो')} 
                width={240} 
                height={72}
                style={{ height: 'auto' }}
              />
            </Link>
            
            <div className="flex items-center justify-between gap-4">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-gray-500 hover:text-primary transition-colors duration-300 font-bold text-sm w-fit group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                <span>{t('Back to Home', 'होम पर वापस जाएँ')}</span>
              </Link>
              <LanguageToggle />
            </div>

            <div className="space-y-6">
              <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 leading-[1.15] tracking-tight">
                {t('Preserving values,', 'मूल्यों का संरक्षण,')}<br />
                <span className="text-primary">{t('empowering community.', 'समाज का सशक्तिकरण।')}</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed font-medium">
                {t('Join thousands of members dedicated to heritage, administrative growth, and mutual support across generations.', 'विरासत, संगठनात्मक विकास और पीढ़ियों के आपसी सहयोग के लिए समर्पित हज़ारों सदस्यों से जुड़ें।')}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 group">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-light flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{t('Community Network', 'सामुदायिक नेटवर्क')}</h3>
                  <p className="text-gray-600 font-medium">{t('Connect with families and professionals to strengthen our shared cultural bonds.', 'हमारे साझा सांस्कृतिक संबंधों को मज़बूत करने के लिए परिवारों और पेशेवरों से जुड़ें।')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 group">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-light flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{t('Digital Magazine Access', 'डिजिटल पत्रिका')}</h3>
                  <p className="text-gray-600 font-medium">{t('Read exclusive articles, news, and updates curated for the Sahu Sabha members.', 'साहू सभा के सदस्यों के लिए विशेष लेख, समाचार और जानकारियाँ पढ़ें।')}</p>
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
              
              <div className="relative z-10 p-6 sm:p-8 lg:p-12">
                <div className="mb-6 lg:mb-10">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('Create your account', 'अपना खाता बनाएँ')}</h2>
                  <p className="text-gray-500 font-medium">{t('Please fill in your details to register as a new member.', 'नए सदस्य के रूप में पंजीकरण के लिए कृपया अपना विवरण भरें।')}</p>
                </div>

                <form className="space-y-6" onSubmit={step === 1 ? handleSendOtp : handleRegister}>
                  {step === 1 ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">{t('Full Name', 'पूरा नाम')}</label>
                        <input 
                          type="text" 
                          placeholder={t('Enter your full name', 'अपना पूरा नाम लिखें')}
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 placeholder:text-gray-400 font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">{t('Phone Number', 'फ़ोन नंबर')}</label>
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
                        <label className="text-sm font-bold text-gray-700 ml-1">{t('City', 'शहर')}</label>
                        <input 
                          type="text" 
                          placeholder={t('Your current city', 'आपका वर्तमान शहर')}
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 placeholder:text-gray-400 font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">{t('Reason for Joining', 'जुड़ने का कारण')}</label>
                        <textarea 
                          rows={4}
                          placeholder={t('Briefly tell us why you want to join Sahu Sabha...', 'संक्षेप में बताएँ कि आप साहू सभा से क्यों जुड़ना चाहते हैं...')}
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
                          {resendLoading
                            ? t('Sending...', 'भेजा जा रहा है...')
                            : resendCooldown > 0
                            ? t(`Resend in ${resendCooldown}s`, `${resendCooldown} सेकंड में दोबारा भेजें`)
                            : t('Resend OTP', 'OTP दोबारा भेजें')}
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
                    <span>{loading ? t('Please wait...', 'कृपया प्रतीक्षा करें...') : (step === 1 ? t('Send OTP', 'OTP भेजें') : t('Register Now', 'अभी पंजीकरण करें'))}</span>
                  </button>

                </form>

                <p className="mt-8 text-center text-gray-500 text-sm font-medium">
                  {t('Already have an account?', 'पहले से खाता है?')} <Link href="/login" className="text-primary font-bold hover:underline">{t('Log in', 'लॉग इन करें')}</Link>
                </p>
                <div className="mt-4 text-center">
                  <a href="tel:+919876543210" className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-primary transition-colors">
                    {t('Need help?', 'सहायता चाहिए?')}
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer-like simple copyright */}
      <div className="p-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm font-medium gap-4">
        <p>© {new Date().getFullYear()} {t('Sahu Sabha Digital Heritage. All rights reserved.', 'साहू सभा डिजिटल हेरिटेज। सर्वाधिकार सुरक्षित।')}</p>
        <div className="flex space-x-6">
          <Link href="/terms" className="hover:text-primary transition-colors">{t('Terms of Service', 'सेवा की शर्तें')}</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">{t('Privacy Policy', 'गोपनीयता नीति')}</Link>
        </div>
      </div>
    </div>
  );
}
