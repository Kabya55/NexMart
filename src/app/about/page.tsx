import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Laptop, ShieldCheck, Compass, Heart, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow flex flex-col space-y-16">
      {/* Intro Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <ShoppingBag className="h-3 w-3" />
          <span>Our Tech Vision</span>
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          Connecting Hardware Enthusiasts Securely
        </h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          NexMart is a next-generation electronic listing marketplace designed to make finding, buying, and selling premium consumer gadgets transparent, fluid, and secure.
        </p>
      </div>

      {/* Grid of Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="h-10 w-10 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-white font-bold text-base">Verified Spec Sheet</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            We require listings to define precise conditions, priorities, locations, and technical descriptions, helping buyers understand what they are getting.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="h-10 w-10 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl flex items-center justify-center">
            <Compass className="h-5 w-5" />
          </div>
          <h3 className="text-white font-bold text-base">Transparent Listings</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            All listing listings contain the direct contact information of the uploading seller. No hidden commissions or broker fees.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="h-10 w-10 bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-xl flex items-center justify-center">
            <Laptop className="h-5 w-5" />
          </div>
          <h3 className="text-white font-bold text-base">Community Driven</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Designed specifically for creators, builders, gamers, and software developers who want reliable tech without retail markups.
          </p>
        </div>
      </div>

      {/* Story panel */}
      <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-2xl font-black text-white">How NexMart Started</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Founded in 2026, NexMart was born out of frustration with mainstream secondary retail platforms. Standard websites were flooded with spam, lacked proper hardware verification tools, and made filter sorting difficult.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              We set out to build a platform that matches specifications with verified buyer inquiries. By utilizing a dual-mode database stack and state of the art UI elements, we provide a premium catalog search experience that works.
            </p>
          </div>
          <div className="lg:col-span-5 flex justify-center">
            <div className="h-44 w-44 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-center justify-center space-y-2 text-indigo-400 font-bold">
              <span className="text-4xl">🚀</span>
              <span className="text-xs uppercase tracking-wider">Est. 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center space-y-4">
        <h2 className="text-white font-bold text-lg">Ready to browse our tech catalog?</h2>
        <Link 
          href="/explore" 
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-white gradient-bg hover:shadow-lg hover:shadow-indigo-500/20 transition-all hover:scale-102"
        >
          <span>Open Explore Catalog</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
