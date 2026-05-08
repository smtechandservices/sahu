'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../../lib/api';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

export default function MatrimonialAdmin() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchApi('/matrimonial/');
      setProfiles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (id, currentStatus) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'hide' : 'approve'} this profile?`)) return;
    try {
      await fetchApi(`/matrimonial/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_approved: !currentStatus })
      });
      loadData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Matrimonial Approvals</h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {profiles.map((profile) => (
              <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full object-cover" src={profile.photo || '/assets/avatar_male.png'} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{profile.user_detail?.name || 'Unknown User'}</div>
                      <div className="text-sm text-gray-500">{profile.age} yrs • {profile.gender}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{profile.education}</div>
                  <div className="text-xs text-gray-400">{profile.occupation}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {profile.city}, {profile.state}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    profile.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {profile.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleToggleApproval(profile.id, profile.is_approved)}
                    className={`mr-4 ${profile.is_approved ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                  >
                    {profile.is_approved ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                  </button>
                  <button className="text-indigo-600 hover:text-indigo-900">
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {profiles.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No profiles found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
