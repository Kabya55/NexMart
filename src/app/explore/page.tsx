'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '../../utils/api';
import { Search, SlidersHorizontal, ArrowUpDown, MapPin, ChevronLeft, ChevronRight, X, AlertCircle } from 'lucide-react';

const CATEGORIES = ['All', 'Smartphones', 'Laptops', 'Audio', 'Wearables', 'Tablets', 'Cameras', 'Accessories', 'Gaming'];
const LOCATIONS = ['All', 'New York', 'Seattle', 'San Francisco', 'Los Angeles', 'Chicago', 'Boston', 'Austin', 'Denver', 'Portland', 'Miami', 'Las Vegas'];

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search & Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [location, setLocation] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [page, setPage] = useState(1);

  // Loaded items and metadata
  const [items, setItems] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Apply visual details sidebar toggle (on mobile)
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Load items when parameters change
  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const paramsObj: any = {
        page: page.toString(),
        limit: '8', // 8 items per page (2 full desktop rows of 4)
        sortBy
      };

      if (search) paramsObj.search = search;
      if (category && category !== 'All') paramsObj.category = category;
      if (location && location !== 'All') paramsObj.location = location;
      if (minPrice) paramsObj.minPrice = minPrice;
      if (maxPrice) paramsObj.maxPrice = maxPrice;

      const queryString = new URLSearchParams(paramsObj).toString();
      const res = await apiFetch(`/items?${queryString}`);

      if (res.items) {
        setItems(res.items);
        setTotalPages(res.pagination.totalPages || 1);
        setTotalItems(res.pagination.totalItems || 0);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve listings');
    }
    setLoading(false);
  };

  // Triggers reload on dependency updates
  useEffect(() => {
    fetchListings();
  }, [category, location, sortBy, page]);

  // Handle manual form search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchListings();
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('All');
    setLocation('All');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('date_desc');
    setPage(1);
    router.push('/explore');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow flex flex-col space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Explore Gear</h1>
          <p className="text-slate-400 text-xs mt-1.5">
            Browse through {totalItems} verified smart technology listings available now.
          </p>
        </div>

        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} className="mt-4 md:mt-0 flex items-center space-x-2">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search title, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9.5 pr-8 py-2 bg-slate-900/60 rounded-xl border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500/60 transition-colors"
            />
            {search && (
              <button 
                type="button" 
                onClick={() => { setSearch(''); setPage(1); }} 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button 
            type="submit" 
            className="px-4 py-2 text-xs font-semibold text-white gradient-bg rounded-xl hover:shadow-lg hover:shadow-indigo-500/10 active:scale-95 transition-all"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* FILTERS SIDEBAR (DESKTOP) */}
        <aside className="hidden lg:flex flex-col space-y-6 glass-card rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="font-bold text-white text-sm flex items-center space-x-2">
              <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
              <span>Filters</span>
            </span>
            <button 
              onClick={handleClearFilters}
              className="text-xxs font-bold text-slate-400 hover:text-indigo-400 transition-colors"
            >
              Reset All
            </button>
          </div>

          {/* Category List */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Category</label>
            <div className="flex flex-col space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setPage(1); }}
                  className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    category === cat
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Location Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <select
                value={location}
                onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-4 py-2 bg-slate-950/60 rounded-xl border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500/60 transition-colors cursor-pointer appearance-none"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc} className="bg-slate-900 text-white">
                    {loc === 'All' ? 'All Locations' : loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Boundaries */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Price Range ($)</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/60 rounded-xl border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500/60"
              />
              <span className="text-slate-500 text-xs">—</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/60 rounded-xl border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500/60"
              />
            </div>
            <button
              onClick={() => { setPage(1); fetchListings(); }}
              className="w-full mt-2 py-2 bg-slate-900 border border-white/10 hover:border-indigo-500/40 text-xs font-bold text-slate-300 hover:text-white rounded-xl transition-all"
            >
              Apply Price
            </button>
          </div>
        </aside>

        {/* LISTINGS DISPLAY GRID */}
        <section className="lg:col-span-3 space-y-8 flex flex-col h-full">
          {/* Sorting and Mobile toggles header */}
          <div className="flex items-center justify-between bg-[#0e1017] p-3 rounded-xl border border-white/5 text-xs text-slate-400">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 rounded-lg border border-white/10 text-white hover:bg-slate-850"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Filters</span>
              </button>
              <span>Showing {items.length} items</span>
            </div>

            <div className="flex items-center space-x-2">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="bg-transparent border-none text-slate-300 font-semibold focus:outline-none cursor-pointer hover:text-white"
              >
                <option value="date_desc" className="bg-slate-900">Newest Listings</option>
                <option value="price_asc" className="bg-slate-900">Price: Low to High</option>
                <option value="price_desc" className="bg-slate-900">Price: High to Low</option>
                <option value="rating_desc" className="bg-slate-900">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Alert messages */}
          {error && (
            <div className="flex items-center space-x-2 p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-rose-400 text-sm">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Cards Render with Skeleton Loader */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden h-[410px] flex flex-col p-4 space-y-4">
                  <div className="skeleton h-[180px] w-full rounded-xl"></div>
                  <div className="skeleton h-5 w-2/3 rounded"></div>
                  <div className="skeleton h-3.5 w-1/2 rounded"></div>
                  <div className="skeleton h-3.5 w-full rounded"></div>
                  <div className="skeleton h-3.5 w-5/6 rounded"></div>
                  <div className="flex justify-between items-center pt-2 mt-auto">
                    <div className="skeleton h-5 w-1/3 rounded"></div>
                    <div className="skeleton h-8 w-1/3 rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="glass-card rounded-3xl p-16 text-center border border-white/5 space-y-4 max-w-lg mx-auto mt-8">
              <span className="text-4xl">🔍</span>
              <h3 className="text-white font-bold text-lg">No Listings Match Filters</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                We couldn't find any electronics in this category matching your search string or price constraints. Try relaxing your filters.
              </p>
              <button 
                onClick={handleClearFilters}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-xl shadow-md transition-all active:scale-95"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            // Cards Grid: Desktop displays exactly 4 cards per row, layout is identical to Home lists
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <div 
                  key={item._id || item.id} 
                  className="glass-card rounded-2xl overflow-hidden h-[410px] flex flex-col group relative"
                >
                  {/* Priority indicator */}
                  {item.priority === 'high' && (
                    <span className="absolute top-3 right-3 bg-rose-500/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-lg z-10">
                      High Priority
                    </span>
                  )}
                  
                  {/* Card Image */}
                  <div className="h-[180px] w-full overflow-hidden relative border-b border-white/5">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" 
                    />
                    <div className="absolute bottom-2 left-2 bg-slate-900/80 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                      {item.category}
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-white font-bold text-sm tracking-tight line-clamp-1 mb-1 group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 flex items-center space-x-1.5 mb-2 font-medium">
                      <span>📍 {item.location}</span>
                      <span>•</span>
                      <span className="text-yellow-400">★ {Number(item.rating || 5).toFixed(1)}</span>
                    </span>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                      {item.shortDescription}
                    </p>
                    
                    {/* Card Action footer */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                      <span className="text-base font-black text-indigo-300">
                        ${item.price}
                      </span>
                      <Link 
                        href={`/items/${item._id || item.id}`}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 hover:scale-105 transition-all"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION PANEL */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-8 mt-auto">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-slate-400 transition-all cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-9 w-9 rounded-xl text-xs font-bold transition-all ${
                    page === i + 1
                      ? 'gradient-bg text-white shadow-md'
                      : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-slate-400 transition-all cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </section>
      </div>

      {/* MOBILE FILTERS SIDEBAR OVERLAY */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm lg:hidden">
          <div className="w-80 max-w-full h-full bg-[#090a0f] border-l border-white/10 p-6 flex flex-col space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="font-bold text-white text-sm flex items-center space-x-2">
                <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
                <span>Filters</span>
              </span>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Category List */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setPage(1); }}
                    className={`text-center py-2 rounded-lg text-xs font-medium transition-all ${
                      category === cat
                        ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                        : 'text-slate-400 bg-white/5 hover:text-white border border-transparent'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Location List */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Location</label>
              <select
                value={location}
                onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white text-xs"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc === 'All' ? 'All Locations' : loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Price Bounds */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Price Range ($)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/60 rounded-xl border border-white/10 text-white text-xs"
                />
                <span className="text-slate-500 text-xs">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/60 rounded-xl border border-white/10 text-white text-xs"
                />
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center space-x-3 pt-6 border-t border-white/5 mt-auto">
              <button
                onClick={handleClearFilters}
                className="w-1/2 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold text-slate-300 transition-all text-center"
              >
                Reset All
              </button>
              <button
                onClick={() => { setPage(1); fetchListings(); setShowMobileFilters(false); }}
                className="w-1/2 py-3 gradient-bg hover:shadow-lg rounded-xl text-xs font-bold text-white transition-all text-center"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-slate-400">Loading catalog...</span>
        </div>
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
