'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import { Building2, Briefcase, Heart, BookOpen } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ accommodations: 0, jobs: 0, profiles: 0, articles: 0 });

  useEffect(() => {
    // In a real app we'd have a specific /stats/ endpoint
    // For now, let's just make multiple calls to get counts
    const getStats = async () => {
      try {
        const [acc, jobs, profiles, articles] = await Promise.all([
          fetchApi('/accommodations/'),
          fetchApi('/career/jobs/'),
          fetchApi('/matrimonial/'),
          fetchApi('/magazine/')
        ]);
        
        setStats({
          accommodations: acc.length || 0,
          jobs: jobs.length || 0,
          profiles: profiles.length || 0,
          articles: articles.length || 0
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };
    getStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg"><Building2 /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Accommodations</p>
            <p className="text-2xl font-bold text-gray-900">{stats.accommodations}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Briefcase /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Jobs Listings</p>
            <p className="text-2xl font-bold text-gray-900">{stats.jobs}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg"><Heart /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Matrimonial Profiles</p>
            <p className="text-2xl font-bold text-gray-900">{stats.profiles}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg"><BookOpen /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Published Articles</p>
            <p className="text-2xl font-bold text-gray-900">{stats.articles}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Welcome to Sahu Sabha Admin Control</h3>
        <p className="text-gray-600">
          From this panel, you can manage all dynamic content across the website. 
          Use the sidebar to navigate to specific sections.
        </p>
      </div>
    </div>
  );
}
