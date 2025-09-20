'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api';
import { useSession } from '@/lib/session';
import { 
  Shield, 
  HardDrive, 
  FileText, 
  Trash2, 
  Settings, 
  User, 
  LogOut, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Sparkles,
  BarChart3,
  Smartphone,
  Laptop,
  Monitor,
  Zap,
  Lock,
  Download,
  Eye,
  RefreshCw
} from 'lucide-react';
import Button from '@/app/components/ui/Button';
import Card, { CardContent, CardHeader } from '@/app/components/ui/Card';
import StatsCard from '@/app/components/ui/StatsCard';
import ThemeToggle from '@/app/components/ui/ThemeToggle';

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
      router.replace('/dashboard');
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="text-center animate-fade-in-up">
          <div className="w-12 h-12 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="animate-fade-in-up">
        <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white shadow-xl">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.officialName?.split(' ')[0]}!</h2>
                <p className="text-blue-100 dark:text-blue-200">Ready to secure your devices with professional data erasure?</p>
              </div>
              <div className="w-16 h-16 bg-white/20 dark:bg-white/30 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Verification Status"
          value={user?.digilockerVerified ? 'Verified' : 'Pending'}
          icon={<CheckCircle className="w-6 h-6" />}
          color={user?.digilockerVerified ? 'green' : 'orange'}
          delay={0}
        />
        
        <StatsCard
          title="Devices Processed"
          value="0"
          icon={<HardDrive className="w-6 h-6" />}
          color="blue"
          delay={200}
        />
        
        <StatsCard
          title="Certificates Generated"
          value="0"
          icon={<FileText className="w-6 h-6" />}
          color="green"
          delay={400}
        />
        
        <StatsCard
          title="Data Wiped (GB)"
          value="0"
          icon={<Trash2 className="w-6 h-6" />}
          color="purple"
          delay={600}
        />
      </div>

      {/* Quick Actions */}
      <Card className="p-6 animate-fade-in-up bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/20 shadow-xl" style={{ animationDelay: '0.8s' }}>
        <CardHeader>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Quick Actions
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center text-center space-y-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-gray-200 dark:border-gray-600"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Start New Wipe</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">Begin secure data erasure</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center text-center space-y-2 hover:bg-green-50 dark:hover:bg-green-900/20 border-gray-200 dark:border-gray-600"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">View Certificates</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">Access wipe certificates</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center text-center space-y-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-gray-200 dark:border-gray-600"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">View Analytics</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">Track your progress</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center text-center space-y-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 border-gray-200 dark:border-gray-600"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Download Tools</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">Get offline utilities</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDevices = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center animate-fade-in-up">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <HardDrive className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Your Devices
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage and secure your electronic devices</p>
        </div>
        <Button rightIcon={<Plus className="w-4 h-4" />}>
          Add Device
        </Button>
      </div>

      <Card className="p-8 animate-fade-in-up bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/20 shadow-xl" style={{ animationDelay: '0.2s' }}>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HardDrive className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">No devices found</h4>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              Start by adding your first device for secure data erasure. 
              We support Windows, Linux, and Android devices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button rightIcon={<Plus className="w-4 h-4" />}>
                Add Your First Device
              </Button>
              <Button variant="secondary" rightIcon={<Eye className="w-4 h-4" />}>
                View Supported Devices
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Types Preview */}
      <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <Card hover className="p-6 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Laptop className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Windows Devices</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Laptops, desktops, and tablets</p>
          </CardContent>
        </Card>

        <Card hover className="p-6 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Linux Systems</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Servers and workstations</p>
          </CardContent>
        </Card>

        <Card hover className="p-6 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Android Devices</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Phones and tablets</p>
          </CardContent>
        </Card>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 transition-colors duration-300">
      {/* Enhanced Header */}
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">CleanWipe</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle size="sm" />
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.officialName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                leftIcon={<LogOut className="w-4 h-4" />}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Enhanced Sidebar */}
        <aside className="w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-r border-white/20 dark:border-gray-700/20 min-h-screen transition-colors duration-300">
          <nav className="p-6">
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === 'overview' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 text-white shadow-lg' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-5 h-5" />
                    <span className="font-medium">Overview</span>
                  </div>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('devices')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === 'devices' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 text-white shadow-lg' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <HardDrive className="w-5 h-5" />
                    <span className="font-medium">Devices</span>
                  </div>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('verification')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === 'verification' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 text-white shadow-lg' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Aadhar Verification</span>
                  </div>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === 'settings' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 text-white shadow-lg' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                  </div>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Enhanced Main Content */}
        <main className="flex-1 p-8 bg-gray-50/50 dark:bg-gray-900/50 transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'devices' && renderDevices()}
            {activeTab === 'verification' && renderAadharVerification()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </main>
      </div>
    </div>
)};