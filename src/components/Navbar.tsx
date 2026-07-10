'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Menu, X, LogOut, User, PlusCircle, Settings, Info, Compass, MessageSquare } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  // Base routes always visible
  const publicLinks = [
    { label: 'Home', href: '/', icon: ShoppingBag },
    { label: 'Explore', href: '/explore', icon: Compass },
    { label: 'About', href: '/about', icon: Info },
    { label: 'Contact', href: '/contact', icon: MessageSquare },
  ];

  // Additional routes visible only when logged in
  const privateLinks = user?.role === 'admin'
    ? [
        { label: 'Add Item', href: '/items/add', icon: PlusCircle },
        { label: 'Dashboard', href: '/dashboard', icon: Settings },
      ]
    : [
        { label: 'Dashboard', href: '/dashboard', icon: Settings },
      ];

  const allLinks = user ? [...publicLinks.slice(0, 2), ...privateLinks, ...publicLinks.slice(2)] : publicLinks;

  return (
    <nav className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="gradient-bg p-2 rounded-lg text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text text-transparent tracking-tight">
                Nex<span className="text-indigo-400 font-extrabold">Mart</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {allLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm shadow-indigo-500/5'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Side (Auth) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4 border-l border-white/10 pl-4">
                <div className="flex flex-col text-right">
                  <span className="text-sm font-semibold text-white">{user.name}</span>
                  <span className="text-xxs uppercase tracking-wider text-cyan-400 font-bold bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/30">
                    {user.role}
                  </span>
                </div>
                <div className="h-9 w-9 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:text-white hover:bg-rose-500/20 transition-all duration-200 border border-transparent hover:border-rose-500/20"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 pl-4 border-l border-white/10">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="gradient-bg hover:shadow-lg hover:shadow-indigo-500/25 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none transition-all"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav border-t border-white/5 shadow-2xl">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {allLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    active
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/15'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Mobile Auth Sections */}
            {user ? (
              <div className="pt-4 mt-4 border-t border-white/5 px-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-base font-medium text-white">{user.name}</div>
                    <div className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-base font-medium text-rose-400 hover:text-white bg-rose-500/10 border border-rose-500/15 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="pt-4 mt-4 border-t border-white/5 px-4 flex flex-col space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all border border-white/5"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center gradient-bg text-white py-2.5 rounded-lg text-base font-semibold shadow-md shadow-indigo-500/10 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
