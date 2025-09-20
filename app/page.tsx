'use client';

import Link from "next/link";
import { useSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  Star,
  Users,
  Award,
  Globe,
  Smartphone,
  Laptop,
  HardDrive,
  Lock,
  FileText,
  Download,
  Sparkles
} from "lucide-react";
import Button from "@/app/components/ui/Button";
import Card, { CardContent } from "@/app/components/ui/Card";
import FeatureCard from "@/app/components/ui/FeatureCard";
import StatsCard from "@/app/components/ui/StatsCard";
import ThemeToggle from "@/app/components/ui/ThemeToggle";

export default function Home() {
  const { user, isLoading } = useSession();
  const router = useRouter();

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="text-center animate-fade-in-up">
          <div className="w-12 h-12 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading CleanWipe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 transition-colors duration-300">
      {/* Enhanced Navigation */}
      <nav className="px-6 py-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 animate-fade-in-left">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              CleanWipe
            </span>
          </div>
          
          <div className="flex items-center space-x-4 animate-fade-in-right">
            <ThemeToggle size="sm" />
            {!user ? (
              <>
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Button 
                  onClick={handleGetStarted}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Get Started
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleGetStarted}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Go to Dashboard
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="px-6 py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-800/30 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 dark:bg-purple-800/30 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 dark:bg-pink-800/30 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-white/20 dark:border-gray-700/20 shadow-lg mb-8 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">NIST SP 800-88 Compliant</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Secure Data Erasure for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"> Electronic Devices</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              Professional, verifiable, and tamper-proof data wiping solutions. 
              Build confidence in device recycling and promote safe e-waste management 
              across India&apos;s growing digital landscape.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <Button 
                onClick={handleGetStarted}
                size="xl"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Start Secure Wiping
              </Button>
              <Button 
                variant="secondary"
                size="xl"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                <span>ISO 27001 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span>Military-Grade Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                <span>99.9% Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Problem Statement */}
      <section className="px-6 py-20 bg-white dark:bg-gray-900 relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up">
              India&apos;s E-Waste Crisis
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              A growing digital nation faces a critical challenge in secure device disposal
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <StatsCard
              title="Annual E-Waste Generated"
              value="1.75M"
              icon={<HardDrive className="w-6 h-6" />}
              color="red"
              delay={0}
            />
            <StatsCard
              title="Assets Hoarded (₹)"
              value="50,000Cr"
              icon={<Lock className="w-6 h-6" />}
              color="orange"
              delay={200}
            />
            <StatsCard
              title="Devices at Risk"
              value="100M+"
              icon={<Smartphone className="w-6 h-6" />}
              color="purple"
              delay={400}
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-left">
              <Card className="p-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">The Core Problem</h3>
                  <div className="space-y-4 text-gray-600 dark:text-gray-300">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Most users hesitate to recycle devices due to fear of data breaches</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 dark:bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Existing sanitization tools are complex and expensive</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Lack of verifiable proof creates barriers to safe disposal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="animate-fade-in-right">
              <Card glass className="p-8">
                <CardContent>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Solution</h3>
                  <div className="space-y-4 text-gray-600 dark:text-gray-300">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <p>One-click secure data erasure with military-grade algorithms</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <p>Tamper-proof certificates for complete peace of mind</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <p>Cross-platform support for all major devices</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features */}
      <section id="features" className="px-6 py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden transition-colors duration-300">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6 animate-fade-in-up">
              <Zap className="w-4 h-4 mr-2" />
              Advanced Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Professional Data Erasure Solutions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              NIST SP 800-88 compliant, cross-platform secure wiping with tamper-proof certification
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <FeatureCard
              icon={<CheckCircle className="w-8 h-8" />}
              title="Comprehensive Erasure"
              description="Securely erase all user data including hidden storage areas like HPA/DCO and SSD sectors across Windows, Linux, and Android devices."
              gradient="from-green-500 to-emerald-600"
              delay={0}
            />
            
            <FeatureCard
              icon={<FileText className="w-8 h-8" />}
              title="Tamper-Proof Certificates"
              description="Generate digitally signed wipe certificates in PDF and JSON formats with third-party verification capabilities."
              gradient="from-blue-500 to-cyan-600"
              delay={200}
            />
            
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="One-Click Interface"
              description="Intuitive user-friendly interface suitable for general public use with offline bootable ISO/USB support."
              gradient="from-purple-500 to-pink-600"
              delay={400}
            />
          </div>
          
          {/* Additional Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card hover className="p-6 text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <CardContent>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Cross-Platform</h4>
                <p className="text-sm text-gray-600">Windows, Linux, Android support</p>
              </CardContent>
            </Card>
            
            <Card hover className="p-6 text-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <CardContent>
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Military-Grade</h4>
                <p className="text-sm text-gray-600">DoD 5220.22-M compliant</p>
              </CardContent>
            </Card>
            
            <Card hover className="p-6 text-center animate-fade-in-up" style={{ animationDelay: '1s' }}>
              <CardContent>
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Offline Support</h4>
                <p className="text-sm text-gray-600">Bootable ISO/USB options</p>
              </CardContent>
            </Card>
            
            <Card hover className="p-6 text-center animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
              <CardContent>
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">User-Friendly</h4>
                <p className="text-sm text-gray-600">Simple interface for everyone</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8 animate-fade-in-up">
            <Star className="w-4 h-4 mr-2" />
            Trusted by 10,000+ Users
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Ready to Secure Your Data?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Join thousands of users who trust CleanWipe for secure device disposal and recycling. 
            Start your journey towards responsible e-waste management today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Button 
              onClick={handleGetStarted}
              variant="secondary"
              size="xl"
              className="bg-white text-blue-600 hover:bg-blue-50"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Get Started Today
            </Button>
            <Button 
              variant="outline"
              size="xl"
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-12 text-white/80 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">ISO 27001 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span className="text-sm">NIST Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">99.9% Success Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="px-6 py-16 bg-gray-900 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">CleanWipe</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Professional, secure, and verifiable data wiping solutions for electronic devices. 
                Promoting safe e-waste management across India.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Globe className="w-5 h-5 text-gray-400" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Award className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="/login" className="text-gray-400 hover:text-white transition-colors">Sign In</a></li>
                <li><a href="/signup" className="text-gray-400 hover:text-white transition-colors">Get Started</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
                <p>&copy; 2024 CleanWipe. All rights reserved.</p>
                <p className="text-sm mt-1">Promoting secure e-waste management across India</p>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>Made with ❤️ in India</span>
                <span>•</span>
                <span>Version 1.0.0</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
