'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '../../../lib/api';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function ArticlesAdmin() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchApi('/magazine/');
      setArticles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await fetchApi(`/magazine/${id}/`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Manage Magazine Articles</h2>
        <Link 
          href="/admin-panel/articles/new"
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-lg flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Article
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 line-clamp-1">{article.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {article.author?.name || 'Admin'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(article.published_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    article.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {article.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(article.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No articles found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
