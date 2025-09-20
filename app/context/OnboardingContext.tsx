'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  streetAddress?: string;
  customerNote?: string;
  city?: string;
  state?: string;
  country?: string;
  emiratesVerified?: boolean;
  passportVerified?: boolean;
  [key: string]: unknown;
}

interface OnboardingContextType {
  userData: UserData;
  errors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setUserData: (data: UserData | ((prev: UserData) => UserData)) => void;
  setErrors: (errors: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <OnboardingContext.Provider value={{
      userData,
      errors,
      handleInputChange,
      setUserData,
      setErrors
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
