"use client";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import CareerHero from "./CareerHero";
import JobCard from "./JobCard";
import AdCard from "./AdCard";

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

export default function CareerClient() {
  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen pb-20">
        <CareerHero />

        <div className="container-custom py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left: Job Opportunities */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Job Opportunities</h2>
                <p className="text-gray-500">Explore roles posted by community members.</p>
                <div className="h-1 w-20 bg-primary mt-4 rounded-full" />
              </div>

              <div className="grid gap-6">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>

            {/* Right: Advertisement Showcase */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Business Showcase</h2>
                <p className="text-gray-500">Support our local community businesses.</p>
                <div className="h-1 w-20 bg-primary mt-4 rounded-full" />
              </div>

              <div className="grid gap-8">
                {ads.map((ad) => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
