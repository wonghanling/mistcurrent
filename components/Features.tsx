import React from 'react';
import Image from 'next/image';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Platform Support Section (Full Width) */}
        <div className="flex justify-center">
          <div className="max-w-6xl text-center space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
                Full Compatibility · Unlimited Devices · Global Internet Freedom
              </h2>
              <p className="text-xl text-black leading-relaxed max-w-3xl mx-auto">
                Instant stealth mode for all devices
              </p>
            </div>

            {/* Device Icons Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-10 gap-4 sm:gap-6 md:gap-8 items-center justify-items-center max-w-5xl mx-auto">
              {/* Windows */}
              <div className="flex flex-col items-center space-y-3 group cursor-pointer">
                <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                  <Image
                    src="/14.png"
                    alt="Windows"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <span className="text-sm text-black font-medium">Windows</span>
              </div>

              {/* macOS */}
              <div className="flex flex-col items-center space-y-3 group cursor-pointer">
                <div className="w-12 h-12 flex items-center justify-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09 22C7.85 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5Z"/>
                  </svg>
                </div>
                <span className="text-sm text-black font-medium">macOS</span>
              </div>

              {/* Linux */}
              <div className="flex flex-col items-center space-y-3 group cursor-pointer">
                <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                  <Image
                    src="/15.png"
                    alt="Linux"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <span className="text-sm text-black font-medium">Linux</span>
              </div>

              {/* Android */}
              <div className="flex flex-col items-center space-y-3 group cursor-pointer">
                <div className="w-12 h-12 flex items-center justify-center text-gray-600 group-hover:text-green-600 transition-colors duration-300">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1518-.5972.416.416 0 00-.5972.1518l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1333 1.0989L4.8442 5.4467a.4161.4161 0 00-.5972-.1518.416.416 0 00-.1518.5972L6.0952 9.321C3.7802 10.8397 2.3102 13.2708 2.0532 16.0017H21.9473c-.2575-2.7309-1.7275-5.162-4.0423-6.6807"/>
                  </svg>
                </div>
                <span className="text-sm text-black font-medium">Android</span>
              </div>

              {/* iOS */}
              <div className="flex flex-col items-center space-y-3 group cursor-pointer">
                <div className="w-12 h-12 flex items-center justify-center text-gray-600 group-hover:text-blue-500 transition-colors duration-300">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09 22C7.85 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5Z"/>
                  </svg>
                </div>
                <span className="text-sm text-black font-medium">Apple iOS</span>
              </div>

              {/* Chrome */}
              <div className="flex flex-col items-center space-y-3 group cursor-pointer">
                <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                  <Image
                    src="/16.png"
                    alt="Chrome"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <span className="text-sm text-black font-medium">Chrome</span>
              </div>

              {/* Firefox */}
              <div className="flex flex-col items-center space-y-3 group cursor-pointer">
                <div className="w-12 h-12 flex items-center justify-center text-gray-600 group-hover:text-orange-500 transition-colors duration-300">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zM7.92 8.924c.212-.647.53-1.208.936-1.671C9.42 6.658 10.132 6.3 10.92 6.3c1.272 0 2.304 1.032 2.304 2.304 0 .636-.258 1.212-.675 1.629-.417.417-.993.675-1.629.675-.636 0-1.212-.258-1.629-.675S8.616 9.24 8.616 8.604c0-.318.06-.621.171-.9.111-.279.273-.525.483-.729.21-.204.465-.363.75-.465z"/>
                  </svg>
                </div>
                <span className="text-sm text-black font-medium">Firefox</span>
              </div>

              {/* Opera */}
              <div className="flex flex-col items-center space-y-3 group cursor-pointer">
                <div className="w-12 h-12 flex items-center justify-center text-gray-600 group-hover:text-red-600 transition-colors duration-300">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zM12 2.4c-5.302 0-9.6 4.298-9.6 9.6s4.298 9.6 9.6 9.6 9.6-4.298 9.6-9.6S17.302 2.4 12 2.4zm0 15.6c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"/>
                  </svg>
                </div>
                <span className="text-sm text-black font-medium">Opera</span>
              </div>

              {/* Console */}
              <div className="flex flex-col items-center space-y-3 group cursor-pointer">
                <div className="w-12 h-12 flex items-center justify-center text-gray-600 group-hover:text-purple-600 transition-colors duration-300">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M21 6v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2zm-2 0H5v12h14V6zM8 8h8v2H8V8zm0 4h8v2H8v-2z"/>
                  </svg>
                </div>
                <span className="text-sm text-black font-medium">Console</span>
              </div>

              {/* Router */}
              <div className="flex flex-col items-center space-y-3 group cursor-pointer">
                <div className="w-12 h-12 flex items-center justify-center text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <span className="text-sm text-black font-medium">Router</span>
              </div>
            </div>

            <div className="pt-6">
              <p className="text-lg text-black max-w-2xl mx-auto">
                Whatever device you use, MistCurrent provides powerful encryption protection and lightning-fast connection experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;