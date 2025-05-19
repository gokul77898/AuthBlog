
"use client";

import type { User } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

// Dummy users for demo
const dummyUsers: User[] = [
  { id: '1', username: 'editor', name: 'Eddie Tor', role: 'editor', password: 'password' },
  { id: '2', username: 'admin', name: 'Adam Min', role: 'admin', password: 'password' },
  { id: '3', username: 'user', name: 'Jane Doe', role: 'user', password: 'password' },
];

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password?: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password?: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    const user = dummyUsers.find(u => u.username === username && (password ? u.password === password : true));
    
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userToStore } = user; // Exclude password from stored object
      setCurrentUser(userToStore);
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      setLoading(false);
      toast({ title: "Login Successful", description: `Welcome back, ${userToStore.name}!` });
      
      const redirectPath = new URLSearchParams(window.location.search).get('redirect');
      if (redirectPath) {
        router.push(redirectPath);
      } else {
        router.push('/');
      }
      return true;
    }
    
    setLoading(false);
    toast({ title: "Login Failed", description: "Invalid username or password.", variant: "destructive" });
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
