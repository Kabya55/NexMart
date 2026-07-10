'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { apiFetch } from '../../../utils/api';
import { PlusCircle, ShoppingBag, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const CATEGORIES = ['Smartphones', 'Laptops', 'Audio', 'Wearables', 'Tablets', 'Cameras', 'Accessories', 'Gaming'];
const LOCATIONS = ['New York, USA', 'Seattle, USA', 'San Francisco, USA', 'Los Angeles, USA', 'Chicago, USA', 'Boston, USA', 'Austin, USA', 'Denver, USA', 'Portland, USA', 'Miami, USA', 'Las Vegas, USA'];

export default function AddItemPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState('');
  const [priority, setPriority] = useState('medium');
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [location, setLocation] = useState(LOCATIONS[0]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Authentication Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (Number(price) < 0) {
      setError('Price cannot be negative');
      setLoading(false);
      return;
    }

    const cleanedUrls = imageUrls.map(url => url.trim()).filter(url => url !== '');

    try {
      const payload = {
        title,
        shortDescription,
        fullDescription,
        category,
        price: Number(price),
        priority,
        imageUrl: cleanedUrls[0] || undefined,
        imageUrls: cleanedUrls,
        location
      };

      await apiFetch('/items', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/items/manage');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit listing. Please try again.');
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-slate-400">Verifying session profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow flex flex-col space-y-8">
      {/* Header navigations */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <button 
            onClick={() => router.back()} 
            className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Go Back</span>
          </button>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <PlusCircle className="h-7 w-7 text-indigo-400" />
            <span>List New Gadget</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1.5">
            Add detailed technical specifications and pricing details to launch your listing.
          </p>
        </div>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-400 text-sm font-semibold flex items-center space-x-3 justify-center animate-pulse">
          <span>🎉 Listing successfully uploaded! Redirecting to dashboard...</span>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-rose-400 text-sm font-medium flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 border border-white/5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-300">Listing Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. iPad Pro 11-inch (M4 Chip, 256GB)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/60 rounded-xl border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500/60 transition-colors"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/60 rounded-xl border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/60 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Seller Location *</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/60 rounded-xl border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/60 cursor-pointer"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc} className="bg-slate-900 text-white">
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Pricing Price ($ USD) *</label>
            <input
              type="number"
              required
              min="0"
              placeholder="e.g. 899"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/60 rounded-xl border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500/60 transition-colors"
            />
          </div>

          {/* Priority */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Listing Priority / Urgency *</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/60 rounded-xl border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/60 cursor-pointer"
            >
              <option value="low" className="bg-slate-900">Low (Standard availability)</option>
              <option value="medium" className="bg-slate-900">Medium (Regular listing)</option>
              <option value="high" className="bg-slate-900">High (Urgent sale tag)</option>
            </select>
          </div>

          {/* Image URLs */}
          <div className="space-y-3 md:col-span-2">
            <label className="text-xs font-bold text-slate-300 block">Product Image URLs (Add one or more)</label>
            <div className="space-y-2">
              {imageUrls.map((url, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="url"
                    placeholder={`Image URL #${index + 1} (e.g. https://images.unsplash.com/...)`}
                    value={url}
                    onChange={(e) => {
                      const newUrls = [...imageUrls];
                      newUrls[index] = e.target.value;
                      setImageUrls(newUrls);
                    }}
                    className="flex-grow px-4 py-2.5 bg-slate-950/60 rounded-xl border border-white/10 text-white placeholder-slate-650 text-sm focus:outline-none focus:border-indigo-500/60 transition-colors"
                  />
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrls(imageUrls.filter((_, i) => i !== index));
                      }}
                      className="px-4 py-2.5 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white rounded-xl text-xs font-bold transition-all border border-rose-550/20 active:scale-95"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setImageUrls([...imageUrls, ''])}
              className="px-4 py-2 bg-indigo-600/10 hover:bg-indigo-650 text-indigo-400 hover:text-white rounded-xl text-xs font-bold transition-all border border-indigo-500/20 active:scale-95"
            >
              + Add More Images
            </button>
          </div>

          {/* Short Description */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-300">Short Summary Card Description *</label>
            <input
              type="text"
              required
              maxLength={150}
              placeholder="Brief summary card caption, max 150 chars. e.g. Ultra-thin OLED display iPad powered by M4 chip."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/60 rounded-xl border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500/60 transition-colors"
            />
          </div>

          {/* Full Description */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-300">Full Specifications Overview *</label>
            <textarea
              required
              rows={6}
              placeholder="Enter comprehensive specs details. Include memory metrics, processor performance, accessories inside the box, and cosmetic condition details..."
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/60 rounded-xl border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500/60 transition-colors"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-white/5 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white gradient-bg hover:shadow-lg hover:shadow-indigo-500/20 active:scale-98 transition-all hover:scale-102 flex items-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Publishing listing...</span>
              </span>
            ) : (
              <>
                <span>Publish Listing</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
