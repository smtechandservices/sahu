"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

/* ─────────────────────────────── DATA ──────────────────────────────── */

const jobs = [
  {
    id: 1,
    title: "Senior Accountant",
    company: "Gupta Enterprises Ltd.",
    badge: "Full-time",
    badgeColor: { bg: "#DBEAFE", text: "#1E40AF" },
    location: "Mumbai, MH",
    detail: "₹8L – ₹12L / yr",
    detailIcon: "salary",
  },
  {
    id: 2,
    title: "Administrative Assistant",
    company: "Sahu Community Trust",
    badge: "Part-time",
    badgeColor: { bg: "#F3F4F6", text: "#374151" },
    location: "Delhi, NCR",
    detail: "Min 2 yrs exp.",
    detailIcon: "exp",
  },
  {
    id: 3,
    title: "Software Developer",
    company: "Tech Innovations Sahu",
    badge: "Remote",
    badgeColor: { bg: "#78350F", text: "#FFFFFF" },
    location: "Anywhere",
    detail: "React, Node.js",
    detailIcon: "tech",
  },
];

const ads = [
  {
    id: 1,
    image: "/assets/event2.png",
    name: "Shreeji Silks & Sarees",
    category: "Apparel",
    categoryColor: { bg: "#FEF3C7", text: "#92400E" },
    description:
      "Premium silk sarees and traditional wear for all occasions. Exclusive 15% discount for Sahu Sabha members this festive season.",
    cta: "Visit Store",
    ctaIcon: "store",
    secondaryIcon: "phone",
  },
  {
    id: 2,
    image: "/assets/event3.png",
    name: "Naman Daily Mart",
    category: "Grocery",
    categoryColor: { bg: "#F3F4F6", text: "#374151" },
    description:
      "Your trusted neighborhood grocery store. Free home delivery within 5km for orders above ₹1000. Quality guaranteed.",
    cta: "Order Online",
    ctaIcon: "cart",
    secondaryIcon: "location",
  },
];

/* ──────────────────────────── ICONS ───────────────────────────────── */

const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SalaryIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
  </svg>
);

const TechIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const StoreIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const CartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

/* ──────────────────────────── COMPONENT ───────────────────────────── */

export default function CareerPage() {
  return (
    <>
      <Header />

      <main style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
        <div style={{ padding: "40px 48px", display: "flex", gap: "40px", alignItems: "flex-start" }}>

          {/* ══════════ LEFT: Job Opportunities ══════════ */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Section Header */}
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>
              Job Opportunities
            </h1>
            <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "14px" }}>
              Explore roles posted by community members.
            </p>
            <div style={{ height: "2px", backgroundColor: "#EAB308", marginBottom: "24px", width: "100%" }} />

            {/* Job Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>

          {/* ══════════ RIGHT: Advertisement Showcase ══════════ */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Section Header */}
            <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>
              Advertisement Showcase
            </h2>
            <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "14px" }}>
              Support our local community businesses.
            </p>
            <div style={{ height: "2px", backgroundColor: "#EAB308", marginBottom: "24px", width: "100%" }} />

            {/* Ad Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {ads.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Custom Footer with Post/Advertise button */}
      <div style={{ position: "relative" }}>
        {/* Post / Advertise button — sits at top-right of footer */}
        <div style={{
          position: "absolute",
          right: "48px",
          top: "-20px",
          zIndex: 10,
        }}>
          <button style={{
            backgroundColor: "#EAB308",
            color: "#ffffff",
            fontWeight: "600",
            fontSize: "13px",
            padding: "10px 18px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}>
            <PlusIcon />
            Post / Advertise
          </button>
        </div>
        <Footer />
      </div>
    </>
  );
}

/* ──────────────────────────── JOB CARD ──────────────────────────── */

function JobCard({ job }) {
  const DetailIcon =
    job.detailIcon === "salary" ? SalaryIcon :
    job.detailIcon === "tech" ? TechIcon : SalaryIcon;

  return (
    <div style={{
      border: "1px solid #E5E7EB",
      borderRadius: "6px",
      padding: "20px 20px 14px",
      backgroundColor: "#ffffff",
      position: "relative",
    }}>
      {/* Badge */}
      <span style={{
        position: "absolute",
        top: "18px",
        right: "18px",
        backgroundColor: job.badgeColor.bg,
        color: job.badgeColor.text,
        fontSize: "11px",
        fontWeight: "600",
        padding: "3px 10px",
        borderRadius: "4px",
      }}>
        {job.badge}
      </span>

      {/* Title */}
      <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", marginBottom: "4px", paddingRight: "80px" }}>
        {job.title}
      </h3>

      {/* Company */}
      <p style={{ fontSize: "13px", color: "#EAB308", fontWeight: "600", marginBottom: "14px" }}>
        {job.company}
      </p>

      {/* Meta row */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "16px" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", color: "#6B7280" }}>
          <PinIcon /> {job.location}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", color: "#6B7280" }}>
          {job.detailIcon === "tech" ? <TechIcon /> : <SalaryIcon />}
          {job.detail}
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", backgroundColor: "#F3F4F6", marginBottom: "10px" }} />

      {/* View Details */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={{
          backgroundColor: "transparent",
          border: "1px solid #E5E7EB",
          color: "#EAB308",
          fontSize: "13px",
          fontWeight: "600",
          padding: "6px 14px",
          borderRadius: "4px",
          cursor: "pointer",
        }}>
          View Details
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────── AD CARD ──────────────────────────── */

function AdCard({ ad }) {
  const CtaIcon = ad.ctaIcon === "store" ? StoreIcon : CartIcon;
  const SecondaryIcon = ad.secondaryIcon === "phone" ? PhoneIcon : LocationIcon;

  return (
    <div style={{
      border: "1px solid #E5E7EB",
      borderRadius: "6px",
      overflow: "hidden",
      backgroundColor: "#ffffff",
    }}>
      {/* Image */}
      <div style={{ position: "relative", height: "180px", width: "100%" }}>
        <Image src={ad.image} alt={ad.name} fill style={{ objectFit: "cover" }} />
      </div>

      {/* Body */}
      <div style={{ padding: "16px" }}>
        {/* Name + Category */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827" }}>{ad.name}</h3>
          <span style={{
            backgroundColor: ad.categoryColor.bg,
            color: ad.categoryColor.text,
            fontSize: "11px",
            fontWeight: "600",
            padding: "3px 10px",
            borderRadius: "4px",
          }}>
            {ad.category}
          </span>
        </div>

        {/* Description */}
        <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: "1.6", marginBottom: "14px" }}>
          {ad.description}
        </p>

        {/* CTA Row */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={{
            flex: 1,
            backgroundColor: "#EAB308",
            color: "#ffffff",
            fontWeight: "600",
            fontSize: "13px",
            padding: "10px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",
          }}>
            <CtaIcon /> {ad.cta}
          </button>
          <button style={{
            width: "42px",
            height: "42px",
            border: "1px solid #E5E7EB",
            backgroundColor: "#ffffff",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <SecondaryIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
