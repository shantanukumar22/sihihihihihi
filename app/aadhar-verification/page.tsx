'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/session';
import { ApiClient } from '@/lib/api';
import { 
  Smartphone, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Loader
} from 'lucide-react';


interface DigiLockerData {
  client_id: string;
  url: string;
  token: string;
  expiry: string;
}

const AadharVerificationPage = () => {
  const router = useRouter();
  const { user, isLoading: sessionLoading } = useSession();
  const [currentStep, setCurrentStep] = useState<'phone' | 'digilocker' | 'success'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [digiLockerData, setDigiLockerData] = useState<DigiLockerData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push('/login');
    }
  }, [user, sessionLoading, router]);

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    // Validate phone number format (10 digits)
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Initialize DigiLocker with phone number
      const response = await ApiClient.initializeDigiLocker({
        fullName: user?.officialName || '',
        email: user?.email || '',
        mobileNumber: phoneNumber
      });

      if (response.success && response.data) {
        setDigiLockerData(response.data as DigiLockerData);
        setCurrentStep('digilocker');
      } else {
        setError(response.error || 'Failed to initialize DigiLocker');
      }
    } catch {
      setError('Failed to initialize DigiLocker. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDigiLockerInit = async () => {
    if (!digiLockerData) return;

    // Open DigiLocker in new tab
    window.open(digiLockerData.url, '_blank');
    setCurrentStep('success');
    const generatedCode = `CW-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setVerificationCode(generatedCode);
    
    // Automatically save the verification code to database
    try {
      console.log('🔍 Auto-saving verification code:', generatedCode);
      const response = await fetch('/api/test/save-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          verificationCode: generatedCode
        })
      });
      const result = await response.json();
      console.log('🔍 Auto-save result:', result);
      if (result.success) {
        console.log('✅ Verification code auto-saved successfully');
      } else {
        console.error('❌ Auto-save failed:', result.message);
      }
    } catch (error) {
      console.error('❌ Auto-save error:', error);
    }
  };

  const renderPhoneStep = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Phone Verification</h1>
        <p className="text-slate-600">Enter your phone number to access DigiLocker for document verification</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <form onSubmit={handlePhoneSubmit} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border-slate-300 hover:border-slate-400"
              placeholder="Enter your 10-digit phone number"
              maxLength={10}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 ${
              isLoading 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                Initializing DigiLocker...
              </div>
            ) : (
              'Access DigiLocker'
            )}
          </button>
        </form>
      </div>
    </div>
  );


  const renderDigiLockerStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ExternalLink className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">DigiLocker Ready!</h1>
        <p className="text-slate-600">Click below to open DigiLocker and authorize access to your documents</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center space-y-4">
          <p className="text-slate-600">
            DigiLocker has been initialized for your phone number. You can now access your documents securely.
          </p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleDigiLockerInit}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 ${
              isLoading 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                Opening DigiLocker...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Open DigiLocker
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Verification Complete!</h1>
        <p className="text-slate-600">DigiLocker has been successfully connected and your documents are accessible</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center space-y-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">Verification Code</h3>
            <p className="text-2xl font-mono text-green-800">{verificationCode}</p>
            <p className="text-sm text-green-600 mt-1">Save this code for your records</p>
            <button
              onClick={async () => {
                if (!verificationCode) return;
                try {
                  console.log('🔍 Saving verification code from success page:', verificationCode);
                  const response = await fetch('/api/test/save-verification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      userId: user?.id,
                      verificationCode: verificationCode
                    })
                  });
                  const result = await response.json();
                  console.log('🔍 Save result:', result);
                  if (result.success) {
                    alert('✅ Verification code saved successfully!');
                  } else {
                    alert('❌ Failed to save: ' + result.message);
                  }
                } catch (error) {
                  console.error('❌ Save error:', error);
                  alert('❌ Error saving verification code');
                }
              }}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Save to Database
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-slate-600">
              You can now access your documents through DigiLocker. The verification process is complete.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => setCurrentStep('phone')}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all duration-200"
              >
                Verify Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {currentStep === 'phone' && renderPhoneStep()}
        {currentStep === 'digilocker' && renderDigiLockerStep()}
        {currentStep === 'success' && renderSuccessStep()}
      </div>
    </div>
  );
};

export default AadharVerificationPage;
