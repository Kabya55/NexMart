'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../utils/api';
import Link from 'next/link';
import { 
  User, Settings, Heart, PlusCircle, Trash2, Eye, 
  BarChart3, Users, ShoppingBag, DollarSign, Bookmark,
  AlertCircle, Check, ArrowRight, ShieldAlert
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

const CHART_COLORS = ['#6366f1', '#06b6d4', '#d946ef', '#10b981', '#f59e0b', '#ec4899'];

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'listings' | 'watchlist' | 'admin_stats'>('listings');
  
  // Data States
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [allListings, setAllListings] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Authentication Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Watchlist
      const wRes = await apiFetch('/auth/watchlist');
      if (wRes.watchlist) {
        setWatchlist(wRes.watchlist);
      }

      // 2. Fetch All Listings (limit to 100 for dashboard review)
      const lRes = await apiFetch('/items?limit=100');
      if (lRes.items) {
        setAllListings(lRes.items);
      }

      // 3. Fetch Market Stats (always load for admin, or for general metrics)
      const sRes = await apiFetch('/stats');
      if (sRes) {
        setStats(sRes);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sync dashboard data');
    }
    setLoading(false);
  };

  useEffect(() => {
    setMounted(true);
    if (user) {
      fetchData();
      // Set default tab based on role
      if (user.role === 'admin') {
        setActiveTab('admin_stats');
      } else {
        setActiveTab('watchlist');
      }
    }
  }, [user]);

  const handleRemoveFromWatchlist = async (itemId: string) => {
    setError(null);
    try {
      await apiFetch(`/auth/watchlist/${itemId}`, { method: 'DELETE' });
      setWatchlist((prev) => prev.filter((i) => (i._id || i.id) !== itemId));
      setActionSuccess('Item removed from watchlist');
      setTimeout(() => setActionSuccess(null), 3000);
      
      // Refresh stats
      const sRes = await apiFetch('/stats');
      if (sRes) setStats(sRes);
    } catch (err: any) {
      setError(err.message || 'Failed to update watchlist.');
    }
  };

  const handleDeleteListing = async (itemId: string) => {
    setError(null);
    try {
      await apiFetch(`/items/${itemId}`, { method: 'DELETE' });
      setAllListings((prev) => prev.filter((i) => (i._id || i.id) !== itemId));
      setConfirmDeleteId(null);
      setActionSuccess('Listing deleted successfully');
      setTimeout(() => setActionSuccess(null), 3000);
      
      // Refresh watchlist & stats
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete listing.');
      setConfirmDeleteId(null);
    }
  };

  if (authLoading || !user || !mounted) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-slate-400">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  // Filter listings: Admin sees all, User sees only their own
  const myListings = allListings.filter((item) => {
    if (user.role === 'admin') return true;
    const ownerIdStr = (item.ownerId && typeof item.ownerId === 'object') 
      ? (item.ownerId._id || item.ownerId.id) 
      : item.ownerId;
    return ownerIdStr === user.id;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow flex flex-col space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xxs uppercase tracking-wider text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30">
              {user.role} Dashboard
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1.5 flex items-center space-x-2.5">
            <span>Welcome, {user.name}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {user.email} • Monitor listings, watchlist bookmarks, and marketplace metrics.
          </p>
        </div>

        {user.role === 'admin' && (
          <Link 
            href="/items/add"
            className="mt-4 md:mt-0 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-xl shadow-md flex items-center space-x-2 transition-all hover:scale-102"
          >
            <PlusCircle className="h-4.5 w-4.5" />
            <span>List New Product</span>
          </Link>
        )}
      </div>

      {/* Success/Error Alerts */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-400 text-sm font-semibold flex items-center space-x-2 justify-center animate-bounce">
          <Check className="h-4 w-4" />
          <span>{actionSuccess}</span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-rose-400 text-sm font-medium flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs selectors */}
      <div className="flex border-b border-white/5 space-x-2">
        {user.role === 'admin' && (
          <button
            onClick={() => setActiveTab('admin_stats')}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all border-b-2 ${
              activeTab === 'admin_stats'
                ? 'border-indigo-500 text-white bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span className="flex items-center space-x-1.5">
              <BarChart3 className="h-4 w-4" />
              <span>Admin Console</span>
            </span>
          </button>
        )}
        {user.role === 'admin' && (
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all border-b-2 ${
              activeTab === 'listings'
                ? 'border-indigo-500 text-white bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span className="flex items-center space-x-1.5">
              <Settings className="h-4 w-4" />
              <span>Manage Listings ({myListings.length})</span>
            </span>
          </button>
        )}
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all border-b-2 ${
            activeTab === 'watchlist'
              ? 'border-indigo-500 text-white bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <span className="flex items-center space-x-1.5">
            <Heart className="h-4 w-4" />
            <span>My Watchlist ({watchlist.length})</span>
          </span>
        </button>
      </div>

      {/* TABS CONTENT */}
      <div className="space-y-6">
        
        {/* TAB 1: ADMIN CONSOLE STATS */}
        {activeTab === 'admin_stats' && user.role === 'admin' && (
          <div className="space-y-8 animate-fadeIn">
            {/* GLOWING ADMIN CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Total Users */}
              <div className="glass-card rounded-2xl p-6 border border-white/5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xxs uppercase tracking-wider text-slate-400 font-bold block">Active Users</span>
                  <span className="text-3xl font-black text-white block">
                    {stats?.summary?.totalUsers || '0'}
                  </span>
                </div>
                <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
              </div>

              {/* Card 2: Total Listings */}
              <div className="glass-card rounded-2xl p-6 border border-white/5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xxs uppercase tracking-wider text-slate-400 font-bold block">Active Products</span>
                  <span className="text-3xl font-black text-white block">
                    {stats?.summary?.totalItems || '0'}
                  </span>
                </div>
                <div className="h-12 w-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6" />
                </div>
              </div>

              {/* Card 3: Total Watchlisted */}
              <div className="glass-card rounded-2xl p-6 border border-white/5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xxs uppercase tracking-wider text-slate-400 font-bold block">Watchlisted items</span>
                  <span className="text-3xl font-black text-white block">
                    {stats?.summary?.totalWatchlisted || '0'}
                  </span>
                </div>
                <div className="h-12 w-12 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/25 flex items-center justify-center">
                  <Bookmark className="h-6 w-6" />
                </div>
              </div>

              {/* Card 4: Total Sales volume */}
              <div className="glass-card rounded-2xl p-6 border border-white/5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xxs uppercase tracking-wider text-slate-400 font-bold block">Sales Volume</span>
                  <span className="text-3xl font-black text-emerald-400 block">
                    ${stats?.summary?.totalSales?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* CHARTS CONTAINER */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Area Chart: growth */}
              <div className="glass-card rounded-2xl p-6 border border-white/5 h-[300px]">
                <h3 className="text-xs uppercase text-slate-400 font-bold mb-4 tracking-wider">Listings Traffic Analysis</h3>
                <ResponsiveContainer width="100%" height="88%">
                  <AreaChart data={stats?.growthTrend || []} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="adminListings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, color: '#f8fafc' }} />
                    <Area type="monotone" dataKey="listings" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#adminListings)" name="Listings" />
                    <Area type="monotone" dataKey="views" stroke="#06b6d4" strokeWidth={2} fillOpacity={0} name="Traffic" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart: category distribution */}
              <div className="glass-card rounded-2xl p-6 border border-white/5 h-[300px]">
                <h3 className="text-xs uppercase text-slate-400 font-bold mb-4 tracking-wider">Listings by Category</h3>
                <ResponsiveContainer width="100%" height="88%">
                  <BarChart data={stats?.categoryStats || []} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="category" stroke="#475569" fontSize={10} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, color: '#f8fafc' }} />
                    <Bar dataKey="count" name="Products" radius={[4, 4, 0, 0]}>
                      {stats?.categoryStats?.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY LISTINGS / MANAGE LISTINGS */}
        {activeTab === 'listings' && (
          <div className="space-y-4 animate-fadeIn">
            {myListings.length === 0 ? (
              <div className="glass-card rounded-3xl p-16 text-center border border-white/5 space-y-4 max-w-md mx-auto">
                <span className="text-4xl">📁</span>
                <h3 className="text-white font-bold text-lg">No Listings</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  There are no listings to manage. Create a new gadget listing now!
                </p>
                {user.role === 'admin' && (
                  <Link href="/items/add" className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-xl shadow-md">
                    Add Listing
                  </Link>
                )}
              </div>
            ) : (
              <>
                {/* Desktop listings table */}
                <div className="hidden md:block overflow-hidden rounded-2xl border border-white/5 bg-[#0e1017]/60">
                  <table className="min-w-full divide-y divide-white/5 text-left text-xs text-slate-300">
                    <thead className="bg-[#0b0c13] text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                      <tr>
                        <th scope="col" className="px-6 py-4">Item Details</th>
                        <th scope="col" className="px-6 py-4">Category</th>
                        <th scope="col" className="px-6 py-4">Urgency</th>
                        <th scope="col" className="px-6 py-4">Price</th>
                        {user.role === 'admin' && <th scope="col" className="px-6 py-4">Owner</th>}
                        <th scope="col" className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {myListings.map((item) => {
                        const itemId = item._id || item.id;
                        const isConfirming = confirmDeleteId === itemId;
                        const owner = item.ownerId || { name: 'Admin', email: 'admin@nexmart.com' };
                        return (
                          <tr key={itemId} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-medium text-white flex items-center space-x-3.5">
                              <img src={item.imageUrl} alt={item.title} className="h-10 w-14 rounded-lg object-cover border border-white/10" />
                              <div className="max-w-[200px]">
                                <span className="font-bold text-sm block truncate">{item.title}</span>
                                <span className="text-[10px] text-slate-500">📍 {item.location}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-semibold text-cyan-400">{item.category}</td>
                            <td className="px-6 py-4">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                item.priority === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {item.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-white text-sm">${item.price}</td>
                            {user.role === 'admin' && (
                              <td className="px-6 py-4 text-slate-400">
                                <span className="block font-semibold text-white">{owner.name}</span>
                                <span className="text-xxs text-slate-500 block">{owner.email}</span>
                              </td>
                            )}
                            <td className="px-6 py-4 text-right">
                              {isConfirming ? (
                                <div className="flex items-center justify-end space-x-2">
                                  <span className="text-[10px] text-rose-400 font-bold mr-1">Confirm delete?</span>
                                  <button onClick={() => handleDeleteListing(itemId)} className="px-2.5 py-1 rounded bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-500">
                                    Yes
                                  </button>
                                  <button onClick={() => setConfirmDeleteId(null)} className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-bold text-[10px] hover:bg-slate-700">
                                    No
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end space-x-2">
                                  <Link href={`/items/${itemId}`} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                  <Link href={`/items/${itemId}/edit`} className="p-2 rounded-lg bg-white/5 hover:bg-amber-500/10 text-slate-400 hover:text-amber-400 transition-colors">
                                    <Edit3 className="h-4 w-4" />
                                  </Link>
                                  <button onClick={() => setConfirmDeleteId(itemId)} className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card listings */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {myListings.map((item) => {
                    const itemId = item._id || item.id;
                    const isConfirming = confirmDeleteId === itemId;
                    return (
                      <div key={itemId} className="glass-card rounded-xl p-5 border border-white/5 space-y-4">
                        <div className="flex items-center space-x-3.5">
                          <img src={item.imageUrl} alt={item.title} className="h-12 w-16 rounded-lg object-cover border border-white/10" />
                          <div className="flex-grow min-w-0">
                            <span className="font-bold text-white text-sm block truncate">{item.title}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">📍 {item.location}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-xs border-y border-white/5 py-2.5">
                          <div>
                            <span className="text-slate-500 block">Category</span>
                            <span className="text-cyan-400 font-bold block">{item.category}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Price</span>
                            <span className="text-white font-bold block">${item.price}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Urgency</span>
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              item.priority === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {item.priority}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-end pt-2">
                          {isConfirming ? (
                            <div className="flex items-center space-x-2 w-full justify-between">
                              <span className="text-xxs text-rose-400 font-bold">Confirm delete?</span>
                              <div className="flex space-x-1.5">
                                <button onClick={() => handleDeleteListing(itemId)} className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs">Delete</button>
                                <button onClick={() => setConfirmDeleteId(null)} className="px-3 py-1.5 rounded-lg bg-slate-850 text-slate-300 font-bold text-xs">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex space-x-2 w-full">
                              <Link href={`/items/${itemId}`} className="w-1/3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-350 text-xs font-bold text-center flex items-center justify-center space-x-1 border border-white/5">
                                <Eye className="h-4 w-4" />
                                <span>Details</span>
                              </Link>
                              <Link href={`/items/${itemId}/edit`} className="w-1/3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 text-amber-400 text-xs font-bold text-center flex items-center justify-center space-x-1">
                                <Edit3 className="h-4 w-4" />
                                <span>Edit</span>
                              </Link>
                              <button onClick={() => setConfirmDeleteId(itemId)} className="w-1/3 py-2 rounded-lg bg-rose-600/10 border border-rose-600/20 hover:bg-rose-600 hover:text-white text-rose-400 text-xs font-bold flex items-center justify-center space-x-1">
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 3: WATCHLIST TABLE */}
        {activeTab === 'watchlist' && (
          <div className="space-y-4 animate-fadeIn">
            {watchlist.length === 0 ? (
              <div className="glass-card rounded-3xl p-16 text-center border border-white/5 space-y-4 max-w-md mx-auto">
                <span className="text-4xl">❤️</span>
                <h3 className="text-white font-bold text-lg">Watchlist is Empty</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  You haven't watchlisted any premium tech gadgets yet. Open the explorer to find things you love.
                </p>
                <Link href="/explore" className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-xl shadow-md">
                  Explore Products
                </Link>
              </div>
            ) : (
              <>
                {/* Desktop watchlist table */}
                <div className="hidden md:block overflow-hidden rounded-2xl border border-white/5 bg-[#0e1017]/60">
                  <table className="min-w-full divide-y divide-white/5 text-left text-xs text-slate-300">
                    <thead className="bg-[#0b0c13] text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                      <tr>
                        <th scope="col" className="px-6 py-4">Item Details</th>
                        <th scope="col" className="px-6 py-4">Category</th>
                        <th scope="col" className="px-6 py-4">Rating</th>
                        <th scope="col" className="px-6 py-4">Price</th>
                        <th scope="col" className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {watchlist.map((item) => {
                        const itemId = item._id || item.id;
                        return (
                          <tr key={itemId} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-medium text-white flex items-center space-x-3.5">
                              <img src={item.imageUrl} alt={item.title} className="h-10 w-14 rounded-lg object-cover border border-white/10" />
                              <div className="max-w-[250px]">
                                <span className="font-bold text-sm block truncate">{item.title}</span>
                                <span className="text-[10px] text-slate-500">📍 {item.location}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-semibold text-cyan-400">{item.category}</td>
                            <td className="px-6 py-4 text-yellow-400 font-bold">★ {Number(item.rating || 5).toFixed(1)}</td>
                            <td className="px-6 py-4 font-bold text-white text-sm">${item.price}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Link href={`/items/${itemId}`} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white" title="View Details">
                                  <Eye className="h-4 w-4" />
                                </Link>
                                <button onClick={() => setConfirmRemoveId(itemId)} className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400" title="Remove Watchlist">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card watchlist */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {watchlist.map((item) => {
                    const itemId = item._id || item.id;
                    return (
                      <div key={itemId} className="glass-card rounded-xl p-5 border border-white/5 space-y-4">
                        <div className="flex items-center space-x-3.5">
                          <img src={item.imageUrl} alt={item.title} className="h-12 w-16 rounded-lg object-cover border border-white/10" />
                          <div className="flex-grow min-w-0">
                            <span className="font-bold text-white text-sm block truncate">{item.title}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">📍 {item.location}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-xs border-y border-white/5 py-2.5">
                          <div>
                            <span className="text-slate-500 block">Category</span>
                            <span className="text-cyan-400 font-bold block">{item.category}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Price</span>
                            <span className="text-white font-bold block">${item.price}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Rating</span>
                            <span className="text-yellow-400 font-bold block">★ {Number(item.rating || 5).toFixed(1)}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2 pt-2">
                          <Link href={`/items/${itemId}`} className="w-1/2 py-2 rounded-lg bg-white/5 text-slate-300 text-xs font-bold text-center flex items-center justify-center space-x-1">
                            <Eye className="h-4.5 w-4.5" />
                            <span>Details</span>
                          </Link>
                          <button onClick={() => setConfirmRemoveId(itemId)} className="w-1/2 py-2 rounded-lg bg-rose-600/10 text-rose-400 text-xs font-bold flex items-center justify-center space-x-1">
                            <Trash2 className="h-4.5 w-4.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

      </div>

      {/* Watchlist Remove Confirmation Modal */}
      {confirmRemoveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card rounded-2xl p-6 border border-white/10 max-w-sm w-full mx-4 space-y-4 shadow-2xl shadow-rose-950/20 transform scale-100 transition-transform">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="h-10 w-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-white font-bold text-lg">Remove from Watchlist?</h3>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Are you sure you want to remove this item from your watchlist? You can always add it back later from the explorer.
            </p>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => {
                  handleRemoveFromWatchlist(confirmRemoveId);
                  setConfirmRemoveId(null);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition-all active:scale-98"
              >
                Yes, Remove
              </button>
              <button
                onClick={() => setConfirmRemoveId(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-white/5 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
