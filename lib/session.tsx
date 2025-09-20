'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from './api';

interface User {
  id: string;
  email: string;
  officialName: string;
  profileComplete: boolean;
  phoneNumber?: string;
  digilockerVerified?: boolean;
  digilockerVerificationCode?: string;
  digilockerVerifiedAt?: Date;
}

interface SessionContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await ApiClient.getCurrentUser();
        if (response.success && response.user) {
          setUser(response.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsLoading(false);
  };

  const logout = async () => {
    try {
      await ApiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      router.push('/');
    }
  };

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const response = await ApiClient.getCurrentUser();
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Refresh user failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SessionContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}