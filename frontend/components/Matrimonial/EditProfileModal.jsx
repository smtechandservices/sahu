"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Swal from "sweetalert2";
import { useLanguage } from '../../context/LanguageContext';

export default function EditProfileModal({ isOpen, onClose, profile }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { t, tv } = useLanguage();
  const [formData, setFormData] = useState({});
  const [photo, setPhoto] = useState(null);


  // Pre-fill form whenever profile changes or modal opens
  useEffect(() => {
    if (!profile) return;
    setFormData({
      age: profile.age ?? "",
      gender: profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : "Male",
      city: profile.location ?? "",
      education: profile.education ?? "",
      occupation: profile.profession ?? "",
      family_type: profile.family_type ?? "Nuclear",
      gotra: profile.gothra ?? "",
      marital_status: profile.marital ?? "Never Married",
      manglik: profile.manglik ?? "No",
      complexion: profile.complexion ?? "Fair",
      height_cm: profile.height_cm ?? "",
      annual_income: profile.annual_income ?? "",
      mother_tongue: profile.mother_tongue ?? "Hindi",
      bio: profile.about ?? "",
    });

  }, [profile, isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { fetchApi } = await import("../../lib/api");
      const payload = { ...formData };
      if (photo) {
        const [meta, base64Data] = photo.split(",");
        const mimetype = meta.split(":")[1].split(";")[0];
        payload.photo = base64Data;
        payload.photo_mimetype = mimetype;
      }

      await fetchApi(`/matrimonial/${profile.id}/`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      Swal.fire({
        icon: "success",
        title: t('Profile Updated', 'प्रोफ़ाइल अपडेट हो गई'),
        text: t('Profile updated! It will be visible after admin approval.', 'प्रोफ़ाइल अपडेट हो गई! एडमिन की स्वीकृति के बाद यह दिखाई देगी।'),
        confirmButtonColor: "#EAB308",
      });
      onClose();
      router.refresh();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: t('Update Failed', 'अपडेट विफल'),
        text: t('Failed to update profile. Please try again.', 'प्रोफ़ाइल अपडेट नहीं हो सकी। कृपया फिर से प्रयास करें।'),
        confirmButtonColor: "#EAB308",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !profile) return null;



  return (
    <div
      className="fixed inset-0 z-[1050] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between rounded-t-3xl z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('Edit Matrimonial Profile', 'वैवाहिक प्रोफ़ाइल संपादित करें')}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{t('Changes will go to admin for approval before going live.', 'बदलाव प्रकाशित होने से पहले एडमिन की स्वीकृति के लिए जाएँगे।')}</p>
          </div>
          <button
            onClick={onClose}
            aria-label={t('Close', 'बंद करें')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t('Profile Photo', 'प्रोफ़ाइल फ़ोटो')}</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200 flex items-center justify-center">
                {photo ? (
                  <img src={photo} alt={t('Preview', 'पूर्वावलोकन')} className="w-full h-full object-cover" />
                ) : profile?.avatar && !profile.avatar.startsWith("/assets/") ? (
                  <img src={profile.avatar} alt={t('Current', 'वर्तमान')} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('Age', 'आयु')}</label>
              <input type="number" name="age" required value={formData.age} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('Gender', 'लिंग')}</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors">
                <option value="Male">{tv('Male')}</option>
                <option value="Female">{tv('Female')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('Height (cm)', 'ऊँचाई (सेमी)')}</label>
              <input type="number" name="height_cm" required value={formData.height_cm} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('City', 'शहर')}</label>
              <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('Gotra', 'गोत्र')}</label>
              <input type="text" name="gotra" required value={formData.gotra} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('Marital Status', 'वैवाहिक स्थिति')}</label>
              <select name="marital_status" value={formData.marital_status} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors">
                <option value="Never Married">{tv('Never Married')}</option>
                <option value="Divorced">{tv('Divorced')}</option>
                <option value="Widowed">{tv('Widowed')}</option>
                <option value="Awaiting Divorce">{tv('Awaiting Divorce')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('Manglik', 'मांगलिक')}</label>
              <select name="manglik" value={formData.manglik} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors">
                <option value="No">{tv('No')}</option>
                <option value="Yes">{tv('Yes')}</option>
                <option value="Partial">{tv('Partial')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('Complexion', 'रंग')}</label>
              <select name="complexion" value={formData.complexion} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors">
                <option value="Fair">{tv('Fair')}</option>
                <option value="Wheatish">{tv('Wheatish')}</option>
                <option value="Dark">{tv('Dark')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('Education', 'शिक्षा')}</label>
              <input type="text" name="education" required value={formData.education} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('Occupation', 'व्यवसाय')}</label>
              <input type="text" name="occupation" required value={formData.occupation} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('Annual Income', 'वार्षिक आय')}</label>
              <input type="text" name="annual_income" placeholder={t('e.g. 5-10 LPA', 'जैसे: 5-10 लाख प्रति वर्ष')} required value={formData.annual_income} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('Family Type', 'परिवार का प्रकार')}</label>
              <input type="text" name="family_type" required value={formData.family_type} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('Mother Tongue', 'मातृभाषा')}</label>
              <input type="text" name="mother_tongue" required value={formData.mother_tongue} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t('About You (Bio)', 'आपके बारे में (परिचय)')}</label>
            <textarea name="bio" required rows="4" value={formData.bio} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" />
          </div>

          <div className="pt-2 pb-2 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
              {t('Cancel', 'रद्द करें')}
            </button>
            <button type="submit" disabled={loading} className="btn-primary px-8 rounded-xl shadow-lg shadow-primary/20">
              {loading ? t('Saving...', 'सहेजा जा रहा है...') : t('Save Changes', 'बदलाव सहेजें')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
