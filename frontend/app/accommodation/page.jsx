"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const accommodations = [
  {
    id: 1,
    type: "Hostel",
    badge: "Hostel Facility",
    image: "/assets/event1.png",
    title: "Sahu Vidyarthi Bhavan",
    description:
      "Safe, disciplined, and affordable accommodation for students pursuing higher education. Includes mess facilities, study halls, and 24/7 security.",
    priceLabel: "Starting from",
    price: "₹2,500",
    unit: "/ month",
    location: "New Delhi Central",
  },
  {
    id: 2,
    type: "Community Hall",
    badge: "Event Space",
    image: "/assets/event2.png",
    title: "Heritage Grand Hall",
    description:
      "A spacious, fully air-conditioned venue perfect for weddings, community gatherings, and large meetings. Features an attached dining area and ample parking.",
    priceLabel: "Member Rate",
    price: "₹15,000",
    unit: "/ day",
    location: "Jaipur Heritage",
  },
  {
    id: 3,
    type: "Guest Rooms",
    badge: "Accommodation",
    image: "/assets/event3.png",
    title: "Sabha Atithi Griha",
    description:
      "Clean and comfortable short-stay rooms for community members visiting the city for medical, business, or personal reasons. Twin sharing available.",
    priceLabel: "Starting from",
    price: "₹800",
    unit: "/ night",
    location: "Mumbai Suburban",
  },
];

const serviceTypes = ["Hostel", "Community Hall", "Guest Rooms"];
const locations = [
  "All Locations",
  "New Delhi Central",
  "Jaipur Heritage",
  "Mumbai Suburban",
];

export default function AccommodationPage() {
  const [selectedTypes, setSelectedTypes] = useState({
    Hostel: true,
    "Community Hall": true,
    "Guest Rooms": true,
  });
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  const toggleType = (type) => {
    setSelectedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const clearFilters = () => {
    setSelectedTypes({ Hostel: true, "Community Hall": true, "Guest Rooms": true });
    setSelectedLocation("All Locations");
  };

  const filtered = accommodations.filter((a) => {
    const typeMatch = selectedTypes[a.type];
    const locMatch =
      selectedLocation === "All Locations" || a.location === selectedLocation;
    return typeMatch && locMatch;
  });

  return (
    <>
      <Header />

      <main style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>

        {/* Title / Intro Section — White background */}
        <div style={{ backgroundColor: "#ffffff", paddingTop: "36px", paddingBottom: "36px", paddingLeft: "48px", paddingRight: "48px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", marginBottom: "10px", lineHeight: "1.2" }}>
            Community Services Hub
          </h1>
          <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: "1.7", margin: 0 }}>
            Access well-maintained facilities provided by the Sabha for our members.<br />
            Reserve community halls for events, book comfortable hostel stays for students,<br />
            or find temporary room accommodations.
          </p>
        </div>

        {/* Body — Gray background with sidebar + grid */}
        <div style={{ display: "flex", gap: "20px", padding: "24px 48px", alignItems: "flex-start" }}>

          {/* ── Filters Sidebar ── */}
          <aside style={{
            width: "240px",
            flexShrink: 0,
            backgroundColor: "#ffffff",
            border: "1px solid #E5E7EB",
            borderRadius: "4px",
            padding: "20px",
          }}>
            {/* Header row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontWeight: "700", fontSize: "15px", color: "#111827" }}>Filters</span>
              <button
                onClick={clearFilters}
                style={{ fontSize: "12px", color: "#EAB308", fontWeight: "600", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                Clear All
              </button>
            </div>

            {/* Service Type */}
            <p style={{ fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "10px", textTransform: "none" }}>
              Service Type
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "9px", marginBottom: "20px" }}>
              {serviceTypes.map((type) => (
                <label
                  key={type}
                  onClick={() => toggleType(type)}
                  style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                >
                  {/* Custom checkbox */}
                  <div style={{
                    width: "15px",
                    height: "15px",
                    borderRadius: "3px",
                    border: selectedTypes[type] ? "2px solid #EAB308" : "2px solid #D1D5DB",
                    backgroundColor: selectedTypes[type] ? "#EAB308" : "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.15s",
                  }}>
                    {selectedTypes[type] && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: "13px", color: "#374151", userSelect: "none" }}>{type}</span>
                </label>
              ))}
            </div>

            {/* Location */}
            <p style={{ fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "10px" }}>
              Location
            </p>
            <div style={{ position: "relative" }}>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={{
                  width: "100%",
                  fontSize: "13px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "6px",
                  padding: "7px 28px 7px 10px",
                  backgroundColor: "#ffffff",
                  color: "#374151",
                  appearance: "none",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <svg
                style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9CA3AF" }}
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </aside>

          {/* ── Cards Grid ── */}
          <div style={{ flex: 1 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", color: "#9CA3AF", paddingTop: "80px" }}>
                <p style={{ fontSize: "16px", fontWeight: "600" }}>No results found</p>
                <p style={{ fontSize: "13px", marginTop: "4px" }}>Try adjusting your filters.</p>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
              }}>
                {filtered.map((item) => (
                  <AccommodationCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

function AccommodationCard({ item }) {
  return (
    <div style={{
      backgroundColor: "#ffffff",
      border: "1px solid #E5E7EB",
      borderRadius: "4px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    }}>
      {/* Image with badge */}
      <div style={{ position: "relative", height: "200px", width: "100%" }}>
        <Image
          src={item.image}
          alt={item.title}
          fill
          style={{ objectFit: "cover" }}
        />
        {/* Badge */}
        <span style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          backgroundColor: "rgba(255,255,255,0.92)",
          color: "#374151",
          fontSize: "11px",
          fontWeight: "500",
          padding: "3px 10px",
          borderRadius: "4px",
          backdropFilter: "blur(4px)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}>
          {item.badge}
        </span>
      </div>

      {/* Card Body */}
      <div style={{ padding: "18px 18px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>
          {item.title}
        </h2>
        <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: "1.65", marginBottom: "16px", flex: 1 }}>
          {item.description}
        </p>

        {/* Price Row */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "14px" }}>
          <div>
            <p style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "2px" }}>{item.priceLabel}</p>
            <p style={{ fontSize: "20px", fontWeight: "700", color: "#EAB308", margin: 0, lineHeight: 1 }}>
              {item.price}{" "}
              <span style={{ fontSize: "12px", fontWeight: "400", color: "#9CA3AF" }}>{item.unit}</span>
            </p>
          </div>
          {/* Location */}
          <div style={{ display: "flex", alignItems: "center", gap: "3px", color: "#9CA3AF", fontSize: "11px" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {item.location}
          </div>
        </div>

        {/* CTA Button */}
        <button style={{
          width: "100%",
          backgroundColor: "#EAB308",
          color: "#ffffff",
          fontWeight: "600",
          fontSize: "13px",
          padding: "10px",
          borderRadius: "4px",
          border: "none",
          cursor: "pointer",
          letterSpacing: "0.3px",
          transition: "background-color 0.15s",
        }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#CA8A04")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#EAB308")}
        >
          Check Availability
        </button>
      </div>
    </div>
  );
}
