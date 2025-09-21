'use client';

import Link from "next/link";
import { useSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import { CrowdCanvas } from "@/components/ui/skiper-ui/skiper39";
import DecryptedText from "@/components/ui/DecryptedText";
import TrueFocus from "@/components/ui/TrueFocus";
import { useState, useEffect } from "react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import GlobeDemo from "@/components/globe-demo";


// SecureWipe Bento Grid Component
const SecureWipeBentoGrid = () => {
  const Skeleton = ({ imageUrl }: { imageUrl: string }) => (
    <div 
      className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    >
      {/* <div className="absolute inset-0 bg-black/20 rounded-xl"></div> */}
    </div>
  );

  const items = [
    {
      title: "NIST SP 800-88 Compliant",
      description: "Military-grade data sanitization following government standards for secure data erasure.",
      header: <Skeleton imageUrl="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop" />,
      icon: (
        <svg className="h-4 w-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
        </svg>
      ),
    },
    {
      title: "Cross-Platform Support",
      description: "Works seamlessly across Windows, Linux, and macOS with native performance.",
      header: <Skeleton imageUrl="https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=500&h=300&fit=crop" />,
      icon: (
        <svg className="h-4 w-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.351"/>
        </svg>
      ),
    },
    {
      title: "Tamper-Proof Certification",
      description: "Generate verifiable certificates proving complete data destruction for compliance.",
      header: <Skeleton imageUrl="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop" />,
      icon: (
        <svg className="h-4 w-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
        </svg>
      ),
    },
    // {
    //   title: "Enterprise Ready",
    //   description: "Built for organizations managing large-scale IT asset disposal and data governance.",
    //   header: <Skeleton imageUrl="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop" />,
    //   icon: (
    //     <svg className="h-4 w-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
    //       <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    //     </svg>
    //   ),
    // },
    {
      title: "Zero Data Recovery",
      description: "Advanced algorithms ensure complete data destruction beyond forensic recovery.",
      header: <Skeleton imageUrl="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop" />,
      icon: (
        <svg className="h-4 w-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12Z"/>
        </svg>
      ),
    },
    // {
    //   title: "Audit Trail Support",
    //   description: "Comprehensive logging and reporting for regulatory compliance and internal audits.",
    //   header: <Skeleton imageUrl="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop" />,
    //   icon: (
    //     <svg className="h-4 w-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
    //       <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
    //     </svg>
    //   ),
    // },
    {
      title: "Green Computing",
      description: "Enable safe e-waste recycling by removing data security barriers to device disposal.",
      header: <Skeleton imageUrl="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&h=300&fit=crop" />,
      icon: (
        <svg className="h-4 w-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
        </svg>
      ),
    },
  ];

  return (
    <BentoGrid className="max-w-4xl mx-auto">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={i === 3 || i === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
};


export default function Home() {
  const { user } = useSession();
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


  return (
    <div className="min-h-screen bg-gray-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-gray-300/95 backdrop-blur-md border-b border-slate-300 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
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
                  className="px-4 py-1.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg font-semibold hover:from-slate-700 hover:to-slate-800 transition-all duration-200 text-sm"
                >
                  Get Started
                </button>
              </>
            ) : (
              <button
                onClick={handleGetStarted}
                className="px-4 py-1.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg font-semibold hover:from-slate-700 hover:to-slate-800 transition-all duration-200 text-sm"
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
          <div className="grid md:grid-cols-5 gap-8 items-center">
            {/* E-Waste Graph - 60% width (3/5 columns) */}
            <div className="md:col-span-3">
              <CardSpotlight className="h-96 w-full">
                <GlobeDemo />
              </CardSpotlight>
              </div>
            
            {/* Core Problem - 40% width (2/5 columns) */}
            <div className="md:col-span-2">
              <CardSpotlight className="h-96 w-full">
                <div className="h-full flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-white mb-6">The Core Problem</h3>
                  <div className="text-neutral-200 space-y-4 relative z-20">
                    <p className="leading-relaxed">
                Most users hesitate to recycle their devices due to fear of data breaches.
                Existing sanitization tools are either too complex, expensive, or lack
                verifiable proof of erasure, creating a significant barrier to safe disposal.
              </p>
                    
                    <div className="space-y-3 mt-6">
                      <div className="flex gap-3 items-start">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 shrink-0"></div>
                        <p className="text-sm text-neutral-300">Complex sanitization processes</p>
                      </div>
                      <div className="flex gap-3 items-start">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 shrink-0"></div>
                        <p className="text-sm text-neutral-300">High cost of enterprise solutions</p>
                      </div>
                      <div className="flex gap-3 items-start">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 shrink-0"></div>
                        <p className="text-sm text-neutral-300">Lack of verifiable erasure proof</p>
                      </div>
                      <div className="flex gap-3 items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                        <p className="text-sm text-neutral-300">Fear of data breaches during disposal</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardSpotlight>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20 bg-gray-300">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-5xl md:text-6xl font-black text-black mb-8">
              <TrueFocus
                sentence="SecureWipe Features"
                manualMode={false}
                blurAmount={5}
                borderColor="gray"
                animationDuration={2}
                pauseBetweenAnimations={1}
              />
            </div>
            <p className="text-xl text-slate-800 max-w-2xl mx-auto font-medium">
              Enterprise-grade data sanitization with military-standard security protocols
            </p>
          </div>

          <SecureWipeBentoGrid />
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
        <div className="absolute top-10 left-10 w-20 h-20 bg-slate-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-slate-600/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-slate-400/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
         
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight">
            Ready to Secure Your Data?
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-700 mb-16 max-w-4xl mx-auto leading-relaxed font-light">
            Download SecureWipe now and start protecting your sensitive information with 
            <span className="text-slate-700 font-semibold"> enterprise-grade security</span>.
            {userPlatform !== 'unknown' && (
              <span className="block mt-4 text-slate-600 text-lg">
                <span className="inline-flex items-center px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg">
                  <svg className="w-4 h-4 mr-2 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-800 font-medium">We detected you&apos;re using {userPlatform === 'windows' ? 'Windows' : userPlatform === 'linux' ? 'Linux' : 'macOS'}</span>
                </span>
              </span>
            )}
          </p>

          {/* Download Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {/* Windows Card */}
            <div className={`group relative bg-white rounded-2xl p-6 border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden ${
              userPlatform === 'windows' 
                ? 'border-yellow-400 shadow-lg ring-2 ring-yellow-400/20' 
                : 'border-slate-200 hover:border-slate-400 hover:ring-2 hover:ring-slate-400/20'
            }`}>
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Floating Elements */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-slate-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-2 left-2 w-1 h-1 bg-slate-300 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative z-10 text-center">
                {/* Icon with Animation */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <svg className="w-8 h-8 text-white group-hover:scale-110  " fill="currentColor" viewBox="0 0 24 24">
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.351"/>
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
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-600 transition-colors duration-300">
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
                <button className="w-full px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl font-semibold hover:from-slate-700 hover:to-slate-800 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 group/btn">
                <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                    <span>Download Now</span>
                </div>
              </button>
                
                {/* Version Info with Animation */}
                <div className="mt-3 flex items-center justify-center space-x-2 text-xs text-slate-500">
                  <span className="group-hover:text-slate-600 transition-colors duration-300">v2.1.0</span>
                  <span>•</span>
                  <span className="group-hover:text-slate-600 transition-colors duration-300">45MB</span>
                  <span>•</span>
                  <span className="text-green-600 font-medium group-hover:text-green-700 transition-colors duration-300">Free</span>
                </div>
              </div>
            </div>

            {/* Linux Card */}
            <div className={`group relative bg-white rounded-2xl p-6 border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden ${
              userPlatform === 'linux' 
                ? 'border-yellow-400 shadow-lg ring-2 ring-yellow-400/20' 
                : 'border-slate-200 hover:border-slate-400 hover:ring-2 hover:ring-slate-400/20'
            }`}>
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Floating Elements */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-slate-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-2 left-2 w-1 h-1 bg-slate-300 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative z-10 text-center">
                {/* Icon with Animation */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                      <svg className="w-8 h-8 text-white group-hover:scale-110  " fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 01-.088.069c-.104.105-.259.158-.436.158-.177 0-.33-.053-.435-.158-.105-.104-.158-.248-.158-.436 0-.179.053-.334.158-.439.105-.104.258-.158.435-.158h.002zm-2.962.059h.036c.142 0 .27.048.399.135.146.129.197.301.197.518 0 .094-.018.284-.061.431-.045.148-.117.283-.212.388-.095.104-.223.156-.375.156-.154 0-.28-.052-.375-.156-.095-.105-.155-.24-.155-.388 0-.146.06-.284.155-.431.095-.146.221-.284.375-.431.154-.146.335-.222.511-.222h.005zm5.618 0c.178 0 .34.076.468.194.128.118.192.27.192.456 0 .186-.064.338-.192.456a.645.645 0 01-.468.194c-.178 0-.34-.076-.468-.194a.645.645 0 01-.192-.456c0-.186.064-.338.192-.456a.645.645 0 01.468-.194zm-3.313 2.020c.167 0 .31.085.413.167.104.082.186.18.186.319 0 .140-.082.237-.186.319-.103.082-.246.167-.413.167-.168 0-.31-.085-.414-.167-.103-.082-.186-.179-.186-.319 0-.14.083-.237.186-.319.104-.082.246-.167.414-.167zm.918 6.991c.18 0 .325.014.479.104.154.091.274.217.375.335.101.118.169.219.169.335 0 .116-.068.217-.169.335-.101.118-.221.244-.375.335-.154.09-.299.104-.479.104-.18 0-.325-.014-.479-.104-.154-.091-.274-.217-.375-.335-.101-.118-.169-.219-.169-.335 0-.116.068-.217.169-.335.101-.118.221-.244.375-.335.154-.09.299-.104.479-.104z"/>
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
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-600 transition-colors duration-300">
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
                <button className="w-full px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl font-semibold hover:from-slate-700 hover:to-slate-800 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 group/btn">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4 group-hover/btn:scale-110  " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download Now</span>
                  </div>
            </button>
                
                {/* Version Info with Animation */}
                <div className="mt-3 flex items-center justify-center space-x-2 text-xs text-slate-500">
                  <span className="group-hover:text-slate-600 transition-colors duration-300">v2.1.0</span>
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
              <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
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
