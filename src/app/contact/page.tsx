'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulate API dispatch
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow flex flex-col space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-white tracking-tight">Contact Our Support Team</h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Need help with your listings, accounts, or payment options? Drop us a line and our technical agents will reply within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-6">
            <h2 className="text-white font-bold text-lg border-b border-white/5 pb-4">
              Support Center Coordinates
            </h2>
            
            <ul className="space-y-6 text-xs text-slate-300">
              <li className="flex items-start space-x-4">
                <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="font-bold text-white block">Physical Location</span>
                  <span className="text-slate-400 block mt-1 leading-relaxed">
                    100 Technology Plaza, Floor 12, San Francisco, CA 94107
                  </span>
                </div>
              </li>

              <li className="flex items-start space-x-4">
                <div className="h-9 w-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="font-bold text-white block">Hotline Number</span>
                  <span className="text-slate-400 block mt-1 leading-relaxed">
                    +1 (800) 555-TECH (Monday - Friday, 9am - 6pm PST)
                  </span>
                </div>
              </li>

              <li className="flex items-start space-x-4">
                <div className="h-9 w-9 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="font-bold text-white block">Email Dispatch</span>
                  <a href="mailto:support@nexmart.com" className="text-indigo-400 font-bold block mt-1 hover:underline">
                    support@nexmart.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 border border-white/5 space-y-5">
            <h2 className="text-white font-bold text-lg border-b border-white/5 pb-4">
              Send Support Ticket
            </h2>

            {/* Feedbacks */}
            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-semibold flex items-center space-x-2 justify-center animate-pulse">
                <Check className="h-4 w-4" />
                <span>Message dispatched successfully! We will contact you soon.</span>
              </div>
            )}

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-medium flex items-center space-x-2">
                <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/60 rounded-xl border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/60 rounded-xl border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500/60"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Ticket Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Inquiry about iPhone 15 listing"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950/60 rounded-xl border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500/60"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Support Message</label>
              <textarea
                required
                rows={5}
                placeholder="Enter detailed context regarding your support inquiry..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950/60 rounded-xl border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500/60"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white gradient-bg hover:shadow-lg hover:shadow-indigo-500/20 active:scale-98 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Dispatching...</span>
                </span>
              ) : (
                <>
                  <span>Dispatch Support Ticket</span>
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
