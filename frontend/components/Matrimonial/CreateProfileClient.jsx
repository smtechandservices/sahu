"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Swal from "sweetalert2";

export default function CreateProfileClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    gender: "Male",
    city: "",
    education: "",
    occupation: "",
    family_type: "Nuclear",
    gotra: "",
    marital_status: "Never Married",
    manglik: "No",
    complexion: "Fair",
    height_cm: "",
    annual_income: "",
    mother_tongue: "Hindi",
    bio: "",
  });
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { fetchApi } = await import("../../lib/api");
      const payload = { ...formData };
      await fetchApi("/matrimonial/", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      Swal.fire({
        icon: "success",
        title: "Profile Created",
        text: "Matrimonial profile created successfully!",
        confirmButtonColor: "#EAB308",
      });
      router.push("/matrimonial");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Creation Failed",
        text: "Failed to create profile. You may already have one.",
        confirmButtonColor: "#EAB308",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Matrimonial Profile</h1>
            <p className="text-gray-500 mb-8">Fill in your details to join the community matrimony.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="pt-4 flex justify-end gap-4">
                <button type="button" onClick={() => router.push("/matrimonial")} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary px-8 rounded-xl shadow-lg shadow-primary/20">
                  {loading ? "Creating..." : "Create Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
