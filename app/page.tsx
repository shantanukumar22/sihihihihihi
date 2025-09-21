'use client';

import Link from "next/link";
import { useSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import { CrowdCanvas } from "@/components/ui/skiper-ui/skiper39";
import DecryptedText from "@/components/ui/DecryptedText";
import TrueFocus from "@/components/ui/TrueFocus";
import { useState, useEffect } from "react";
import CircularGallery from "@/components/ui/CircularGallery";

// Loading icon component that cycles through different icons
const LoadingIcon = () => {
  const [currentIcon, setCurrentIcon] = useState(0);

  const icons = [
    // Spinner
    <svg key="spinner" className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>,
    // Dots
    <svg key="dots" className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="4" cy="12" r="3" className="animate-pulse">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="12" cy="12" r="3" className="animate-pulse" style={{ animationDelay: '0.2s' }}>
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="20" cy="12" r="3" className="animate-pulse" style={{ animationDelay: '0.4s' }}>
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </svg>,
    // Shield
    <svg key="shield" className="w-8 h-8 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
    </svg>,
    // Lock
    <svg key="lock" className="w-8 h-8 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length);
    }, 1000); // Change icon every second

    return () => clearInterval(interval);
  }, [icons.length]);

  return (
    <div className="transition-all duration-300">
      {icons[currentIcon]}
    </div>
  );
};

export default function Home() {
  const { user, isLoading } = useSession();
  const router = useRouter();
  const [userPlatform, setUserPlatform] = useState<'windows' | 'linux' | 'mac' | 'unknown'>('unknown');

  // Detect user platform
  useEffect(() => {
    const detectPlatform = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('win')) {
        setUserPlatform('windows');
      } else if (userAgent.includes('linux')) {
        setUserPlatform('linux');
      } else if (userAgent.includes('mac')) {
        setUserPlatform('mac');
      } else {
        setUserPlatform('unknown');
      }
    };

    detectPlatform();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      if (user.profileComplete) {
        router.push('/dashboard');
      } else {
        router.push('/dashboard');
      }
    } else {
      router.push('/signup');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-6 transform hover:scale-105  ">
              <span className="text-white font-bold text-3xl">SW</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">SecureWipe</h1>
            <p className="text-slate-500 font-medium">Enterprise Data Security</p>
          </div>

          {/* Inspiring Messages */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800">Securing Your Digital Future</h2>
            <p className="text-slate-600 leading-relaxed">
              Every piece of data deserves protection. We&apos;re preparing a fortress of security
              protocols to safeguard what matters most to you.
            </p>
          </div>

          {/* Loading Progress */}
          <div className="mt-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
                <LoadingIcon />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Initializing secure environment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-gray-300/95 backdrop-blur-md border-b border-slate-300 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SW</span>
            </div>
            <span className="text-xl font-bold text-slate-900">SecureWipe</span>
          </div>

          <div className="flex items-center space-x-3">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-medium transition-colors text-sm"
                >
                  Sign In
                </Link>
                <button
                  onClick={handleGetStarted}
                  className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm"
                >
                  Get Started
                </button>
              </>
            ) : (
              <button
                onClick={handleGetStarted}
                className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm"
              >
                Dashboard
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with CrowdCanvas */}
      <section className="relative h-screen pt-16 bg-gray-300">
        <div className="relative h-full w-full">
          <CrowdCanvas src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/open-peeps-sheet.png" rows={15} cols={7} />
        </div>
        <div className="absolute inset-0 flex items-start justify-center pt-24">
          <div className="text-center">
            <div className="text-6xl md:text-8xl font-bold text-slate-800 mb-6 leading-tight">
              <DecryptedText
                speed={150}
                text="Because your data"
                animateOn="view"
                revealDirection="center" />
              <br />
              <DecryptedText
                speed={150}
                text="Deserves a clean exit"
                animateOn="view"
                revealDirection="center" />
            </div>
          </div>
        </div>
      </section>



      {/* Problem Statement */}
      <section className="px-6 py-16 bg-gray-300">
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
      <section id="features" className="px-6 py-20 bg-gray-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-5xl md:text-6xl font-black text-black mb-8">

              <TrueFocus
                sentence="Privacy First"
                manualMode={false}
                blurAmount={5}
                borderColor="cyan"
                animationDuration={2}
                pauseBetweenAnimations={1}
              />
            </div>
            <p className="text-xl text-slate-800 max-w-2xl mx-auto font-medium">
              NIST SP 800-88 compliant, cross-platform secure wiping with tamper-proof certification
            </p>
          </div>

          <div style={{ height: '600px', position: 'relative' }}>
            <CircularGallery bend={3} textColor="#ffffff" borderRadius={0.05} scrollEase={0.02} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 bg-gray-300 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">

          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight">
            Ready to Secure Your Data?
          </h2>

          <p className="text-xl md:text-2xl text-slate-700 mb-16 max-w-4xl mx-auto leading-relaxed font-light">
            Download SecureWipe now and start protecting your sensitive information with
            <span className="text-blue-600 font-semibold"> enterprise-grade security</span>.
            {userPlatform !== 'unknown' && (
              <span className="block mt-4 text-slate-600 text-lg">
                <span className="inline-flex items-center px-4 py-2 bg-blue-100 border border-blue-200 rounded-lg">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-800 font-medium">We detected you&apos;re using {userPlatform === 'windows' ? 'Windows' : userPlatform === 'linux' ? 'Linux' : 'macOS'}</span>
                </span>
              </span>
            )}
          </p>

          {/* Download Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {/* Windows Card */}
            <div className={`group relative bg-white rounded-2xl p-6 border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden ${userPlatform === 'windows'
              ? 'border-yellow-400 shadow-lg ring-2 ring-yellow-400/20'
              : 'border-slate-200 hover:border-blue-400 hover:ring-2 hover:ring-blue-400/20'
              }`}>
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Floating Elements */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-2 left-2 w-1 h-1 bg-blue-300 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <div className="relative z-10 text-center">
                {/* Icon with Animation */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <svg className="w-8 h-8 text-white group-hover:scale-110  " fill="currentColor" viewBox="0 0 24 24">
                        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.351" />
                      </svg>
                    </div>
                    {userPlatform === 'windows' && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                        <svg className="w-3 h-3 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title with Animation */}
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  Windows
                  {userPlatform === 'windows' && (
                    <span className="ml-2 text-yellow-600 text-sm animate-pulse">✓ Recommended</span>
                  )}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-sm mb-4 group-hover:text-slate-700 transition-colors duration-300">
                  Desktop app with GUI
                </p>

                {/* Features List */}
                <div className="space-y-1 mb-6 text-xs text-slate-500">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Windows 10/11</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <span>Enterprise Ready</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    <span>Auto Updates</span>
                  </div>
                </div>

                {/* Download Button with Animation */}
                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 group/btn">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download Now</span>
                  </div>
                </button>

                {/* Version Info with Animation */}
                <div className="mt-3 flex items-center justify-center space-x-2 text-xs text-slate-500">
                  <span className="group-hover:text-blue-600 transition-colors duration-300">v2.1.0</span>
                  <span>•</span>
                  <span className="group-hover:text-slate-600 transition-colors duration-300">45MB</span>
                  <span>•</span>
                  <span className="text-green-600 font-medium group-hover:text-green-700 transition-colors duration-300">Free</span>
                </div>
              </div>
            </div>

            {/* Linux Card */}
            <div className={`group relative bg-white rounded-2xl p-6 border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden ${userPlatform === 'linux'
              ? 'border-yellow-400 shadow-lg ring-2 ring-yellow-400/20'
              : 'border-slate-200 hover:border-orange-400 hover:ring-2 hover:ring-orange-400/20'
              }`}>
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Floating Elements */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-orange-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-2 left-2 w-1 h-1 bg-orange-300 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <div className="relative z-10 text-center">
                {/* Icon with Animation */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                      <svg className="w-8 h-8 text-white group-hover:scale-110  " fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 01-.088.069c-.104.105-.259.158-.436.158-.177 0-.33-.053-.435-.158-.105-.104-.158-.248-.158-.436 0-.179.053-.334.158-.439.105-.104.258-.158.435-.158h.002zm-2.962.059h.036c.142 0 .27.048.399.135.146.129.197.301.197.518 0 .094-.018.284-.061.431-.045.148-.117.283-.212.388-.095.104-.223.156-.375.156-.154 0-.28-.052-.375-.156-.095-.105-.155-.24-.155-.388 0-.146.06-.284.155-.431.095-.146.221-.284.375-.431.154-.146.335-.222.511-.222h.005zm5.618 0c.178 0 .34.076.468.194.128.118.192.27.192.456 0 .186-.064.338-.192.456a.645.645 0 01-.468.194c-.178 0-.34-.076-.468-.194a.645.645 0 01-.192-.456c0-.186.064-.338.192-.456a.645.645 0 01.468-.194zm-3.313 2.020c.167 0 .31.085.413.167.104.082.186.18.186.319 0 .140-.082.237-.186.319-.103.082-.246.167-.413.167-.168 0-.31-.085-.414-.167-.103-.082-.186-.179-.186-.319 0-.14.083-.237.186-.319.104-.082.246-.167.414-.167zm.918 6.991c.18 0 .325.014.479.104.154.091.274.217.375.335.101.118.169.219.169.335 0 .116-.068.217-.169.335-.101.118-.221.244-.375.335-.154.09-.299.104-.479.104-.18 0-.325-.014-.479-.104-.154-.091-.274-.217-.375-.335-.101-.118-.169-.219-.169-.335 0-.116.068-.217.169-.335.101-.118.221-.244.375-.335.154-.09.299-.104.479-.104z" />
                      </svg>
                    </div>
                    {userPlatform === 'linux' && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                        <svg className="w-3 h-3 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title with Animation */}
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                  Linux
                  {userPlatform === 'linux' && (
                    <span className="ml-2 text-yellow-600 text-sm animate-pulse">✓ Recommended</span>
                  )}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-sm mb-4 group-hover:text-slate-700 transition-colors duration-300">
                  CLI & GUI versions
                </p>

                {/* Features List */}
                <div className="space-y-1 mb-6 text-xs text-slate-500">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Ubuntu/Debian/RHEL</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <span>Server Ready</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    <span>Open Source</span>
                  </div>
                </div>

                {/* Download Button with Animation */}
                <button className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 group/btn">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4 group-hover/btn:scale-110  " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download Now</span>
                  </div>
                </button>

                {/* Version Info with Animation */}
                <div className="mt-3 flex items-center justify-center space-x-2 text-xs text-slate-500">
                  <span className="group-hover:text-orange-600 transition-colors duration-300">v2.1.0</span>
                  <span>•</span>
                  <span className="group-hover:text-slate-600 transition-colors duration-300">33MB</span>
                  <span>•</span>
                  <span className="text-green-600 font-medium group-hover:text-green-700 transition-colors duration-300">Free</span>
                </div>
              </div>
            </div>
          </div>

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
