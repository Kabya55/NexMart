'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, Mail, Lock, AlertCircle, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'user' | 'admin') => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin(role);
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-md w-full space-y-8 glass-card rounded-2xl p-8 border border-white/10 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2 group">
            <div className="gradient-bg p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-white via-indigo-100 to-cyan-100 bg-clip-text text-transparent">
              Nex<span className="text-indigo-400 font-extrabold">Mart</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-white tracking-tight pt-2">
            Welcome Back to NexMart
          </h2>
          <p className="text-xs text-slate-400">
            Sign in to access your dashboard and manage listings
          </p>
        </div>

        {/* Validation Errors */}
        {error && (
          <div className="flex items-center space-x-2 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs">
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9.5 pr-4 py-2.5 bg-slate-950/60 rounded-xl border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/60 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9.5 pr-4 py-2.5 bg-slate-950/60 rounded-xl border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/60 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white gradient-bg hover:shadow-lg hover:shadow-indigo-500/20 active:scale-98 transition-all hover:scale-102 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Signing In...</span>
              </span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login Buttons */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <div className="text-center">
            <span className="text-xxs uppercase tracking-wider text-slate-400 font-bold bg-slate-900/60 px-2 py-0.5 rounded border border-white/5">
              Demo Fast Pass
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDemoLogin('user')}
              disabled={loading}
              className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-indigo-300 hover:bg-white/10 hover:border-indigo-500/30 hover:text-white transition-all disabled:opacity-50"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Standard User</span>
            </button>
            <button
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
              className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-cyan-300 hover:bg-white/10 hover:border-cyan-500/30 hover:text-white transition-all disabled:opacity-50"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Admin User</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-400 pt-2">
          Don't have an account?{' '}
          <Link href="/register" className="text-indigo-400 font-semibold hover:underline">
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
}
