'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/session';
import { Copy, Check } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading, logout, refreshUser } = useSession();
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  // Refresh user data when page becomes visible (user returns from verification)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        refreshUser();
      }
    };

    const handleFocus = () => {
      if (user) {
        refreshUser();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user, refreshUser]);

  const handleLogout = async () => {
    await logout();
  };

  const handleCopyCode = async () => {
    if (!user?.digilockerVerificationCode) return;
    
    try {
      await navigator.clipboard.writeText(user.digilockerVerificationCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy code:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = user.digilockerVerificationCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">SW</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">SecureWipe</span>
                  <p className="text-xs text-gray-500">Digital India Initiative</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.officialName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex" style={{ height: 'calc(100vh - 80px)' }}>
        {/* Left Side - Text Content (50%) */}
        <div className="w-1/2 flex items-center justify-center px-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Verification</h1>
            
            {user?.digilockerVerified ? (
              // Verified State
              <>
                {user?.digilockerVerificationCode && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2">Verification Code</p>
                    <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                      <p className="text-2xl font-mono font-bold text-gray-900 flex-1">{user.digilockerVerificationCode}</p>
                      <button
                        onClick={handleCopyCode}
                        className={`ml-3 px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                          isCopied 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        title={isCopied ? 'Copied!' : 'Copy code'}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {user?.digilockerVerifiedAt && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2">Verified On</p>
                    <p className="text-lg font-medium text-gray-900">
                      {new Date(user.digilockerVerifiedAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                )}

                <p className="text-xl text-gray-600">Your verification is complete.</p>
              </>
            ) : (
              // Not Verified State
              <>
                <p className="text-xl text-gray-600 mb-8">Complete your Aadhaar verification to proceed.</p>
                
                <Link 
                  href="/aadhar-verification"
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-medium text-lg rounded-lg hover:bg-blue-700 transition-colors duration-200 border border-blue-600"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Aadhaar Verification
                </Link>
                
                <p className="text-sm text-gray-500 mt-4">
                  Secured by DigiLocker • Government of India
                </p>
              </>
            )}
          </div>
        </div>

        {/* Right Side - Aadhaar Image as Background (50%) */}
        <div 
          className="w-1/2 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/aadhar2.png)' }}
        >
        </div>
      </main>
    </div>
  );
}