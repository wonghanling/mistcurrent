import React, { useState } from 'react';
import { CheckIcon, SparklesIcon, StarIcon, BoltIcon } from '@heroicons/react/24/outline';

interface PricingPlan {
  name: string;
  nameEn: string;
  period: string;
  originalPrice: number;
  currentPrice: number;
  discount?: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  isRecommended?: boolean;
  badge?: string;
}

interface PricingCardProps {
  plan: PricingPlan;
  isYearly: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, isYearly }) => {
  const displayPrice = plan.currentPrice;
  const totalPrice = plan.name.includes('两年') ? 52.56 : plan.name.includes('半年') ? 41.94 : plan.currentPrice;
  
  return (
    <div
      className={`relative bg-white border-2 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 transition-all duration-300 hover:shadow-lg aspect-square flex flex-col justify-between ${
        plan.isPopular
          ? 'border-green-500 shadow-lg scale-105'
          : plan.isRecommended
          ? 'border-blue-500 shadow-lg'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Top Badge */}
      {plan.isPopular && (
        <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-green-500 text-white px-2 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold">
            Most Popular
          </div>
        </div>
      )}

      {plan.isRecommended && (
        <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-blue-500 text-white px-2 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
            {plan.discount}
          </div>
        </div>
      )}

      {/* Plan Info */}
      <div className="text-center flex-1 flex flex-col justify-center">
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-black mb-2 sm:mb-3">{plan.name}</h3>
        
        {/* Price */}
        <div className="mb-2 sm:mb-4">
          <div className="flex items-center justify-center mb-1 sm:mb-2">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-black">${displayPrice}</span>
            <span className="text-gray-600 ml-1 text-xs sm:text-sm">/month</span>
          </div>
          
          {plan.name.includes('两年') && (
            <div className="text-xs text-black px-1">
              First 26 months total ${totalPrice}, then annual renewal
            </div>
          )}
          
          {plan.name.includes('半年') && (
            <div className="text-xs text-black px-1">
              Every 6 months total ${totalPrice}
            </div>
          )}
          
          {plan.currentPrice !== plan.originalPrice && !plan.name.includes('月套餐') && (
            <div className="text-xs text-black line-through px-1">
              Original price ${plan.originalPrice}/month
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="space-y-2 sm:space-y-3">
        {/* CTA Button */}
        <button
          onClick={() => window.location.href = '/second'}
          className={`w-full py-2 sm:py-2.5 px-2 sm:px-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-xs sm:text-sm ${
            plan.isPopular
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : plan.isRecommended
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'border-2 border-gray-300 hover:border-gray-400 text-black bg-white hover:bg-gray-50'
          }`}
        >
          Get Started
        </button>

        {/* Money Back Guarantee */}
        <div className="text-center">
          <div className="flex items-center justify-center text-xs text-gray-500">
            <span className="text-red-500 mr-1">🛡</span>
            ⚡ Lightning Fast Speeds
          </div>
        </div>
      </div>
    </div>
  );
};

const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(true);

  const pricingPlans: PricingPlan[] = [
    {
      name: 'Monthly Plan',
      nameEn: '1 Month',
      period: 'month',
      originalPrice: 11.99,
      currentPrice: 11.99,
      description: '灵活选择，按月计费',
      features: [
        '全球 60+ 节点',
        '5台设备同时在线',
        'AES-256 军工级加密',
        '24/7 客服支持',
        '30天退款保证',
        '无流量限制'
      ]
    },
    {
      name: '6-Month Plan',
      nameEn: '6 Months',
      period: 'month',
      originalPrice: 11.99,
      currentPrice: 6.99,
      description: '半年优惠，性价比之选',
      features: [
        '全球 60+ 节点',
        '5台设备同时在线',
        'AES-256 军工级加密',
        '24/7 优先客服',
        '30天退款保证',
        '无流量限制',
        '专属高速线路'
      ]
    },
    {
      name: 'Annual Plan',
      nameEn: '1 Year',
      period: 'month',
      originalPrice: 11.99,
      currentPrice: 5.99,
      discount: 'Most Popular',
      description: '年付超值，节省更多',
      features: [
        '全球 100+ 节点',
        '10台设备同时在线',
        'AES-256 军工级加密',
        '智能分流技术',
        'VIP 专属客服',
        '无流量限制',
        '专用IP地址',
        '广告拦截功能'
      ],
      isPopular: true
    },
    {
      name: '2-Year Plan + 2 Months Free',
      nameEn: '2 Years + 2 Months FREE',
      period: 'month',
      originalPrice: 11.99,
      currentPrice: 2.19,
      discount: 'Best Deal - Save 82%',
      description: '26个月仅需 $52.56，平均每月 $2.19',
      features: [
        '全球 100+ 节点',
        '10台设备同时在线',
        'ChaCha20 顶级加密',
        '智能分流 + 游戏加速',
        'VIP 专属客服',
        '无流量限制',
        '专用IP地址',
        '恶意软件防护',
        '家长控制功能'
      ],
      isRecommended: true
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-sky-400 to-transparent rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-to-r from-blue-400 to-transparent rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Choose Your{' '}
            <span className="text-black">
              Subscription Plan
            </span>
          </h2>
          <p className="text-xl text-black max-w-3xl mx-auto mb-8">
            All plans include premium features and 24/7 support
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="relative max-w-7xl mx-auto">
          {/* Creative Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8 max-w-sm sm:max-w-lg md:max-w-4xl lg:max-w-7xl mx-auto">
            {/* 月套餐 - 左上角 */}
            <div className="col-span-1">
              <PricingCard plan={pricingPlans[0]} isYearly={isYearly} />
            </div>
            
            {/* 半年套餐 - 右上角，稍微向下偏移 */}
            <div className="col-span-1 lg:mt-8">
              <PricingCard plan={pricingPlans[1]} isYearly={isYearly} />
            </div>
            
            {/* 年套餐 - 左下角，稍微向上偏移 */}
            <div className="col-span-1 lg:-mt-8">
              <PricingCard plan={pricingPlans[2]} isYearly={isYearly} />
            </div>
            
            {/* 两年套餐 - 右下角 */}
            <div className="col-span-1 relative">
              <PricingCard plan={pricingPlans[3]} isYearly={isYearly} />
              {/* 吉祥物图片 */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 z-10">
                <img 
                  src="/28.jpg" 
                  alt="MistCurrent 吉祥物" 
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;