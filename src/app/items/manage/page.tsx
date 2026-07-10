'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { apiFetch } from '../../../utils/api';
import { Settings, Eye, Trash2,  AlertCircle, ShieldAlert, PlusCircle, Check } from 'lucide-react';

export default function ManageItemsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Authentication Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/items?limit=100'); // Fetch all listings
      if (res.items) {
        setItems(res.items);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load listings');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await apiFetch(`/items/${id}`, {
        method: 'DELETE'
      });
      setDeleteSuccess(true);
      setConfirmDeleteId(null);
      fetchItems(); // reload
      setTimeout(() => setDeleteSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete listing.');
      setConfirmDeleteId(null);
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

  // Filter listings based on ownership (admins manage all, users manage their own)
  const managedItems = items.filter((item) => {
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
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2.5">
            <Settings className="h-7 w-7 text-indigo-400" />
            <span>Manage listings</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1.5">
            {user.role === 'admin' 
              ? 'Administrator Mode: Review and remove any active listings on the platform.'
              : 'Add, view, and delete listings uploaded by your account.'
            }
          </p>
        </div>

        <Link 
          href="/items/add"
          className="mt-4 md:mt-0 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-xl shadow-md flex items-center space-x-2 transition-all hover:scale-102 active:scale-98"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          <span>Add New Gadget</span>
        </Link>
      </div>

      {/* Success alert */}
      {deleteSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-400 text-sm font-semibold flex items-center space-x-2.5 justify-center animate-bounce">
          <Check className="h-4 w-4" />
          <span>Listing deleted successfully!</span>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-rose-400 text-sm font-medium flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Database listings list */}
      {loading ? (
        <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center space-y-4">
          <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-400">Syncing spec items...</span>
        </div>
      ) : managedItems.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center border border-white/5 space-y-4 max-w-md mx-auto">
          <span className="text-4xl">📁</span>
          <h3 className="text-white font-bold text-lg">No Listings Found</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            You haven't listed any smart gadgets on NexMart yet. Create one now to start trading!
          </p>
          <Link 
            href="/items/add"
            className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-xl shadow-md"
          >
            Create Your First Listing
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-white/5 bg-[#0e1017]/60 backdrop-blur-md">
            <table className="min-w-full divide-y divide-white/5 text-left text-xs text-slate-300">
              <thead className="bg-[#0b0c13] text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th scope="col" className="px-6 py-4">Item Details</th>
                  <th scope="col" className="px-6 py-4">Category</th>
                  <th scope="col" className="px-6 py-4">Urgency</th>
                  <th scope="col" className="px-6 py-4">Price</th>
                  <th scope="col" className="px-6 py-4">Uploaded Date</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {managedItems.map((item) => {
                  const itemId = item._id || item.id;
                  const isConfirming = confirmDeleteId === itemId;
                  return (
                    <tr key={itemId} className="hover:bg-white/5 transition-colors">
                      {/* Image + Title */}
                      <td className="px-6 py-4 font-medium text-white flex items-center space-x-3.5">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="h-10 w-14 rounded-lg object-cover border border-white/10" 
                        />
                        <div className="max-w-[200px]">
                          <span className="font-bold text-sm block truncate">{item.title}</span>
                          <span className="text-[10px] text-slate-500 flex items-center space-x-1 mt-0.5">
                            <span>📍 {item.location}</span>
                          </span>
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
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isConfirming ? (
                          <div className="flex items-center justify-end space-x-2">
                            <span className="text-[10px] text-rose-400 font-bold mr-1">Confirm delete?</span>
                            <button
                              onClick={() => handleDelete(itemId)}
                              className="px-2.5 py-1 rounded bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-500"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-bold text-[10px] hover:bg-slate-700"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/items/${itemId}`}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link
                              href={`/items/${itemId}/edit`}
                              className="p-2 rounded-lg bg-white/5 hover:bg-amber-500/10 text-slate-400 hover:text-amber-400 transition-colors"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => setConfirmDeleteId(itemId)}
                              className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                            >
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

          {/* MOBILE RESPONSIVE CARD VIEW */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {managedItems.map((item) => {
              const itemId = item._id || item.id;
              const isConfirming = confirmDeleteId === itemId;
              return (
                <div key={itemId} className="glass-card rounded-xl p-5 border border-white/5 space-y-4">
                  <div className="flex items-center space-x-3.5">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="h-12 w-16 rounded-lg object-cover border border-white/10" 
                    />
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
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        item.priority === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end items-center pt-2">
                    {isConfirming ? (
                      <div className="flex items-center space-x-2 w-full justify-between">
                        <span className="text-xxs text-rose-400 font-bold">Confirm deletion?</span>
                        <div className="flex space-x-1.5">
                          <button
                            onClick={() => handleDelete(itemId)}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-3 py-1.5 rounded-lg bg-slate-850 text-slate-300 font-bold text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex space-x-2.5 w-full">
                        <Link
                          href={`/items/${itemId}`}
                          className="w-1/3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold text-center flex items-center justify-center space-x-1 border border-white/10"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Details</span>
                        </Link>
                        <Link
                          href={`/items/${itemId}/edit`}
                          className="w-1/3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 text-amber-400 text-xs font-bold text-center flex items-center justify-center space-x-1"
                        >
                          <Edit3 className="h-4 w-4" />
                          <span>Edit</span>
                        </Link>
                        <button
                          onClick={() => setConfirmDeleteId(itemId)}
                          className="w-1/3 py-2 rounded-lg bg-rose-600/10 border border-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white text-xs font-bold transition-all flex items-center justify-center space-x-1"
                        >
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
        </div>
      )}
    </div>
  );
}
