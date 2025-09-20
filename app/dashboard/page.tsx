'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api';
import { useSession } from '@/lib/session';

// Aadhar Verification Form Component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AadharVerificationForm({ 
  step, 
  onRequestOTP, 
  onSubmitOTP, 
  onInitializeDigiLocker, 
  isVerifying 
}: { 
  step: 'otp-request' | 'otp-submit' | 'digilocker' | 'completed';
  onRequestOTP: (aadharNumber: string) => void;
  onSubmitOTP: (otp: string) => void;
  onInitializeDigiLocker: () => void;
  isVerifying: boolean;
}) {
  const [aadharNumber, setAadharNumber] = useState('');
  const [otp, setOtp] = useState('');

  const handleRequestOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadharNumber) {
      onRequestOTP(aadharNumber);
    }
  };

  const handleSubmitOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp) {
      onSubmitOTP(otp);
    }
  };

  const handleInitializeDigiLocker = (e: React.FormEvent) => {
    e.preventDefault();
    onInitializeDigiLocker();
  };

  if (step === 'otp-request') {
    return (
      <form onSubmit={handleRequestOTP} className="space-y-4">
        <div>
          <label htmlFor="aadharNumber" className="block text-sm font-medium text-slate-700 mb-2">
            Aadhar Number
          </label>
          <input
            type="text"
            id="aadharNumber"
            value={aadharNumber}
            onChange={(e) => setAadharNumber(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter 12-digit Aadhar number"
            maxLength={12}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isVerifying || !aadharNumber}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
            isVerifying || !aadharNumber
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isVerifying ? 'Sending OTP...' : 'Send OTP'}
        </button>
      </form>
    );
  }

  if (step === 'otp-submit') {
    return (
      <form onSubmit={handleSubmitOTP} className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800">
            OTP has been sent to the mobile number registered with Aadhar: {aadharNumber}
          </p>
        </div>

        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-2">
            Enter OTP
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isVerifying || !otp}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
            isVerifying || !otp
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isVerifying ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
    );
  }

  if (step === 'digilocker') {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-green-800 font-medium">Aadhar verification successful!</p>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Access DigiLocker</h3>
          <p className="text-slate-600 mb-6">
            Now you can access your Aadhar card through DigiLocker for secure verification.
          </p>

          <button
            onClick={handleInitializeDigiLocker}
            disabled={isVerifying}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
              isVerifying
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isVerifying ? 'Opening DigiLocker...' : 'Open DigiLocker'}
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [generatedVerificationCode, setGeneratedVerificationCode] = useState<string>('');
  // const [isVerifying, setIsVerifying] = useState(false);
  // const [verificationStep, setVerificationStep] = useState<'otp-request' | 'otp-submit' | 'digilocker' | 'completed'>('otp-request');
  // const [verificationCode, setVerificationCode] = useState<string>('');
  const router = useRouter();
  const { user, logout, isLoading, refreshUser } = useSession();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    } else if (user && !user.profileComplete) {
      router.replace('/profile-setup');
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    await logout();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleInitializeDigiLocker = async () => {
    if (!user) return;
    
    // setIsVerifying(true);
    try {
      const response = await ApiClient.initializeDigiLocker({
        fullName: user.officialName,
        email: user.email,
        mobileNumber: user.phoneNumber || ''
      });
      
      if (response.success && (response.data as { url?: string })?.url) {
        // Redirect to DigiLocker
        window.open((response.data as { url: string }).url, '_blank');
        // setVerificationStep('completed');
        const generatedCode = `CW-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        // setVerificationCode(generatedCode);
        setGeneratedVerificationCode(generatedCode);
        
        // Save the verification code to the database
        try {
          console.log('🔍 Saving verification code:', generatedCode);
          console.log('🔍 User ID:', user?.id);
          console.log('🔍 User email:', user?.email);
          
          const saveResponse = await ApiClient.saveDigiLockerVerification(generatedCode);
          console.log('🔍 Save response:', saveResponse);
          
          if (saveResponse.success) {
            console.log('✅ Verification code saved successfully');
            // Refresh user data to get updated verification status
            await refreshUser();
            console.log('✅ User data refreshed');
            alert('✅ Verification saved successfully!');
          } else {
            console.error('❌ Failed to save verification code:', saveResponse.message);
            alert('❌ Failed to save verification code: ' + saveResponse.message);
          }
        } catch (error) {
          console.error('❌ Failed to save verification code:', error);
          console.error('❌ Error details:', error);
          alert('❌ Failed to save verification code. Check console for details.');
        }
      } else {
        alert(response.message || 'Failed to initialize DigiLocker');
      }
    } catch {
      alert('Failed to initialize DigiLocker. Please try again.');
    } finally {
      // setIsVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Verification Status</p>
              <p className={`text-lg font-bold ${user?.digilockerVerified ? 'text-green-600' : 'text-orange-600'}`}>
                {user?.digilockerVerified ? 'Verified' : 'Pending'}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              user?.digilockerVerified ? 'bg-green-100' : 'bg-orange-100'
            }`}>
              <svg className={`w-6 h-6 ${user?.digilockerVerified ? 'text-green-600' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Devices Processed</p>
              <p className="text-3xl font-bold text-slate-900">0</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Certificates Generated</p>
              <p className="text-3xl font-bold text-slate-900">0</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Data Wiped (GB)</p>
              <p className="text-3xl font-bold text-slate-900">0</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-slate-900">Start New Wipe</p>
                <p className="text-sm text-slate-600">Begin secure data erasure process</p>
              </div>
            </div>
          </button>

          <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-slate-900">View Certificates</p>
                <p className="text-sm text-slate-600">Access wipe certificates</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderDevices = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">Your Devices</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add Device
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-slate-900 mb-2">No devices found</h4>
          <p className="text-slate-600 mb-6">Start by adding your first device for secure data erasure</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Add Your First Device
          </button>
        </div>
      </div>
    </div>
  );

  const renderAadharVerification = () => {
    const isVerified = user?.digilockerVerified || false;
    console.log('User data in renderAadharVerification:', user);
    console.log('Is verified:', isVerified);
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900">Aadhar Card Verification</h3>
          <div className="flex gap-2">
            <button
              onClick={refreshUser}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={async () => {
                if (!user?.id) return;
                try {
                  const response = await fetch('/api/test/save-verification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      userId: user.id,
                      verificationCode: 'CW-1758326706289-GK5CU8T19'
                    })
                  });
                  const result = await response.json();
                  console.log('Manual save result:', result);
                  if (result.success) {
                    alert('Verification saved successfully!');
                    await refreshUser();
                  } else {
                    alert('Failed to save: ' + result.message);
                  }
                } catch (error) {
                  console.error('Manual save error:', error);
                  alert('Error saving verification');
                }
              }}
              className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
            >
              Save Test Code
            </button>
            {generatedVerificationCode && !user?.digilockerVerified && (
              <button
                onClick={async () => {
                  if (!user?.id) return;
                  try {
                    const response = await fetch('/api/test/save-verification', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        userId: user.id,
                        verificationCode: generatedVerificationCode
                      })
                    });
                    const result = await response.json();
                    console.log('Fallback save result:', result);
                    if (result.success) {
                      alert('✅ Verification saved successfully!');
                      await refreshUser();
                      setGeneratedVerificationCode('');
                    } else {
                      alert('❌ Failed to save: ' + result.message);
                    }
                  } catch (error) {
                    console.error('Fallback save error:', error);
                    alert('❌ Error saving verification');
                  }
                }}
                className="px-3 py-1 text-sm bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
              >
                Save Generated Code
              </button>
            )}
          </div>
        </div>
        
        {isVerified ? (
          // Verified State
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">Verification Complete!</h4>
              <p className="text-slate-600 mb-6">
                Your Aadhar card has been successfully verified through DigiLocker.
              </p>
              
              {user?.digilockerVerificationCode && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h5 className="font-semibold text-green-900 mb-2">Verification Code:</h5>
                  <p className="text-green-800 font-mono text-lg">{user.digilockerVerificationCode}</p>
                  <p className="text-sm text-green-700 mt-2">
                    Verified on: {user.digilockerVerifiedAt ? new Date(user.digilockerVerifiedAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <h5 className="font-semibold text-slate-900 mb-2">What&apos;s next:</h5>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• You can now proceed with device data wiping</li>
                <li>• Your verification certificate will be generated</li>
                <li>• All documents are securely stored in DigiLocker</li>
              </ul>
            </div>
          </div>
        ) : (
          // Not Verified State
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">Verify Your Aadhar Card</h4>
              <p className="text-slate-600 mb-6">
                Complete Aadhar verification using your phone number and OTP, then access DigiLocker to retrieve your documents securely.
              </p>
              
              <Link 
                href="/aadhar-verification"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Aadhar Verification
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <h5 className="font-semibold text-slate-900 mb-2">What you&apos;ll need:</h5>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Your registered phone number</li>
                <li>• Access to receive SMS OTP</li>
                <li>• DigiLocker account (we&apos;ll help you set it up)</li>
                <li>• Aadhar and PAN documents in DigiLocker</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900">Account Settings</h3>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
            <input 
              type="text" 
              value={user?.officialName || ''} 
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input 
              type="email" 
              value={user?.email || ''} 
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
            <input 
              type="tel" 
              value={user?.phoneNumber || ''} 
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h4>
        <p className="text-red-800 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CW</span>
                </div>
                <span className="text-xl font-semibold text-slate-900">CleanWipe</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{user?.officialName}</p>
                <p className="text-sm text-slate-600">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 min-h-screen">
          <nav className="p-6">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'overview' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    </svg>
                    <span>Overview</span>
                  </div>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('devices')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'devices' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    <span>Devices</span>
                  </div>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('verification')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'verification' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Aadhar Verification</span>
                  </div>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'settings' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Settings</span>
                  </div>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'devices' && renderDevices()}
          {activeTab === 'verification' && renderAadharVerification()}
          {activeTab === 'settings' && renderSettings()}
        </main>
      </div>
    </div>
)};