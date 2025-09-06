import React from 'react';
import Image from 'next/image';
import { ShieldCheckIcon, GlobeAltIcon, BoltIcon } from '@heroicons/react/24/outline';

const Hero: React.FC = () => {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/6.jpg"
          alt="Secure vault background"
          fill
          className="object-cover"
          style={{ objectPosition: '60% center' }}
          sizes="100vw"
          priority
          quality={100}
          unoptimized={true}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full text-black text-sm font-medium mb-8">
            <ShieldCheckIcon className="w-4 h-4 mr-2" />
            Military-Grade Security Encryption
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight drop-shadow-lg">
            MistCurrent
          </h1>
          
          <div className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
            <span className="text-white drop-shadow-lg">
              Navigate Freely Through the Mist
            </span>
          </div>
          
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Privacy Protection · Lightning Speed
          </p>
          
          <p className="text-lg text-white mb-12 max-w-2xl mx-auto drop-shadow-md">
            Global server coverage with ultra-fast speeds and military-grade encryption security. Navigate the digital world freely and enjoy true internet freedom.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button 
              onClick={() => window.location.href = '/second'}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-lg border border-green-500/30"
            >
              Get Started - $2.19/month
            </button>
            <button 
              onClick={scrollToPricing}
              className="border-2 border-white/60 hover:border-white hover:bg-white/10 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              View Pricing Plans
            </button>
          </div>
        </div>
        
        {/* Hero Image Grid - 移除三个卡片，只保留主图 */}
        <div className="relative">
          {/* Main Large Image */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-white/30">
                <Image
                  src="/4.jpg"
                  alt="Data Security Protection"
                  width={600}
                  height={400}
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <p className="text-green-300 font-medium text-lg mb-8 drop-shadow-md">
            Your online privacy, fully protected by MistCurrent
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 border border-white/30">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <span className="text-sm font-semibold text-green-300">🚀 Lightning Fast</span>
              <span className="text-xs text-white">Millisecond response time</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 border border-white/30">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              </div>
              <span className="text-sm font-semibold text-green-300">No-Log Policy</span>
              <span className="text-xs text-white">Strict user privacy protection</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 border border-white/30">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              </div>
              <span className="text-sm font-semibold text-green-300">24/7 Support</span>
              <span className="text-xs text-white">Round-the-clock professional service</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center bg-white/10 backdrop-blur-sm">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;