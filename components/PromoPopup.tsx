import React, { useState, useEffect } from 'react';
import { XMarkIcon, GiftIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';

interface PromoPopupProps {
  onClose?: () => void;
}

const PromoPopup: React.FC<PromoPopupProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    // Check if popup has already been shown in this session
    const popupShown = sessionStorage.getItem('promoPopupShown');
    if (popupShown) {
      setHasBeenShown(true);
      return;
    }

    // Show popup when user scrolls to bottom
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Check if user has scrolled to bottom (with 100px buffer)
      if (scrollTop + windowHeight >= documentHeight - 100 && !hasBeenShown) {
        setIsVisible(true);
        setHasBeenShown(true);
        sessionStorage.setItem('promoPopupShown', 'true');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasBeenShown]);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-3xl shadow-2xl w-80 mx-4 overflow-visible border border-gray-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 text-black hover:text-black transition-colors duration-200 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Background Effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-green-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative z-10 p-4">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-block bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
              最受欢迎
            </div>
            <h3 className="text-2xl font-bold text-black mb-2">年套餐</h3>
            <p className="text-black text-sm">🎉 限时特惠 · 立省88% · 机不可失</p>
          </div>

          {/* Offer Details */}
          <div className="bg-green-50 rounded-2xl p-6 mb-6 border-2 border-green-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-2">$5.99 <span className="text-lg text-black">/月</span></div>
              <div className="text-black line-through text-lg mb-3">原价 $11.99/月</div>
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold inline-block mb-4">
                💥 狂省 88% · 每天仅需 ¥1.14
              </div>
              <div className="mb-3">
                <button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/25 text-base"
                  onClick={() => {
                    window.location.href = '/login?next=/checkout';
                  }}
                >
                  立即抢购
                </button>
              </div>
              <div className="text-green-700 font-semibold text-sm">
                ⚡ 抢购倒计时：仅剩24小时
              </div>
            </div>
          </div>

          {/* Features Highlight */}
          <div className="space-y-1 mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-black text-xs font-medium">🌍 全球60+国家超高速节点</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-black text-xs font-medium">🛡️ 军工级AES-256加密技术</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-black text-xs font-medium">💯 顶级安全防护保障</span>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 text-black text-xs">
              <span>✅ 安全支付</span>
              <span>✅ 24/7客服</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PromoPopup;
