import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PricingCards from '../components/PricingCards';

const Second: React.FC = () => {
  return (
    <>
      <Head>
        <title>Pricing - MistCurrent | Network Cloud Acceleration Service</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <main className="pt-20">
          {/* Hero Section with Black Background */}
          <div className="relative py-8 md:py-12 bg-gray-900">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
              <div className="text-center">
                {/* Mobile Layout: Stack vertically */}
                <div className="block sm:hidden mb-4">
                  <img 
                    src="/31.png" 
                    alt="MistCurrent Logo" 
                    className="w-20 h-20 mx-auto mb-4"
                  />
                  <h1 className="text-4xl font-bold text-white">
                    MistCurrent
                  </h1>
                </div>
                
                {/* Desktop Layout: Side by side */}
                <div className="hidden sm:flex items-center justify-center mb-4">
                  <img 
                    src="/31.png" 
                    alt="MistCurrent Logo" 
                    className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mr-4 md:mr-8"
                  />
                  <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white">
                    MistCurrent
                  </h1>
                </div>
                
                <p className="text-lg md:text-2xl text-gray-300">
                  Secure. Fast. Reliable.
                </p>
              </div>
            </div>
          </div>
          
          {/* Text Section Below Hero */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-16">
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose the network acceleration plan that best suits your needs and enjoy the ultimate internet experience
              </p>
            </div>
          </div>
          
          {/* Pricing Cards Section */}
          <PricingCards />
          
          {/* User Reviews Section */}
          <section className="py-12 md:py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Header */}
              <div className="text-center mb-8 md:mb-16">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 md:mb-4">
                  MistCurrent User Reviews
                </h2>
                <p className="text-base md:text-xl text-gray-600">
                  What our customers say about us
                </p>
              </div>

              {/* Reviews Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {/* Review 1 */}
                <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Simple and Secure</h3>
                  <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">"MistCurrnet is very straightforward—just one click to connect. I feel safe even when using Wi-Fi in coffee shops. Totally worth the price."</p>
                  <p className="text-xs md:text-sm text-gray-500">— Ms. Chen</p>
                </div>

                {/* Review 2 */}
                <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Better Than Expected</h3>
                  <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">"I've tried a few VPNs before, and they kept disconnecting. MistCurrnet surprised me with its stability. Now streaming videos is completely smooth."</p>
                  <p className="text-xs md:text-sm text-gray-500">— David L.</p>
                </div>

                {/* Review 3 */}
                <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Highly Recommended</h3>
                  <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">"I've been using it for three months and never had a single dropout. Privacy is my top concern, and MistCurrnet does a great job."</p>
                  <p className="text-xs md:text-sm text-gray-500">— Mr. Wang</p>
                </div>

                {/* Review 4 */}
                <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Surprisingly Fast</h3>
                  <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">"The speed is impressive, especially when connecting to US servers. Video calls for work are smooth without any lag."</p>
                  <p className="text-xs md:text-sm text-gray-500">— Ken</p>
                </div>

                {/* Review 5 */}
                <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Great Value</h3>
                  <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">"Most VPNs are either too expensive or disappointing. MistCurrnet is reasonably priced and works perfectly. Very satisfied."</p>
                  <p className="text-xs md:text-sm text-gray-500">— Emma</p>
                </div>

                {/* Review 6 */}
                <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">A Reliable Choice</h3>
                  <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">"I travel a lot and constantly switch networks. My old VPN always had issues. Since switching to MistCurrnet, everything has been worry-free."</p>
                  <p className="text-xs md:text-sm text-gray-500">— Dylan</p>
                </div>

                {/* Review 7 */}
                <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Excellent Support</h3>
                  <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">"I once had a login issue, and the support team solved it within 10 minutes. That kind of quick response deserves praise."</p>
                  <p className="text-xs md:text-sm text-gray-500">— Mr. Liu</p>
                </div>

                {/* Review 8 */}
                <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Peace of Mind</h3>
                  <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">"Even though I'm not tech-savvy, it's super easy to use. MistCurrnet really gives me a sense of being protected online."</p>
                  <p className="text-xs md:text-sm text-gray-500">— Non-tech user</p>
                </div>

                {/* Review 9 */}
                <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Will Keep Subscribing</h3>
                  <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">"I first tried the monthly plan just to test it. The experience was great, so I upgraded to a yearly subscription. MistCurrnet will be my go-to VPN."</p>
                  <p className="text-xs md:text-sm text-gray-500">— Alex</p>
                </div>
              </div>
            </div>
          </section>

          {/* Server Selection Section */}
          <section className="py-12 md:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Header */}
              <div className="text-center mb-8 md:mb-16">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 md:mb-4">
                  Choose Your Server Location
                </h2>
                <p className="text-base md:text-xl text-gray-600">
                  Select from our high-speed servers worldwide for optimal performance
                </p>
              </div>

              {/* Server Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 max-w-6xl mx-auto">
                {/* United States */}
                <div className="group cursor-pointer">
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-300 text-center group-hover:scale-105">
                    <div className="text-3xl md:text-4xl mb-2 md:mb-3">🇺🇸</div>
                    <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">United States</h3>
                    <p className="text-xs md:text-sm text-green-600 font-medium">15 servers</p>
                    <div className="mt-2 md:mt-3">
                      <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs md:text-sm text-gray-500">Fast</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* United Kingdom */}
                <div className="group cursor-pointer">
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-300 text-center group-hover:scale-105">
                    <div className="text-3xl md:text-4xl mb-2 md:mb-3">🇬🇧</div>
                    <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">United Kingdom</h3>
                    <p className="text-xs md:text-sm text-green-600 font-medium">12 servers</p>
                    <div className="mt-2 md:mt-3">
                      <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs md:text-sm text-gray-500">Fast</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Germany */}
                <div className="group cursor-pointer">
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-300 text-center group-hover:scale-105">
                    <div className="text-3xl md:text-4xl mb-2 md:mb-3">🇩🇪</div>
                    <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Germany</h3>
                    <p className="text-xs md:text-sm text-green-600 font-medium">10 servers</p>
                    <div className="mt-2 md:mt-3">
                      <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs md:text-sm text-gray-500">Fast</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* France */}
                <div className="group cursor-pointer">
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-300 text-center group-hover:scale-105">
                    <div className="text-3xl md:text-4xl mb-2 md:mb-3">🇫🇷</div>
                    <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">France</h3>
                    <p className="text-xs md:text-sm text-green-600 font-medium">8 servers</p>
                    <div className="mt-2 md:mt-3">
                      <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs md:text-sm text-gray-500">Fast</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Netherlands */}
                <div className="group cursor-pointer">
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-300 text-center group-hover:scale-105">
                    <div className="text-3xl md:text-4xl mb-2 md:mb-3">🇳🇱</div>
                    <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Netherlands</h3>
                    <p className="text-xs md:text-sm text-green-600 font-medium">9 servers</p>
                    <div className="mt-2 md:mt-3">
                      <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs md:text-sm text-gray-500">Fast</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Canada */}
                <div className="group cursor-pointer">
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-300 text-center group-hover:scale-105">
                    <div className="text-3xl md:text-4xl mb-2 md:mb-3">🇨🇦</div>
                    <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Canada</h3>
                    <p className="text-xs md:text-sm text-green-600 font-medium">7 servers</p>
                    <div className="mt-2 md:mt-3">
                      <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs md:text-sm text-gray-500">Fast</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* More Locations Button */}
              <div className="text-center mt-8 md:mt-12">
                <button className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-300 text-sm md:text-base">
                  <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                  </svg>
                  View All 105 Locations
                </button>
                <p className="mt-3 md:mt-4 text-xs md:text-sm text-gray-500">
                  All servers support 10Gbps speeds and unlimited bandwidth
                </p>
              </div>
            </div>
          </section>

          {/* Statistics Section */}
          <section className="py-12 md:py-20 bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Header */}
              <div className="text-center mb-8 md:mb-16">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">
                  Trusted by Millions Worldwide
                </h2>
                <p className="text-base md:text-xl text-gray-300">
                  Join millions of users across the globe
                </p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
                {/* Countries Stat */}
                <div className="text-center">
                  <div className="relative mb-4 md:mb-8">
                    {/* Animated Circle */}
                    <div className="relative w-32 h-32 md:w-48 md:h-48 mx-auto">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background Circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="4"
                          fill="none"
                        />
                        {/* Animated Progress Circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="#10b981"
                          strokeWidth="4"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray="283"
                          strokeDashoffset="56"
                          className="transition-all duration-2000 ease-out"
                        />
                      </svg>
                      {/* Center Content */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-green-400 mb-1 md:mb-2 animate-pulse">
                            105
                          </div>
                          <div className="text-white font-semibold text-sm md:text-base">
                            Countries
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Globe Icon */}
                    <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-8 h-8 md:w-12 md:h-12 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                      <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-4">Stable Nodes</h3>
                  <p className="text-sm md:text-base text-gray-300">
                    High-speed servers across 105 countries for optimal performance
                  </p>
                </div>

                {/* Users Stat */}
                <div className="text-center">
                  <div className="relative mb-4 md:mb-8">
                    {/* Animated Circle */}
                    <div className="relative w-32 h-32 md:w-48 md:h-48 mx-auto">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background Circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="4"
                          fill="none"
                        />
                        {/* Animated Progress Circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="#3b82f6"
                          strokeWidth="4"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray="283"
                          strokeDashoffset="42"
                          className="transition-all duration-2000 ease-out"
                        />
                      </svg>
                      {/* Center Content */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-400 mb-1 md:mb-2 animate-pulse">
                            3M+
                          </div>
                          <div className="text-white font-semibold text-sm md:text-base">
                            Users
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Users Icon */}
                    <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-8 h-8 md:w-12 md:h-12 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
                      <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-4">Trusted Users</h3>
                  <p className="text-sm md:text-base text-gray-300">
                    Over 3 million users trust MistCurrent for their privacy
                  </p>
                </div>
              </div>

              {/* Bottom Stats Bar */}
              <div className="mt-8 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
                <div>
                  <div className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2">99.9%</div>
                  <div className="text-xs md:text-base text-gray-400">Uptime</div>
                </div>
                <div>
                  <div className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2">24/7</div>
                  <div className="text-xs md:text-base text-gray-400">Support</div>
                </div>
                <div>
                  <div className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2">10Gbps</div>
                  <div className="text-xs md:text-base text-gray-400">Speed</div>
                </div>
                <div>
                  <div className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2">30-Day</div>
                  <div className="text-xs md:text-base text-gray-400">Money Back</div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Second;