'use client';

import Link from "next/link";
import { useSession } from "@/lib/session";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, isLoading } = useSession();
  const router = useRouter();

  const handleGetStarted = () => {
    if (user) {
      if (user.profileComplete) {
        router.push('/dashboard');
      } else {
        router.push('/profile-setup');
      }
    } else {
      router.push('/signup');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CW</span>
            </div>
            <span className="text-xl font-semibold text-slate-900">CleanWipe</span>
          </div>
            <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </Link>
                <button 
                  onClick={handleGetStarted}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </button>
              </>
            ) : (
              <button 
                onClick={handleGetStarted}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Secure Data Erasure for
              <span className="text-blue-600"> Electronic Devices</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Professional, verifiable, and tamper-proof data wiping solutions. 
              Build confidence in device recycling and promote safe e-waste management 
              across India&apos;s growing digital landscape.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleGetStarted}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Secure Wiping
              </button>
              <Link 
                href="#features"
                className="px-8 py-4 border border-slate-300 text-slate-700 rounded-lg text-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                India&apos;s E-Waste Crisis
              </h2>
              <div className="space-y-4 text-slate-600">
                <p className="text-lg">
                  <span className="font-semibold text-red-600">1.75 million tonnes</span> of e-waste generated annually
                </p>
                <p className="text-lg">
                  <span className="font-semibold text-orange-600">₹50,000 crore</span> worth of IT assets hoarded due to data security concerns
                </p>
                <p className="text-lg">
                  Millions of devices remain unused or improperly discarded, hindering circular economy efforts
                </p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">The Core Problem</h3>
              <p className="text-slate-600 leading-relaxed">
                Most users hesitate to recycle their devices due to fear of data breaches. 
                Existing sanitization tools are either too complex, expensive, or lack 
                verifiable proof of erasure, creating a significant barrier to safe disposal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Professional Data Erasure Solutions
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              NIST SP 800-88 compliant, cross-platform secure wiping with tamper-proof certification
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Comprehensive Erasure</h3>
              <p className="text-slate-600">
                Securely erase all user data including hidden storage areas like HPA/DCO and SSD sectors across Windows, Linux, and Android devices.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Tamper-Proof Certificates</h3>
              <p className="text-slate-600">
                Generate digitally signed wipe certificates in PDF and JSON formats with third-party verification capabilities.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">One-Click Interface</h3>
              <p className="text-slate-600">
                Intuitive user-friendly interface suitable for general public use with offline bootable ISO/USB support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Secure Your Data?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust CleanWipe for secure device disposal and recycling.
          </p>
          <button 
            onClick={handleGetStarted}
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CW</span>
              </div>
              <span className="text-xl font-semibold text-white">CleanWipe</span>
            </div>
            <div className="text-slate-400 text-center md:text-right">
              <p>&copy; 2024 CleanWipe. All rights reserved.</p>
              <p className="text-sm mt-1">Promoting secure e-waste management across India</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
