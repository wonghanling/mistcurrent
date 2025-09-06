'use client'

import Image from 'next/image'
import { ShieldCheckIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const SecurityFeatures = () => {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: "Encrypted Data Tunnel, Create Invisible Shield",
      description: "Navigate the internet without leaving traces, no more worries about personal information leaks."
    },
    {
      icon: EyeSlashIcon,
      title: "Reject Tracking, Privacy First",
      description: "Prevent ad tracking, government censorship and third-party monitoring, safeguarding your freedom of speech."
    },
    {
      icon: LockClosedIcon,
      title: "Your Data, Belongs Only to You",
      description: "Add an invisible \"security shield\" to your information"
    }
  ]

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/27 [转换].jpg"
          alt="Global network background"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-white/50"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative w-full h-80 md:h-96 lg:h-[500px] rounded-2xl shadow-lg border-8 border-gray-700 overflow-hidden">
              <Image
                src="/security-shield.jpg"
                alt="Data Security Protection"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="order-1 lg:order-2 space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 leading-tight">
                Comprehensive Security Protection
                <span className="block text-2xl md:text-3xl lg:text-4xl text-black mt-2">
                  Protecting Your Digital Privacy
                </span>
              </h2>
            </div>

            {/* Features List */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-semibold text-black mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-black leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom highlight */}
            <div className="mt-8 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50">
              <p className="text-center lg:text-left text-black font-medium">
                <span className="text-blue-600">🛡️</span> Military-grade encryption • Zero-log policy • Global server nodes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SecurityFeatures