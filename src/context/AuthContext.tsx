'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authClient } from '../lib/auth-client';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  demoLogin: (role: 'user' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load current user profile from Better Auth session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await authClient.getSession();
        if (data?.user) {
          setUser({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: (data.user as any).role || 'user'
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });
      
      if (error) {
        throw new Error(error.message || 'Login failed');
      }

      if (data?.user) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: (data.user as any).role || 'user'
        });
        router.push('/');
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
    setLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        throw new Error(error.message || 'Registration failed');
      }

      if (data?.user) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: (data.user as any).role || 'user'
        });
        router.push('/');
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authClient.signOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setLoading(false);
  };

  const demoLogin = async (role: 'user' | 'admin') => {
    const email = role === 'admin' ? 'admin@nexmart.com' : 'john@nexmart.com';
    const password = 'password123';
    await login(email, password);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
