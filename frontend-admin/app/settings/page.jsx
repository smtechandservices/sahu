'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import { Image as ImageIcon, Plus, Trash2, Save, Loader2, ArrowUp, ArrowDown } from 'lucide-react';

export default function SiteSettingsManager() {
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const images = await fetchApi('/carousel-images/');
      setCarouselImages(images);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append('image_file', file);

    try {
      await fetchApi('/carousel-images/', {
        method: 'POST',
        body: body,
        isFormData: true
      });
      fetchData();
    } catch (err) {
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await fetchApi(`/carousel-images/${id}/`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      alert("Failed to delete image");
    }
  };

  return (
    <div className="mx-auto space-y-12 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Site Settings</h1>
          <p className="text-gray-500 font-medium">Manage your homepage hero carousel and global configurations.</p>
        </div>
      </div>

      {/* Carousel Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ImageIcon className="text-primary w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Hero Carousel</h2>
          </div>
          <label className="cursor-pointer bg-primary hover:bg-primary-dark text-white px-6 py-2.5 text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
            <Plus size={18} />
            Add Slide
            <input type="file" className="hidden" onChange={handleAddImage} accept="image/*" />
          </label>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : carouselImages.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
            <ImageIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold">No carousel images added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carouselImages.map((img) => (
              <div key={img.id} className="bg-white border border-gray-100 shadow-sm overflow-hidden group">
                <div className="h-64 bg-gray-50 relative">
                  <img 
                    src={`data:${img.image_mimetype};base64,${img.image}`} 
                    alt="Carousel Slide"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => handleDelete(img.id)}
                      className="cursor-pointer p-4 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shadow-xl"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Metadata / Other Settings (Coming Soon Placeholder) */}
      <section className="bg-gray-50 p-10 rounded-3xl border border-gray-200 border-dashed text-center">
        <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">More Settings Coming Soon</p>
      </section>
    </div>
  );
}
