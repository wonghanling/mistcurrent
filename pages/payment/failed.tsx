import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// 动态导入组件，禁用SSR
const PaymentFailedContent = dynamic(() => Promise.resolve(PaymentFailedContentComponent), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-screen">
      <div>Loading...</div>
    </div>
  )
});

const PaymentFailedContentComponent: React.FC = () => {
  const { usePaymentFailed } = require('../../hooks/usePaymentFailed');
  
  // 使用钩子获取所有状态和方法，与Airwallex集成
  const {
    orderData,
    failureReason,
    retryLoading,
    message,
    retryPayment,
    contactSupport,
    goHome,
    getFailureMessage
  } = usePaymentFailed();

  return (
    <div>
      {/* 黑色顶部长条 */}
      <div className="bg-black w-full py-4">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold">MistCurrent</h1>
        </div>
      </div>
      
      {/* Payment Failed Page Content */}
      <div className="flex flex-col items-center justify-center py-8 px-4">
        {/* Middle Image - Move Up */}
        <div className="mb-6 mt-8">
          <Image
            src="/41.png"
            alt="World Literacy Day"
            width={300}
            height={300}
            className="max-w-full h-auto"
          />
        </div>
        
        {/* Dynamic Red X Circle - Move Up */}
        <div className="relative mb-8">
          {/* 外圈动画 */}
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            {/* 内圈 */}
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              {/* X Symbol */}
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

        {/* Payment Failed English Text */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Failed!</h2>
          <p className="text-lg text-gray-600">Sorry, your payment could not be processed.</p>
        </div>

        {/* Order Information Table - Simple Black & White, Always Show in Test Mode */}
        <div className="w-full max-w-md mb-6">
          <table className="w-full border border-gray-800">
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="px-4 py-2 font-semibold text-black bg-white">Order ID</td>
                <td className="px-4 py-2 text-black bg-white">{orderData?.id || 'order_failed_001'}</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="px-4 py-2 font-semibold text-black bg-white">Plan</td>
                <td className="px-4 py-2 text-black bg-white">{orderData?.planName || '12 Month Plan'}</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="px-4 py-2 font-semibold text-black bg-white">Price</td>
                <td className="px-4 py-2 text-black bg-white">{orderData?.price || '$71.88'}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold text-black bg-white">Reason</td>
                <td className="px-4 py-2 text-black bg-white">{getFailureMessage() || 'Payment processing failed'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Button Area */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={retryPayment}
            disabled={retryLoading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {retryLoading ? 'Retrying...' : 'Retry Payment'}
          </button>
          <button
            onClick={contactSupport}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Contact Support
          </button>
        </div>

        {/* Message Area - Black & White, Always Show in Test Mode */}
        <div className="w-full max-w-md mb-4 p-3 border border-gray-800 bg-white text-black text-center">
          {message || 'Ready to retry payment or contact support'}
        </div>

        {/* Return Button */}
        <button
          onClick={goHome}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

const PaymentFailed: React.FC = () => {
  return <PaymentFailedContent />;
};

export default PaymentFailed;

// 阻止静态预渲染，解决SSR构建错误
export async function getServerSideProps() {
  return { props: {} };
}