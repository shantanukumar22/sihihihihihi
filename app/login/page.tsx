'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api';
import { useSession } from '@/lib/session';
import { IUser } from '@/models/User';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, login, isLoading: sessionLoading } = useSession();

  // Redirect if already authenticated
  useEffect(() => {
    if (!sessionLoading && user) {
      if (user.profileComplete) {
        router.replace('/dashboard');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [user, sessionLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await ApiClient.login({
        email: formData.email,
        password: formData.password
      });

      if (response.success && response.user) {
        const userData = response.user as IUser;
        login({
          id: userData._id?.toString() || '',
          email: userData.email,
          officialName: userData.officialName,
          profileComplete: userData.profileComplete,
          phoneNumber: userData.phoneNumber,
          digilockerVerified: userData.digilockerVerified,
          digilockerVerificationCode: userData.digilockerVerificationCode,
          digilockerVerifiedAt: userData.digilockerVerifiedAt
        });
        // Redirect immediately after login
        if (userData.profileComplete) {
          router.replace('/dashboard');
        } else {
          router.replace('/dashboard');
        }
      } else {
        setErrors({ general: response.error || 'Login failed' });
      }
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while session is being checked


  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">SW</span>
            </div>
            <span className="text-3xl font-bold text-slate-900">SecureWipe</span>
          </Link>
        </div>

        {/* Login Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-600">Sign in to your SecureWipe account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-800 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-400 ${
                  errors.email ? 'border-red-400 bg-red-50 focus:ring-red-500' : 'border-slate-300 hover:border-slate-400 bg-white'
                }`}
                placeholder="Enter your email address"
                required
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-800 mb-2">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-400 ${
                  errors.password ? 'border-red-400 bg-red-50 focus:ring-red-500' : 'border-slate-300 hover:border-slate-400 bg-white'
                }`}
                placeholder="Enter your password"
                required
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500 focus:ring-2" />
                <span className="ml-2 text-sm text-slate-700 font-medium">Remember me</span>
              </label>
              <Link href="#" className="text-sm text-slate-600 hover:text-slate-700 font-semibold transition-colors duration-200">
                Forgot password?
              </Link>
            </div>

            {errors.general && (
              <div className="bg-red-50 border border-red-300 rounded-xl p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700 font-medium">{errors.general}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 transform ${
                isLoading 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-slate-600 hover:text-slate-700 font-bold transition-colors duration-200">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}