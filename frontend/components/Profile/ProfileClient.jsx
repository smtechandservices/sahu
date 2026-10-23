"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useAuth } from "../../context/AuthContext";
import { getCookie } from "../../lib/cookies";
import { 
  User as UserIcon, Mail, Phone, Calendar, 
  Camera, ShieldCheck, Edit3, Save, X,
  Briefcase, Heart, BookOpen, BadgeCheck, Download, Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useLanguage } from '../../context/LanguageContext';
import { downloadMembershipReceipt } from '../../lib/receipts';

export default function ProfileClient() {
  const { user, login, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [matrimonialProfile, setMatrimonialProfile] = useState(null);
  const [membership, setMembership] = useState(null);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const { t, tv, locale } = useLanguage();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const { fetchApi } = await import('../../lib/api');
      const [bookingsData, matData] = await Promise.all([
        fetchApi('/bookings/'),
        fetchApi('/matrimonial/').then(res => Array.isArray(res) ? res[0] : res)
      ]);
      setBookings(bookingsData || []);
      setMatrimonialProfile(matData || null);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
    try {
      const { fetchApi } = await import('../../lib/api');
      const data = await fetchApi('/auth/membership/');
      setMembership(data?.membership || null);
    } catch (err) {
      console.error("Error fetching membership:", err);
    }
  };

  const handleDownloadReceipt = async () => {
    setDownloadingReceipt(true);
    try {
      await downloadMembershipReceipt(membership);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: t('Could not create the receipt', 'रसीद नहीं बन सकी'),
        text: t('Please try again.', 'कृपया फिर से प्रयास करें।'),
        confirmButtonColor: '#EAB308',
      });
    } finally {
      setDownloadingReceipt(false);
    }
  };

  const calculateCompleteness = () => {
    let score = 25; // Base for joined
    if (user?.email) score += 25;
    if (user?.profile_photo) score += 25;
    if (matrimonialProfile) score += 25;
    return score;
  };

  if (authLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">{t('Loading...', 'लोड हो रहा है...')}</div>;
  if (!user) {
    if (typeof window !== 'undefined') window.location.href = '/login';
    return null;
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { fetchApi } = await import('../../lib/api');
      
      const payload = { ...formData };
      if (profilePhoto) {
        // Extract base64 and mimetype
        const [meta, base64Data] = profilePhoto.split(',');
        const mimetype = meta.split(':')[1].split(';')[0];
        payload.profile_photo = base64Data;
        payload.profile_photo_mimetype = mimetype;
      }

      const updatedUser = await fetchApi('/auth/profile/', {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      
      login(updatedUser, getCookie('accessToken'), getCookie('refreshToken'));
      setIsEditing(false);
      setProfilePhoto(null);
      Swal.fire({
        icon: "success",
        title: t('Profile Updated', 'प्रोफ़ाइल अपडेट हो गई'),
        text: t('Profile updated successfully!', 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!'),
        confirmButtonColor: "#EAB308",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: t('Update Failed', 'अपडेट विफल'),
        text: t('Failed to update profile.', 'प्रोफ़ाइल अपडेट नहीं हो सकी।'),
        confirmButtonColor: "#EAB308",
      });
    } finally {
      setLoading(false);
    }
  };

  const completeness = calculateCompleteness();

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen pb-20">
        {/* Cover / Header Section */}
        <div className="h-64 bg-primary-dark relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="px-4 sm:px-6 md:px-8 h-full relative">
            <div className="absolute -bottom-22 left-8 flex items-end gap-6">
              <div className="relative group">
                <div className="w-40 h-40 rounded-3xl bg-white p-1 overflow-hidden border-4 border-white">
                  {profilePhoto || user.profile_photo ? (
                    <Image 
                      unoptimized
                      src={profilePhoto || user.profile_photo} 
                      alt={user.name} 
                      width={160} 
                      height={160} 
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <UserIcon size={64} />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                    <Camera className="text-white" size={32} />
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                  </label>
                )}
              </div>
              <div className="mb-2">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold text-[#4a4a4a]">{user.name}</h1>
                  <span className="bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">{t('Verified', 'सत्यापित')}</span>
                </div>
                <p className="text-gray-600 flex items-center gap-2 font-medium">
                  <Phone size={14} className="text-primary" /> {user.phone}
                </p>
              </div>
            </div>
            <div className="absolute bottom-4 right-8">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 border border-white/20"
                >
                  <Edit3 size={18} />
                  {t('Edit Profile', 'प्रोफ़ाइल संपादित करें')}
                </button>
              ) : (
                <div className="flex gap-3">
                  <button 
                    onClick={() => { setIsEditing(false); setProfilePhoto(null); }}
                    className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 border border-white/20"
                  >
                    <X size={18} />
                    {t('Cancel', 'रद्द करें')}
                  </button>
                  <button 
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="bg-primary text-white hover:bg-primary-dark transition-all px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20"
                  >
                    {loading ? t('Saving...', 'सहेजा जा रहा है...') : <><Save size={18} /> {t('Save Changes', 'बदलाव सहेजें')}</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 md:px-8 mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left Column - Stats / Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">{t('Profile Completeness', 'प्रोफ़ाइल पूर्णता')}</h3>
                <div className="w-full bg-gray-100 h-2.5 rounded-full mb-4">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${completeness}%` }}
                    className="bg-primary h-full rounded-full transition-all duration-1000" 
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {t(`Your profile is ${completeness}% complete.`, `आपकी प्रोफ़ाइल ${completeness}% पूर्ण है।`)}{' '}
                  {completeness < 100
                    ? t('Complete all fields to unlock full community benefits.', 'समाज की सभी सुविधाओं का लाभ पाने के लिए सभी जानकारी भरें।')
                    : t('Your profile is fully optimized!', 'आपकी प्रोफ़ाइल पूरी तरह तैयार है!')}
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">{t('Quick Links', 'त्वरित लिंक')}</h3>
                <div className="space-y-4">
                  <QuickLink icon={<Heart />} label={t('My Matrimonial Profile', 'मेरी वैवाहिक प्रोफ़ाइल')} count={matrimonialProfile ? "1" : "0"} />
                  <QuickLink icon={<Briefcase />} label={t('My Bookings', 'मेरी बुकिंग')} count={bookings.length.toString()} />
                </div>
              </div>
            </div>

            {/* Right Column - Forms / Details */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-50">
                  <ShieldCheck className="text-primary" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">{t('Personal Information', 'व्यक्तिगत जानकारी')}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('Full Name', 'पूरा नाम')}</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-xl text-gray-900 font-medium">{user.name}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('Phone Number', 'फ़ोन नंबर')}</label>
                    <div className="p-4 bg-gray-50/50 rounded-xl text-gray-400 font-medium cursor-not-allowed">
                      {user.phone}
                      <span className="float-right text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-400">{t('Locked', 'लॉक')}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('Email Address', 'ईमेल पता')}</label>
                    {isEditing ? (
                      <input 
                        type="email" 
                        value={formData.email}
                        placeholder={t('e.g. name@example.com', 'जैसे: name@example.com')}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-xl text-gray-900 font-medium">{user.email || t('Not set', 'सेट नहीं है')}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('Member Since', 'सदस्यता तिथि')}</label>
                    <div className="p-4 bg-gray-50/50 rounded-xl text-gray-900 font-medium">
                      {new Date(user.date_joined).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Membership fee paid when joining */}
              {membership && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                  <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-50">
                    <BadgeCheck className="text-primary" size={24} />
                    <h2 className="text-xl font-bold text-gray-900">{t('Membership', 'सदस्यता')}</h2>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('Membership Fee Paid', 'भुगतान किया गया सदस्यता शुल्क')}</p>
                      <p className="text-3xl font-bold text-gray-900">₹{Number(membership.amount).toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-400">
                        {membership.paid_at && new Date(membership.paid_at).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
                        {' · '}
                        {t('Payment ID', 'भुगतान आईडी')}: {membership.razorpay_payment_id}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadReceipt}
                      disabled={downloadingReceipt}
                      className="btn-primary rounded-xl px-5 py-3 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {downloadingReceipt ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                      {t('Download Receipt', 'रसीद डाउनलोड करें')}
                    </button>
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-50">
                  <Calendar className="text-primary" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">{t('Recent Activity', 'हाल की गतिविधि')}</h2>
                </div>
                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map((booking, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <BookOpen size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{t('Booking:', 'बुकिंग:')} {booking.accommodation_title || t('Accommodation', 'आवास')}</p>
                            <p className="text-xs text-gray-400">{booking.check_in} {t('to', 'से')} {booking.check_out}{t('', ' तक')}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                          booking.status === 'Confirmed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {tv(booking.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400 text-sm italic">
                    {t('No recent bookings or activity found.', 'हाल की कोई बुकिंग या गतिविधि नहीं मिली।')}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function QuickLink({ icon, label, count }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">{label}</span>
      </div>
      <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-primary group-hover:text-white transition-all">{count}</span>
    </div>
  );
}
