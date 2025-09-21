'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api';

interface DocumentsResponse {
  aadhaarFileId?: string;
  panFileId?: string;
  documents?: unknown;
}

interface DownloadResponse {
  aadhaar?: unknown;
  pan?: unknown;
}

export default function ClosePage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your verification...');
  const [verificationData, setVerificationData] = useState<{
    aadhaar: unknown;
    pan: unknown;
    documents: unknown;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const processVerification = async () => {
      try {
        // Get documents from DigiLocker
        const documentsResponse = await ApiClient.getDigiLockerDocuments();
        
        if (documentsResponse.success && (documentsResponse.data as DocumentsResponse)?.aadhaarFileId && (documentsResponse.data as DocumentsResponse)?.panFileId) {
          // Download documents
          const downloadResponse = await ApiClient.downloadDigiLockerDocuments({
            aadhaarFileId: (documentsResponse.data as DocumentsResponse).aadhaarFileId!,
            panFileId: (documentsResponse.data as DocumentsResponse).panFileId!
          });

          if (downloadResponse.success) {
            setStatus('success');
            setMessage('Verification completed successfully!');
            setVerificationData({
              aadhaar: (downloadResponse.data as DownloadResponse)?.aadhaar,
              pan: (downloadResponse.data as DownloadResponse)?.pan,
              documents: (documentsResponse.data as DocumentsResponse)?.documents
            });
          } else {
            setStatus('error');
            setMessage(downloadResponse.message || 'Failed to download documents');
          }
        } else {
          setStatus('error');
          setMessage(documentsResponse.message || 'Required documents not found in DigiLocker');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('An error occurred during verification. Please try again.');
      }
    };

    processVerification();
  }, []);

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">CW</span>
            </div>
            <span className="text-3xl font-bold text-slate-900">SecureWipe</span>
          </Link>
        </div>

        {/* Status Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="text-center">
            {status === 'loading' && (
              <>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Processing Verification</h1>
                <p className="text-slate-600">{message}</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Verification Successful!</h1>
                <p className="text-slate-600 mb-6">{message}</p>
                
                {verificationData && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-4">Documents Retrieved</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="text-green-800">Aadhar Card - Ready for download</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="text-green-800">PAN Card - Ready for download</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleGoToDashboard}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Go to Dashboard
                </button>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Verification Failed</h1>
                <p className="text-slate-600 mb-6">{message}</p>
                
                <div className="space-y-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-slate-600 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleGoToDashboard}
                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors ml-4"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}