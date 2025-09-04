'use client'

import Image from 'next/image'
import { ShieldCheckIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const SecurityFeatures = () => {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: "数据加密隧道，打造隐身护盾",
      description: "不留痕迹地穿梭互联网，再也不用担心个人信息泄露。"
    },
    {
      icon: EyeSlashIcon,
      title: "拒绝跟踪，隐私至上",
      description: "防止广告追踪、政府审查与第三方监控，为自由发声护航。"
    },
    {
      icon: LockClosedIcon,
      title: "你的数据，只属于你",
      description: "为你的信息加上看不见的\"安全罩\""
    }
  ]

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/27 [转换].jpg"
          alt="全球网络背景"
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
                src="/26 [转换].jpg"
                alt="数据安全保护"
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
                全方位安全防护
                <span className="block text-2xl md:text-3xl lg:text-4xl text-black mt-2">
                  守护您的数字隐私
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
                <span className="text-blue-600">🛡️</span> 军用级加密 • 零日志政策 • 全球服务器节点
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SecurityFeatures