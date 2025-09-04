import React from 'react';

interface PricingPlan {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
  period: string;
  billingInfo: string;
  discount?: string;
  isPopular?: boolean;
  isSpecialDeal?: boolean;
  features: string[];
  buttonText: string;
  buttonStyle: 'primary' | 'secondary' | 'special';
}

const pricingPlans: PricingPlan[] = [
  {
    id: '1month',
    title: '1 Month',
    subtitle: '月套餐',
    price: '$11.99',
    period: '/月',
    billingInfo: 'Billed $11.99 every month',
    discount: 'SAVE 0%',
    features: [
      'Industry-leading Network',
      'Basic Traffic Optimization', 
      'Standard Speed Boost',
      '24/7 Customer Support',
      '30-day money-back guarantee'
    ],
    buttonText: '立即获取',
    buttonStyle: 'secondary'
  },
  {
    id: '6month',
    title: '6 Months',
    subtitle: '半年套餐',
    price: '$6.99',
    originalPrice: '$11.99',
    period: '/月',
    billingInfo: '每6个月共 $41.94',
    discount: 'SAVE 42%',
    features: [
      'Industry-leading Network',
      'Advanced Traffic Optimization',
      'Priority Speed Acceleration',
      'Multi-device Support',
      'Premium Customer Support',
      '30-day money-back guarantee'
    ],
    buttonText: '立即获取',
    buttonStyle: 'secondary'
  },
  {
    id: '12month',
    title: '12 Months',
    subtitle: '年套餐',
    price: '$5.99',
    originalPrice: '$11.99',
    period: '/月',
    billingInfo: 'Billed yearly, then renews yearly',
    discount: 'SAVE 58%',
    isPopular: true,
    features: [
      'Industry-leading Network',
      'Advanced Traffic Optimization',
      'Priority Speed Acceleration',
      'Multi-device Support',
      'Premium Customer Support',
      '30-day money-back guarantee'
    ],
    buttonText: '立即获取',
    buttonStyle: 'primary'
  },
  {
    id: '2year',
    title: '2 Years + 2 Months Free',
    subtitle: '两年套餐 + 2个月免费',
    price: '$2.19',
    originalPrice: '$11.99',
    period: '/月',
    billingInfo: '前26个月共 $52.56，之后按年续订',
    discount: 'SAVE 82%',
    isSpecialDeal: true,
    features: [
      'Industry-leading Network',
      'Premium Traffic Optimization',
      'Maximum Speed Boost',
      'Unlimited Device Support',
      'Priority Customer Support',
      'Advanced Analytics Dashboard',
      '30-day money-back guarantee'
    ],
    buttonText: '立即获取',
    buttonStyle: 'special'
  }
];

const PricingCards: React.FC = () => {
  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            <span className="whitespace-nowrap">Special Deal: 最优惠的套餐</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Your network acceleration protected from <span className="text-green-600 font-semibold">$2.19 a month</span>
          </p>
          <div className="inline-block bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium">
            Discount applied: SPECIALDEAL
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-4 bg-white p-8 w-full transition-all hover:shadow-lg ${
                plan.isSpecialDeal
                  ? 'border-green-500 shadow-lg transform scale-105'
                  : plan.isPopular
                  ? 'border-blue-500 shadow-md'
                  : 'border-yellow-500'
              }`}
            >
              {/* Discount Badge */}
              {plan.discount && (
                <div className="absolute -top-3 left-4 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                  {plan.discount}
                </div>
              )}

              {/* Special Deal Badge */}
              {plan.isSpecialDeal && (
                <div className="absolute -top-3 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  SAVE 70% 节省 70%
                </div>
              )}

              {/* Plan Title */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {plan.title}
                </h3>
                <p className="text-gray-600">{plan.subtitle}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-xl text-gray-500 ml-1">
                    {plan.period}
                  </span>
                  {plan.originalPrice && (
                    <span className="text-lg text-gray-400 line-through ml-2">
                      {plan.originalPrice}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{plan.billingInfo}</p>
              </div>

              {/* Action Button */}
              <div className="mb-8">
                <button
                  onClick={() => window.location.href = `/checkout?plan=${plan.id}`}
                  className={`w-full py-3 px-6 rounded-full font-medium text-sm transition-colors ${
                    plan.buttonStyle === 'special'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : plan.buttonStyle === 'primary'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border-2 border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>

              {/* Money-back Guarantee */}
              <div className="flex items-center justify-center mb-6 text-sm text-gray-500">
                <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                30-day money-back guarantee
                <br />
                30 天退款保证
              </div>

              {/* Features */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">What you will get 您将得到什么</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Notice */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>所有套餐均包含 30 天退款保证 | All plans include 30-day money-back guarantee</p>
        </div>
      </div>
    </div>
  );
};

export default PricingCards;