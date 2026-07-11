// 'use client';

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { useAuth } from '../../context/AuthContext';
// import { authClient } from '../../lib/auth-client';
// import { ShoppingBag, Mail, Lock, AlertCircle, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';

// export default function LoginPage() {
//   const { login, demoLogin } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       await login(email, password);
//     } catch (err: any) {
//       setError(err.message || 'Login failed. Please check your credentials.');
//       setLoading(false);
//     }
//   };

//   const handleDemoLogin = async (role: 'user' | 'admin') => {
//     setError(null);
//     setLoading(true);
//     try {
//       await demoLogin(role);
//     } catch (err: any) {
//       setError(err.message || 'Demo login failed.');
//       setLoading(false);
//     }
//   };

//   const handleSocialLogin = async (provider: 'google' | 'facebook') => {
//     setError(null);
//     setLoading(true);
//     try {
//       await authClient.signIn.social({
//         provider,
//         callbackURL: '/'
//       });
//     } catch (err: any) {
//       setError(err.message || `Social login with ${provider} failed.`);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
//       {/* Background radial glow */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>

//       <div className="max-w-md w-full space-y-8 glass-card rounded-2xl p-8 border border-white/10 shadow-2xl">
//         {/* Brand Header */}
//         <div className="text-center space-y-2">
//           <Link href="/" className="inline-flex items-center space-x-2 group">
//             <div className="gradient-bg p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
//               <ShoppingBag className="h-6 w-6" />
//             </div>
//             <span className="text-2xl font-black bg-gradient-to-r from-white via-indigo-100 to-cyan-100 bg-clip-text text-transparent">
//               Nex<span className="text-indigo-400 font-extrabold">Mart</span>
//             </span>
//           </Link>
//           <h2 className="text-xl font-bold text-white tracking-tight pt-2">
//             Welcome Back to NexMart
//           </h2>
//           <p className="text-xs text-slate-400">
//             Sign in to access your dashboard and manage listings
//           </p>
//         </div>

//         {/* Validation Errors */}
//         {error && (
//           <div className="flex items-center space-x-2 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs">
//             <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
//             <span className="font-medium">{error}</span>
//           </div>
//         )}

//         {/* Credentials Form */}
//         <form className="space-y-4" onSubmit={handleSubmit}>
//           <div className="space-y-1">
//             <label className="text-xs font-semibold text-slate-300">Email Address</label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
//               <input
//                 type="email"
//                 required
//                 placeholder="you@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full pl-9.5 pr-4 py-2.5 bg-slate-950/60 rounded-xl border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/60 transition-colors"
//               />
//             </div>
//           </div>

//           <div className="space-y-1">
//             <div className="flex justify-between items-center">
//               <label className="text-xs font-semibold text-slate-300">Password</label>
//             </div>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
//               <input
//                 type="password"
//                 required
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full pl-9.5 pr-4 py-2.5 bg-slate-950/60 rounded-xl border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/60 transition-colors"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white gradient-bg hover:shadow-lg hover:shadow-indigo-500/20 active:scale-98 transition-all hover:scale-102 flex items-center justify-center space-x-2 disabled:opacity-50"
//           >
//             {loading ? (
//               <span className="flex items-center space-x-2">
//                 <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                 <span>Signing In...</span>
//               </span>
//             ) : (
//               <>
//                 <span>Sign In</span>
//                 <ArrowRight className="h-4 w-4" />
//               </>
//             )}
//           </button>
//         </form>

//         {/* Social Login Buttons */}
//         <div className="space-y-3 pt-4 border-t border-white/5">
//           <div className="text-center">
//             <span className="text-xxs uppercase tracking-wider text-slate-400 font-bold bg-slate-900/60 px-2 py-0.5 rounded border border-white/5">
//               Social Login
//             </span>
//           </div>
//           <div className="grid grid-cols-2 gap-3">
//             <button
//               type="button"
//               onClick={() => handleSocialLogin('google')}
//               disabled={loading}
//               className="flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-indigo-500/30 hover:text-white transition-all disabled:opacity-50"
//             >
//               <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
//                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
//                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
//                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
//               </svg>
//               <span>Google</span>
//             </button>
//             <button
//               type="button"
//               onClick={() => handleSocialLogin('facebook')}
//               disabled={loading}
//               className="flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-indigo-500/30 hover:text-white transition-all disabled:opacity-50"
//             >
//               <svg className="h-3.5 w-3.5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
//               </svg>
//               <span>Facebook</span>
//             </button>
//           </div>
//         </div>

//         {/* Footer Link */}
//         <div className="text-center text-xs text-slate-400 pt-2">
//           Don't have an account?{' '}
//           <Link href="/register" className="text-indigo-400 font-semibold hover:underline">
//             Sign up for free
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { authClient } from '../../lib/auth-client';
import { ShoppingBag, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();

  // Independent loading states
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Using FormData for uncontrolled inputs
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    setIsLoggingIn(true);

    try {
      await login(email, password);
      formRef.current?.reset();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setIsLoggingIn(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setError(null);
    setSocialLoading(provider);

    try {
      const { error: resError } = await authClient.signIn.social({
        provider,
        callbackURL: '/'
      });
      if (resError) {
        setError(resError.message || `Social login with ${provider} failed.`);
      }
    } catch (err: any) {
      setError(err.message || `Social login with ${provider} failed.`);
    } finally {
      setSocialLoading(null);
    }
  };

  const isAnyLoading = isLoggingIn || socialLoading !== null;

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
        <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
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
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-9.5 pr-4 py-2.5 bg-slate-950/60 rounded-xl border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/60 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isAnyLoading}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white gradient-bg hover:shadow-lg hover:shadow-indigo-500/20 active:scale-98 transition-all hover:scale-102 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoggingIn ? (
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

{/* Social Login Buttons */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <div className="text-center">
            <span className="text-xxs uppercase tracking-wider text-slate-400 font-bold bg-slate-900/60 px-2 py-0.5 rounded border border-white/5">
              Social Login
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={isAnyLoading}
              className="flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-indigo-500/30 hover:text-white transition-all disabled:opacity-50"
            >
              {socialLoading === 'google' ? (
                <span className="h-3.5 w-3.5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
              )}
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              disabled={isAnyLoading}
              className="flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-indigo-500/30 hover:text-white transition-all disabled:opacity-50"
            >
              {socialLoading === 'facebook' ? (
                <span className="h-3.5 w-3.5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <svg className="h-3.5 w-3.5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
                </svg>
              )}
              <span>Facebook</span>
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