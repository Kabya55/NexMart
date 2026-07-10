import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Mail, Phone, MapPin, Globe, Link as LinkIcon, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0b0c13] border-t border-white/5 pt-16 pb-8 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="gradient-bg p-2 rounded-lg text-white shadow-md shadow-indigo-500/10">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text text-transparent">
                Nex<span className="text-indigo-400">Mart</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Experience the future of tech commerce. Discover premium smart gadgets, wearable computers, high-fidelity audio equipment, and custom gaming gear with full specifications and verified reviews.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 hover:scale-110 transition-all duration-200" title="GitHub">
                <Globe className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 hover:scale-110 transition-all duration-200" title="Twitter">
                <LinkIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-indigo-500 pl-3">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                  Home Page
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                  Explore Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-indigo-500 pl-3">
              Tech Categories
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/explore?category=Smartphones" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                  Smartphones
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Laptops" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                  Premium Laptops
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Audio" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                  Audio & Headphones
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Accessories" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                  Computer Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts & Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-indigo-500 pl-3">
              Support Center
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-center space-x-3">
                <MapPin className="h-4.5 w-4.5 text-indigo-400 flex-shrink-0" />
                <span>100 Technology Plaza, San Francisco, CA</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4.5 w-4.5 text-indigo-400 flex-shrink-0" />
                <span>+1 (800) 555-TECH</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4.5 w-4.5 text-indigo-400 flex-shrink-0" />
                <a href="mailto:support@nexmart.com" className="hover:text-white transition-colors">
                  support@nexmart.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <ShieldCheck className="h-4.5 w-4.5 text-cyan-400 flex-shrink-0" />
                <span>Secured SSL Checkout</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; {currentYear} NexMart Inc. All rights reserved. Created for premium tech listings.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/help" className="hover:text-white transition-colors">
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
