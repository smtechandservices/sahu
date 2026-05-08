'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '../../../lib/api';
import { Plus, Trash2, Edit, Briefcase, Megaphone } from 'lucide-react';

export default function JobsAdmin() {
  const [jobs, setJobs] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'ads'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsData, adsData] = await Promise.all([
        fetchApi('/career/jobs/'),
        fetchApi('/career/ads/')
      ]);
      setJobs(jobsData);
      setAds(adsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      await fetchApi(`/career/jobs/${id}/`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  const handleDeleteAd = async (id) => {
    if (!confirm('Are you sure you want to delete this advertisement?')) return;
    try {
      await fetchApi(`/career/ads/${id}/`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      alert('Failed to delete advertisement');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Career & Business</h2>
        
        {activeTab === 'jobs' ? (
          <Link 
            href="/admin-panel/jobs/new"
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-lg flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Job
          </Link>
        ) : (
          <Link 
            href="/admin-panel/ads/new"
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-lg flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Advertisement
          </Link>
        )}
      </div>

      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`pb-4 px-2 font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'jobs' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4" />
            <span>Job Listings ({jobs.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('ads')}
          className={`pb-4 px-2 font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'ads' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Megaphone className="w-4 h-4" />
            <span>Advertisements ({ads.length})</span>
          </div>
        </button>
      </div>

      {activeTab === 'jobs' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{job.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {job.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDeleteJob(job.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No jobs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'ads' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Title / Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ads.map((ad) => (
                <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{ad.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ad.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ad.contact_info || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDeleteAd(ad.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {ads.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No advertisements found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
