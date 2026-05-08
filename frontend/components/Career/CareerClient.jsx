"use client";

import { useState, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import CareerHero from "./CareerHero";
import JobCard from "./JobCard";
import AdCard from "./AdCard";

export default function CareerClient() {
  const [jobs, setJobs] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('../../lib/api').then(({ fetchApi }) => {
      Promise.all([
        fetchApi('/career/jobs/'),
        fetchApi('/career/ads/')
      ]).then(([jobsData, adsData]) => {
        // map data if needed
        const formattedJobs = jobsData.map(job => ({
          id: job.id,
          title: job.title,
          company: job.company,
          badge: job.type,
          badgeColor: { bg: "#DBEAFE", text: "#1E40AF" }, // placeholder
          location: job.location,
          detail: "View details", // placeholder
          detailIcon: "tech",
        }));
        
        const formattedAds = adsData.map(ad => ({
          id: ad.id,
          image: ad.image,
          name: ad.company,
          category: ad.title,
          categoryColor: { bg: "#FEF3C7", text: "#92400E" },
          description: ad.description,
          cta: "Visit",
          ctaIcon: "store",
          secondaryIcon: "phone",
        }));

        setJobs(formattedJobs);
        setAds(formattedAds);
      }).catch(err => console.error(err))
      .finally(() => setLoading(false));
    });
  }, []);

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
                {jobs.length === 0 ? <p>No jobs available.</p> : jobs.map((job) => (
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
                {ads.length === 0 ? <p>No ads available.</p> : ads.map((ad) => (
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
