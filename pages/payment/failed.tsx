import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

const PaymentFailed: React.FC = () => {
  const router = useRouter();

  return (
    <div>
      {/* 黑色顶部长条 */}
      <div className="bg-black w-full py-4">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold">MistCurrent</h1>
        </div>
      </div>
      
      {/* 支付失败页面内容 */}
      <div className="flex flex-col items-center justify-center py-8 px-4">
        {/* 中间的图片 - 往上移动 */}
        <div className="mb-6 mt-8">
          <Image
            src="/41.png"
            alt="World Literacy Day"
            width={300}
            height={300}
            className="max-w-full h-auto"
          />
        </div>
        
        {/* 动态红色×号圆形标志 - 往上移动 */}
        <div className="relative mb-8">
          {/* 外圈动画 */}
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            {/* 内圈 */}
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              {/* ×号符号 */}
              <svg 
                className="w-10 h-10 text-white animate-bounce" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          
          {/* 外围光圈动画 */}
          <div className="absolute inset-0 w-20 h-20 bg-red-400 rounded-full animate-ping opacity-30"></div>
        </div>

        {/* 支付失败英文文本 */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Failed!</h2>
          <p className="text-lg text-gray-600">Sorry, your payment could not be processed.</p>
        </div>

        {/* 返回按钮 */}
        <button
          onClick={() => router.push('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentFailed;