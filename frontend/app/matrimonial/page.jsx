"use client";
import { useState } from "react";
import Image from "next/image";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const profiles = [
  {
    id: "SWA98234", name: "Nikhil", age: 26, height: "5' 4\"",
    education: "MBA Marketing", profession: "Marketing Manager at MNC",
    location: "Mumbai, Maharashtra", gender: "male",
    quote: "Looking for a well-educated partner with good family values. I...",
    about: "I am an independent, caring, and family-oriented person who values both traditional roots and modern outlooks. I enjoy reading, traveling to new places, and spending quality time with my family. Looking for an understanding partner who is supportive of my career and shares similar values regarding family and mutual respect.",
    religion: "Hindu, Brahmin", marital: "Never Married", gothra: "Kashyap",
    avatar: "/assets/avatar_male.png", bgColor: "#1a7a6e",
  },
  {
    id: "SWA77412", name: "Sneha Gupta", age: 28, height: "5' 5\"",
    education: "MDS (Dentistry)", profession: "Orthodontist, Private Clinic",
    location: "Pune, Maharashtra", gender: "female",
    quote: "A mix of traditional values and modern outlook. Family oriented,...",
    about: "A dedicated professional and family-oriented person. I believe in balancing career and personal life. I love cooking, yoga, and classical music. Looking for a supportive, understanding partner from a good family background who respects both tradition and modernity.",
    religion: "Hindu, Sahu", marital: "Never Married", gothra: "Shandilya",
    avatar: "/assets/avatar_female.png", bgColor: "#1a2a4a",
  },
];

const heightOptions = ["4' 6\"","4' 8\"","4'10\"","5' 0\"","5' 1\"","5' 2\"","5' 3\"","5' 4\"","5' 5\"","5' 6\"","5' 7\"","5' 8\"","5' 9\"","5'10\"","5'11\"","6' 0\"","6' 1\"","6' 2\"","6' 3\""];

export default function MatrimonialPage() {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [marital, setMarital] = useState({ "Never Married": true, Divorced: false, Widowed: false });
  const [ageMin, setAgeMin] = useState("21");
  const [ageMax, setAgeMax] = useState("35");
  const [htMin, setHtMin] = useState("5' 0\"");
  const [htMax, setHtMax] = useState("6' 0\"");
  const [shortlisted, setShortlisted] = useState([]);
  const [liked, setLiked] = useState([]);

  return (
    <>
      <Header />
      <main style={{ backgroundColor: "#fff", minHeight: "100vh", display: "flex", gap: 0 }}>

        {/* ── SIDEBAR ── */}
        <aside style={{ width: "260px", flexShrink: 0, borderRight: "1px solid #E5E7EB", padding: "28px 20px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", marginBottom: "22px" }}>Filter Matches</h2>

          {/* Age */}
          <Label>Age (Yrs)</Label>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "18px" }}>
            <input value={ageMin} onChange={e => setAgeMin(e.target.value)} style={inputStyle} />
            <span style={{ color: "#9CA3AF", fontSize: "13px" }}>to</span>
            <input value={ageMax} onChange={e => setAgeMax(e.target.value)} style={inputStyle} />
          </div>

          {/* Height */}
          <Label>Height</Label>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "18px" }}>
            <select value={htMin} onChange={e => setHtMin(e.target.value)} style={selectStyle}>
              {heightOptions.map(h => <option key={h}>{h}</option>)}
            </select>
            <span style={{ color: "#9CA3AF", fontSize: "13px" }}>to</span>
            <select value={htMax} onChange={e => setHtMax(e.target.value)} style={selectStyle}>
              {heightOptions.map(h => <option key={h}>{h}</option>)}
            </select>
          </div>

          {/* Marital Status */}
          <Label>Marital Status</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "18px" }}>
            {Object.keys(marital).map(k => (
              <label key={k} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#374151" }}>
                <div onClick={() => setMarital(p => ({ ...p, [k]: !p[k] }))} style={{ width: "15px", height: "15px", borderRadius: "3px", border: marital[k] ? "2px solid #EAB308" : "2px solid #D1D5DB", backgroundColor: marital[k] ? "#EAB308" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {marital[k] && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </div>
                {k}
              </label>
            ))}
          </div>

          {/* Education */}
          <Label>Education</Label>
          <select style={{ ...selectStyle, width: "100%", marginBottom: "18px" }}><option>Any Bachelors</option><option>Any Masters</option><option>Doctorate</option></select>

          {/* Profession */}
          <Label>Profession</Label>
          <select style={{ ...selectStyle, width: "100%", marginBottom: "18px" }}><option>Any Profession</option><option>Engineer</option><option>Doctor</option><option>Business</option></select>

          {/* City */}
          <Label>City / State</Label>
          <input placeholder="e.g. Mumbai" style={{ ...inputStyle, width: "100%", marginBottom: "18px", boxSizing: "border-box" }} />

          {/* Gothra */}
          <Label>Gothra</Label>
          <input placeholder="Any" style={{ ...inputStyle, width: "100%", marginBottom: "24px", boxSizing: "border-box" }} />

          <button style={{ width: "100%", backgroundColor: "#EAB308", color: "#fff", fontWeight: "600", fontSize: "14px", padding: "11px", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Apply Filters
          </button>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, padding: "28px 32px" }}>
          {/* Search + Create */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <svg style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              <input placeholder="Search by Profile ID or Name" style={{ width: "100%", boxSizing: "border-box", border: "1px solid #E5E7EB", borderRadius: "6px", padding: "10px 12px 10px 36px", fontSize: "14px", color: "#374151", outline: "none" }} />
            </div>
            <button style={{ backgroundColor: "#EAB308", color: "#fff", fontWeight: "700", fontSize: "14px", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer", whiteSpace: "nowrap" }}>Create +</button>
          </div>

          {/* Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "28px" }}>
            {profiles.map(p => (
              <ProfileCard key={p.id} profile={p} liked={liked} onLike={() => setLiked(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])} onView={() => setSelectedProfile(p)} />
            ))}
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
            {["‹", "1", "2", "3", "›"].map((v, i) => (
              <button key={i} style={{ width: "34px", height: "34px", border: "1px solid #E5E7EB", borderRadius: "4px", backgroundColor: v === "1" ? "#EAB308" : "#fff", color: v === "1" ? "#fff" : "#374151", fontWeight: v === "1" ? "700" : "400", fontSize: "14px", cursor: "pointer" }}>{v}</button>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {/* ── POPUP MODAL ── */}
      {selectedProfile && (
        <ProfileModal profile={selectedProfile} shortlisted={shortlisted} onShortlist={() => setShortlisted(prev => prev.includes(selectedProfile.id) ? prev.filter(x => x !== selectedProfile.id) : [...prev, selectedProfile.id])} onClose={() => setSelectedProfile(null)} />
      )}
    </>
  );
}

function Label({ children }) {
  return <p style={{ fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>{children}</p>;
}

const inputStyle = { border: "1px solid #E5E7EB", borderRadius: "4px", padding: "7px 10px", fontSize: "13px", color: "#374151", outline: "none", width: "80px" };
const selectStyle = { border: "1px solid #E5E7EB", borderRadius: "4px", padding: "7px 8px", fontSize: "12px", color: "#374151", outline: "none", appearance: "none", cursor: "pointer" };

function ProfileCard({ profile, liked, onLike, onView }) {
  return (
    <div style={{ border: "1px solid #E5E7EB", borderRadius: "6px", overflow: "hidden", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 0 }}>
        {/* Avatar */}
        <div style={{ width: "140px", flexShrink: 0, backgroundColor: profile.bgColor, position: "relative", minHeight: "180px" }}>
          <Image src={profile.avatar} alt={profile.name} fill style={{ objectFit: "cover" }} />
          <span style={{ position: "absolute", top: "8px", left: "8px", backgroundColor: "#fff", color: "#16a34a", fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "3px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#16a34a", display: "inline-block" }} /> Verified
          </span>
        </div>

        {/* Details */}
        <div style={{ flex: 1, padding: "14px 14px 0", position: "relative" }}>
          <button onClick={onLike} style={{ position: "absolute", top: "12px", right: "12px", background: "none", border: "none", cursor: "pointer", color: liked.includes(profile.id) ? "#EAB308" : "#9CA3AF" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={liked.includes(profile.id) ? "#EAB308" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
          </button>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", marginBottom: "2px" }}>{profile.name}</h3>
          <p style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "10px" }}>ID: {profile.id}</p>
          <p style={{ fontSize: "12px", color: "#374151", marginBottom: "5px", display: "flex", alignItems: "center", gap: "5px" }}><PersonIcon /> {profile.age} Yrs, {profile.height}</p>
          <p style={{ fontSize: "12px", color: "#374151", marginBottom: "5px", display: "flex", alignItems: "center", gap: "5px" }}><BriefIcon /> {profile.education}</p>
          <p style={{ fontSize: "12px", color: "#374151", marginBottom: "5px", display: "flex", alignItems: "center", gap: "5px" }}><WorkIcon /> {profile.profession}</p>
          <p style={{ fontSize: "12px", color: "#374151", marginBottom: "8px", display: "flex", alignItems: "center", gap: "5px" }}><PinIcon /> {profile.location}</p>
          <p style={{ fontSize: "11px", color: "#6B7280", fontStyle: "italic", marginBottom: "12px" }}>"{profile.quote}"</p>
        </div>
      </div>

      <div style={{ padding: "10px 14px 14px" }}>
        <button onClick={onView} style={{ width: "100%", backgroundColor: "#EAB308", color: "#fff", fontWeight: "600", fontSize: "13px", padding: "9px", border: "none", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
          Express Interest
        </button>
      </div>
    </div>
  );
}

function ProfileModal({ profile, shortlisted, onShortlist, onClose }) {
  const isShortlisted = shortlisted.includes(profile.id);
  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={onClose}>
      <div style={{ backgroundColor: "#fff", borderRadius: "12px", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ backgroundColor: "#FEFCE8", padding: "24px 24px 20px", position: "relative" }}>
          <button onClick={onClose} style={{ position: "absolute", top: "14px", right: "14px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151", fontSize: "16px" }}>×</button>
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ width: "90px", height: "90px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, backgroundColor: profile.bgColor, position: "relative" }}>
              <Image src={profile.avatar} alt={profile.name} fill style={{ objectFit: "cover" }} />
              <span style={{ position: "absolute", bottom: "6px", right: "6px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#16a34a", border: "2px solid #fff" }} />
            </div>
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>{profile.name}</h2>
              <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "6px" }}>{profile.age} yrs &nbsp;•&nbsp; {profile.height} &nbsp;•&nbsp; {profile.religion}</p>
              <p style={{ fontSize: "13px", color: "#6B7280", display: "flex", alignItems: "center", gap: "4px" }}><PinIcon /> {profile.location}</p>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <PersonIcon color="#EAB308" />
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#111827" }}>About Me</h3>
          </div>
          <div style={{ border: "1px solid #E5E7EB", borderRadius: "6px", padding: "14px", marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", color: "#374151", lineHeight: "1.7" }}>{profile.about}</p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <BriefIcon color="#EAB308" />
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#111827" }}>Education & Profession</h3>
          </div>
          <div style={{ border: "1px solid #E5E7EB", borderRadius: "6px", padding: "14px", marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", color: "#374151", marginBottom: "6px" }}><strong>Education:</strong> {profile.education}</p>
            <p style={{ fontSize: "13px", color: "#374151" }}><strong>Profession:</strong> {profile.profession}</p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <PinIcon color="#EAB308" />
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#111827" }}>Family & Background</h3>
          </div>
          <div style={{ border: "1px solid #E5E7EB", borderRadius: "6px", padding: "14px" }}>
            <p style={{ fontSize: "13px", color: "#374151", marginBottom: "6px" }}><strong>Religion:</strong> {profile.religion}</p>
            <p style={{ fontSize: "13px", color: "#374151", marginBottom: "6px" }}><strong>Marital Status:</strong> {profile.marital}</p>
            <p style={{ fontSize: "13px", color: "#374151" }}><strong>Gothra:</strong> {profile.gothra}</p>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={onShortlist} style={{ padding: "9px 20px", border: `1px dashed ${isShortlisted ? "#EAB308" : "#EAB308"}`, borderRadius: "4px", backgroundColor: isShortlisted ? "#FEF9C3" : "#fff", color: "#EAB308", fontWeight: "600", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>
            {isShortlisted ? "Shortlisted" : "Shortlist"}
          </button>
          <button style={{ padding: "9px 20px", backgroundColor: "#92400E", color: "#fff", fontWeight: "600", fontSize: "13px", border: "none", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            Send Interest
          </button>
        </div>
      </div>
    </div>
  );
}

function PersonIcon({ color = "#6B7280" }) {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
function BriefIcon({ color = "#6B7280" }) {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg>;
}
function WorkIcon({ color = "#6B7280" }) {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg>;
}
function PinIcon({ color = "#6B7280" }) {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
}
