"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditProfileModal({ isOpen, onClose, profile }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    setPhoto(null);
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
      alert("Profile updated! It will be visible after admin approval.");
      onClose();
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !profile) return null;

  const currentAvatar = photo || (profile.avatar?.startsWith("data:") ? profile.avatar : null);

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
            <h2 className="text-2xl font-bold text-gray-900">Edit Matrimonial Profile</h2>
            <p className="text-sm text-gray-500 mt-0.5">Changes will go to admin for approval before going live.</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Age</label>
              <input type="number" name="age" required value={formData.age} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Height (cm)</label>
              <input type="number" name="height_cm" required value={formData.height_cm} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
              <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Gotra</label>
              <input type="text" name="gotra" required value={formData.gotra} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Marital Status</label>
              <select name="marital_status" value={formData.marital_status} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors">
                <option value="Never Married">Never Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
                <option value="Awaiting Divorce">Awaiting Divorce</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Manglik</label>
              <select name="manglik" value={formData.manglik} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors">
                <option value="No">No</option>
                <option value="Yes">Yes</option>
                <option value="Partial">Partial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Complexion</label>
              <select name="complexion" value={formData.complexion} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors">
                <option value="Fair">Fair</option>
                <option value="Wheatish">Wheatish</option>
                <option value="Dark">Dark</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Education</label>
              <input type="text" name="education" required value={formData.education} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Occupation</label>
              <input type="text" name="occupation" required value={formData.occupation} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Annual Income</label>
              <input type="text" name="annual_income" placeholder="e.g. 5-10 LPA" required value={formData.annual_income} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Family Type</label>
              <input type="text" name="family_type" required value={formData.family_type} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mother Tongue</label>
              <input type="text" name="mother_tongue" required value={formData.mother_tongue} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">About You (Bio)</label>
            <textarea name="bio" required rows="4" value={formData.bio} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Profile Photo</label>
            {currentAvatar && (
              <img src={currentAvatar} alt="Current" className="mb-3 w-24 h-24 object-cover rounded-xl border-4 border-white shadow-sm" />
            )}
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            <p className="text-xs text-gray-400 mt-1">Leave blank to keep current photo.</p>
          </div>

          <div className="pt-2 pb-2 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary px-8 rounded-xl shadow-lg shadow-primary/20">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
