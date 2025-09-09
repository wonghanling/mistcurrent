import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShieldCheckIcon, LockClosedIcon } from '@heroicons/react/24/solid';

interface PaymentLoadingProps {
  onTimeout?: () => void;
  timeoutMs?: number;
}

const PaymentLoading: React.FC<PaymentLoadingProps> = ({ 
  onTimeout, 
  timeoutMs = 30000 
}) => {
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 点点点动画
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    // 进度条动画
    const progressInterval = setInterval(() => {
      setProgress(prev => prev >= 90 ? 90 : prev + 1);
    }, 300);

    // 超时处理
    const timeout = setTimeout(() => {
      if (onTimeout) onTimeout();
    }, timeoutMs);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, [onTimeout, timeoutMs]);

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
      {/* Background Image - 使用网站相同的保险箱背景 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/6.jpg"
          alt="安全保险箱背景"
          fill
          className="object-cover"
          style={{ objectPosition: '60% center' }}
          sizes="100vw"
          priority
          quality={100}
          unoptimized={true}
        />
        {/* 黑色半透明遮罩 */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 max-w-md mx-auto px-6 text-center">
        
        {/* 保险箱机器人 */}
        <div className="mb-8">
          {/* 机器人身体 - 保险箱风格 */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            {/* 保险箱主体 */}
            <div className="w-full h-full bg-gradient-to-b from-gray-300 to-gray-500 rounded-xl shadow-2xl border-4 border-gray-600 relative">
              
              {/* 保险箱门 */}
              <div className="absolute inset-2 bg-gradient-to-b from-gray-400 to-gray-600 rounded-lg border-2 border-gray-700">
                
                {/* 机器人眼睛 */}
                <div className="flex justify-center gap-3 mt-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" style={{ animationDelay: '0.5s' }}></div>
                </div>

                {/* 中央锁 */}
                <div className="flex justify-center mt-3">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center animate-spin">
                    <LockClosedIcon className="w-3 h-3 text-yellow-900" />
                  </div>
                </div>

                {/* LED指示灯 */}
                <div className="flex justify-center gap-1 mt-2">
                  <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                  <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                </div>
              </div>

              {/* 保险箱手柄 */}
              <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-gray-600 rounded-r-lg animate-pulse"></div>
            </div>

            {/* 机器人天线 */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="w-1 h-6 bg-gray-600 rounded-full">
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 加载文本卡片 */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-center mb-4">
            <ShieldCheckIcon className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Security Processing</h2>
          </div>
          
          <p className="text-gray-600 mb-4">
            Securing your payment{dots}
          </p>
          
          {/* 进度条 */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* 进度条光泽效果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            {progress}% Complete
          </div>
        </div>

        {/* 安全提示 */}
        <div className="mt-6 text-center">
          <p className="text-white/80 text-sm">
            🔒 Military-grade encryption in progress...
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentLoading;