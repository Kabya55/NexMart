'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';
import {
  ArrowLeft, MapPin, Tag, User, Calendar, ShieldCheck,
  MessageSquare, Star, Heart, Share2, Compass, AlertCircle,
  ChevronLeft, ChevronRight
} from 'lucide-react';

export default function ItemDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id;
  const { user } = useAuth();

  const [item, setItem] = useState<any>(null);
  const [relatedItems, setRelatedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inquireSuccess, setInquireSuccess] = useState(false);
  const [inquireText, setInquireText] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch item details
        const detailsRes = await apiFetch(`/items/${itemId}`);
        if (detailsRes.item) {
          setItem(detailsRes.item);

          // Fetch related items in same category
          const relatedRes = await apiFetch(`/items?category=${detailsRes.item.category}&limit=5`);
          if (relatedRes.items) {
            // Filter out current item
            const filtered = relatedRes.items.filter((i: any) => (i._id || i.id) !== itemId).slice(0, 4);
            setRelatedItems(filtered);
          }

          // Fetch user watchlist state if authenticated
          if (user) {
            try {
              const watchlistRes = await apiFetch('/auth/watchlist');
              if (watchlistRes.watchlist) {
                const isWatchlisted = watchlistRes.watchlist.some((i: any) => (i._id || i.id) === itemId);
                setIsFavorite(isWatchlisted);
              }
            } catch (wErr) {
              console.error('Failed to fetch user watchlist:', wErr);
            }
          }
        } else {
          setError('Listing detail not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to retrieve listing details');
      }
      setLoading(false);
    };

    if (itemId) {
      fetchItemDetails();
    }
  }, [itemId, user]);

  const handleWatchlistToggle = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      if (isFavorite) {
        await apiFetch(`/auth/watchlist/${itemId}`, { method: 'DELETE' });
        setIsFavorite(false);
      } else {
        await apiFetch(`/auth/watchlist/${itemId}`, { method: 'POST' });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Failed to toggle watchlist item:', err);
    }
  };

  const handleInquireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inquireText) {
      setInquireSuccess(true);
      setInquireText('');
      setTimeout(() => setInquireSuccess(false), 4000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-slate-400">Loading specs sheet...</span>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-6">
        <div className="h-16 w-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-white text-xl font-bold">Failed to load listing</h2>
        <p className="text-slate-400 text-sm">{error || 'The requested listing does not exist.'}</p>
        <div className="flex justify-center space-x-3">
          <button onClick={() => router.push('/explore')} className="px-5 py-2.5 bg-indigo-600 text-xs font-semibold text-white rounded-xl shadow-md">
            Go back to explore
          </button>
        </div>
      </div>
    );
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const img = container.querySelector('img');
    if (img) {
      img.style.transformOrigin = `${x}% ${y}%`;
      img.style.transform = 'scale(2.2)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const img = container.querySelector('img');
    if (img) {
      img.style.transformOrigin = 'center center';
      img.style.transform = 'scale(1)';
    }
  };

  const scrollLeft = () => {
    const container = document.getElementById('thumbnail-container');
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('thumbnail-container');
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    setSubmittingReview(true);
    setReviewError(null);
    try {
      const res = await apiFetch(`/items/${itemId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
      });
      if (res.item) {
        setItem(res.item);
        setReviewComment('');
        setReviewRating(5);
      }
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review');
    }
    setSubmittingReview(false);
  };

  const reviews = item?.reviews || [];
  const totalReviews = reviews.length;

  const avgRating = totalReviews > 0
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews
    : Number(item?.rating || 5);

  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r: any) => {
    const rate = Math.round(r.rating) as 5 | 4 | 3 | 2 | 1;
    if (ratingDistribution[rate] !== undefined) {
      ratingDistribution[rate]++;
    }
  });

  const getPercent = (stars: number) => {
    if (totalReviews === 0) {
      if (stars === 5) return 100;
      return 0;
    }
    return Math.round((ratingDistribution[stars as 5 | 4 | 3 | 2 | 1] / totalReviews) * 100);
  };

  const seller = item.ownerId || { name: 'Verified Seller', email: 'seller@nexmart.com' };
  const images = item.imageUrls && item.imageUrls.length > 0
    ? item.imageUrls
    : [item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow flex flex-col space-y-16">
      {/* Back button */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to previous screen</span>
        </button>
      </div>

      {/* CORE SPEC GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Product Images */}
        <div className="lg:col-span-7 space-y-6">
          <div
            className="glass-card rounded-2xl overflow-hidden border border-white/10 aspect-video relative cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={images[activeImageIndex]}
              alt={item.title}
              className="w-70% h-full mx-auto transition-transform duration-150 ease-out pointer-events-none"
            />
            {item.priority === 'high' && (
              <span className="absolute top-4 right-4 bg-rose-500/90 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded shadow-lg pointer-events-none">
                High Priority
              </span>
            )}
          </div>
          {/* Gallery Carousel */}
          <div className="relative flex items-center justify-between group/gallery px-6">
            {images.length > 3 && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 z-10 p-1.5 rounded-full bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shadow-lg"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}

            <div
              id="thumbnail-container"
              className="flex space-x-4 overflow-x-auto scrollbar-none scroll-smooth w-full py-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {images.map((imgUrl: string, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`flex-shrink-0 aspect-video w-[31%] md:w-[31.5%] bg-white/5 rounded-xl border overflow-hidden cursor-pointer transition-all ${activeImageIndex === idx
                    ? 'border-indigo-500 scale-[1.02] shadow-lg shadow-indigo-500/10 opacity-100'
                    : 'border-white/10 opacity-70 hover:opacity-100 hover:border-indigo-400/50'
                    }`}
                >
                  <img src={imgUrl} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {images.length > 3 && (
              <button
                onClick={scrollRight}
                className="absolute right-0 z-10 p-1.5 rounded-full bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shadow-lg"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Spec Info */}
        <div className="lg:col-span-5 flex flex-col space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                {item.category}
              </span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="flex items-center space-x-1 text-xs text-yellow-400 font-semibold">
                <span>★</span>
                <span>{Number(avgRating).toFixed(1)} Rating ({totalReviews} reviews)</span>
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              {item.title}
            </h1>

            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-black text-indigo-300">${item.price}</span>
              <span className="text-xs text-slate-400">Guaranteed price listing</span>
            </div>
          </div>

          {/* Quick Actions (Favorite, Share) */}
          <div className="flex items-center space-x-3 border-y border-white/5 py-4">
            <button
              onClick={handleWatchlistToggle}
              className={`flex-grow flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold border transition-all ${isFavorite
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
            >
              <Heart className={`h-4.5 w-4.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isFavorite ? 'Watchlisted' : 'Add to Watchlist'}</span>
            </button>
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all">
              <Share2 className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Inquiry form */}
          <div className="bg-[#0e1017] p-5 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <MessageSquare className="h-4.5 w-4.5 text-cyan-400" />
              <span>Contact Seller Directly</span>
            </h3>
            <p className="text-xxs text-slate-400">
              Send an instant inquiry. The seller will receive a dashboard notification with your profile coordinates.
            </p>

            <form onSubmit={handleInquireSubmit} className="space-y-3">
              <textarea
                rows={3}
                placeholder="Hi, is this listing still available? I'd like to discuss purchase options..."
                required
                value={inquireText}
                onChange={(e) => setInquireText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/60 rounded-xl border border-white/10 text-white placeholder-slate-650 text-xs focus:outline-none focus:border-cyan-500/50"
              />
              <button
                type="submit"
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white rounded-xl shadow-md shadow-cyan-500/10 active:scale-95 transition-all"
              >
                Send Inquiry Message
              </button>
            </form>

            {inquireSuccess && (
              <div className="flex items-center space-x-1.5 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xxs justify-center animate-pulse">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Message dispatched successfully!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DETAILED SPEC SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-white/5 pt-12">
        {/* Description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider border-b-2 border-indigo-500 pb-2 inline-block">
              Listing Description
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line pt-2">
              {item.fullDescription}
            </p>
          </div>

          {/* Ratings Summary (Visual) */}
          <div className="space-y-4 pt-6">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider border-b-2 border-indigo-500 pb-2 inline-block">
              Ratings & Reviews
            </h2>
            <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row items-center justify-around gap-6 animate-fadeIn">
              <div className="text-center">
                <span className="text-4xl font-black text-indigo-300">{Number(avgRating).toFixed(1)}</span>
                <span className="text-xxs text-slate-400 block mt-1 uppercase font-bold">Out of 5.0</span>
                <div className="flex text-yellow-555 justify-center space-x-0.5 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const starVal = i + 1;
                    return (
                      <span key={i} className={`text-xs ${starVal <= Math.round(avgRating) ? 'text-yellow-400' : 'text-slate-700'}`}>
                        ★
                      </span>
                    );
                  })}
                </div>
                <span className="text-[10px] text-slate-500 block mt-1.5 uppercase tracking-wider font-bold">
                  {totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}
                </span>
              </div>
              <div className="flex-grow space-y-2 max-w-xs w-full text-xxs text-slate-400">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const percent = getPercent(stars);
                  return (
                    <div key={stars} className="flex items-center space-x-2">
                      <span className="w-16 flex-shrink-0 text-left text-yellow-400 tracking-tighter text-[9px]">
                        {'★'.repeat(stars)}
                      </span>
                      <div className="h-1.5 bg-slate-850 rounded-full flex-grow overflow-hidden">
                        <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${percent}%` }}></div>
                      </div>
                      <span className="w-8 flex-shrink-0 text-left">{percent}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-4 pt-2">
              {reviews.length === 0 ? (
                <div className="p-6 text-center bg-slate-950/20 rounded-xl border border-dashed border-white/5 text-xs text-slate-500">
                  No reviews yet. Be the first to leave a review for this gadget!
                </div>
              ) : (
                reviews.map((rev: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-950/40 rounded-xl border border-white/5 text-xs space-y-2 animate-fadeIn">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{rev.userName}</span>
                        <span className="text-[9px] text-slate-500">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Just now'}
                        </span>
                      </div>
                      <span className="text-yellow-450 font-bold flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < rev.rating ? 'text-yellow-405' : 'text-slate-800'}>★</span>
                        ))}
                      </span>
                    </div>
                    <p className="text-slate-400 leading-relaxed whitespace-pre-line">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Leave a Review Form */}
            <div className="bg-[#0e1017] p-5 rounded-2xl border border-white/5 space-y-4 mt-6">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Star className="h-4.5 w-4.5 text-yellow-400 fill-yellow-400" />
                <span>Write a Product Review</span>
              </h3>

              {!user ? (
                <p className="text-xs text-slate-400">
                  You must be logged in to leave a rating and review.{' '}
                  <Link href="/login" className="text-indigo-400 font-bold hover:underline">
                    Login here
                  </Link>
                  .
                </p>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-semibold">Your Rating:</span>
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }).map((_, idx) => {
                        const starVal = idx + 1;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setReviewRating(starVal)}
                            className={`text-xl transition-all duration-150 active:scale-125 hover:text-yellow-400 ${starVal <= reviewRating ? 'text-yellow-400' : 'text-slate-700'
                              }`}
                          >
                            ★
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <textarea
                      rows={3}
                      required
                      placeholder="Share your experience with this tech product, its condition, pricing relevance, or the seller's transparency..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950/60 rounded-xl border border-white/10 text-white placeholder-slate-650 text-xs focus:outline-none focus:border-yellow-500/50"
                    />
                  </div>

                  {reviewError && (
                    <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-450 text-xxs flex items-center space-x-1">
                      <span>⚠️ {reviewError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-2 bg-indigo-650 hover:bg-indigo-600 active:scale-98 text-xs font-bold text-white rounded-xl shadow-md transition-all disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting Review...' : 'Publish Rating & Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Specifications sheet & Seller profile */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider border-b-2 border-indigo-500 pb-2 inline-block">
              Listing Details
            </h2>
            <div className="glass-card rounded-2xl p-5 border border-white/5 text-xs divide-y divide-white/5 space-y-3.5">
              <div className="flex justify-between items-center pt-3">
                <span className="text-slate-400 font-semibold flex items-center space-x-1.5">
                  <Tag className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Category</span>
                </span>
                <span className="text-white font-bold">{item.category}</span>
              </div>
              <div className="flex justify-between items-center pt-3.5">
                <span className="text-slate-400 font-semibold flex items-center space-x-1.5">
                  <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Location</span>
                </span>
                <span className="text-white font-bold">{item.location}</span>
              </div>
              <div className="flex justify-between items-center pt-3.5">
                <span className="text-slate-400 font-semibold flex items-center space-x-1.5">
                  <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Listed On</span>
                </span>
                <span className="text-white font-bold">
                  {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3.5">
                <span className="text-slate-400 font-semibold flex items-center space-x-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Sale Urgency</span>
                </span>
                <span className={`font-black uppercase tracking-wider text-xxs px-2 py-0.5 rounded ${item.priority === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-800 text-slate-300'
                  }`}>
                  {item.priority}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider border-b-2 border-indigo-500 pb-2 inline-block">
              Listing Owner
            </h2>
            <div className="glass-card rounded-2xl p-5 border border-white/5 flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-base">
                <User className="h-5 w-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">{seller.name}</span>
                <span className="text-slate-500 block mt-0.5">{seller.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED ITEMS */}
      {relatedItems.length > 0 && (
        <div className="space-y-8 border-t border-white/5 pt-12">
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider border-b-2 border-indigo-500 pb-2 inline-block">
              Related Gear Listings
            </h2>
            <p className="text-slate-400 text-xs mt-1.5">Discover similar technology listings on NexMart.</p>
          </div>

          {/* Cards list matches core explorer cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedItems.map((rel: any) => (
              <div
                key={rel._id || rel.id}
                className="glass-card rounded-2xl overflow-hidden h-[410px] flex flex-col group relative"
              >
                {/* Priority Indicator */}
                {rel.priority === 'high' && (
                  <span className="absolute top-3 right-3 bg-rose-500/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded z-10">
                    High Priority
                  </span>
                )}

                {/* Image */}
                <div className="h-[180px] w-full overflow-hidden relative border-b border-white/5">
                  <img
                    src={rel.imageUrl}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold px-2 py-0.5 rounded">
                    {rel.category}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-white font-bold text-sm tracking-tight line-clamp-1 mb-1 group-hover:text-indigo-400 transition-colors">
                    {rel.title}
                  </h3>
                  <span className="text-[11px] text-slate-400 flex items-center space-x-1.5 mb-2 font-medium">
                    <span>📍 {rel.location}</span>
                    <span>•</span>
                    <span className="text-yellow-400">★ {Number(rel.rating || 5).toFixed(1)}</span>
                  </span>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {rel.shortDescription}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <span className="text-base font-black text-indigo-300">
                      ${rel.price}
                    </span>
                    <Link
                      href={`/items/${rel._id || rel.id}`}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 hover:scale-105 transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
