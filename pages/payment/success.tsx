import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// 动态导入组件，禁用SSR
const PaymentSuccessContent = dynamic(() => Promise.resolve(PaymentSuccessContentComponent), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-screen">
      <div>Loading...</div>
    </div>
  )
});

const PaymentSuccessContentComponent: React.FC = () => {
  const { useRouter } = require('next/router');
  const { CheckCircleIcon, DocumentDuplicateIcon } = require('@heroicons/react/24/solid');
  const { usePaymentSuccess } = require('../../hooks/usePaymentSuccess');
  
  const router = useRouter();
  
  // 使用钩子获取所有状态和方法，测试模式下直接显示内容
  const { 
    orderData, 
    downloadConfig, 
    goToAccount, 
    user,
    userEmail,
    showAuthCard,
    isLogin,
    email,
    password,
    confirmPassword,
    loading,
    message,
    vpnSubscriptionUrl,
    setShowAuthCard,
    setIsLogin,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleAuth,
    copyToClipboard
  } = usePaymentSuccess();

  // 动态订单数据：优先使用URL参数传递的真实数据
  const displayOrderData = orderData || {
    id: 'order_demo_001',
    plan: '12month',
    planName: '12-Month VPN Plan',
    planNameCN: '12个月套餐',
    price: '$71.88',
    duration: 12,
    status: 'paid',
    customerEmail: 'test@example.com',
    startDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 365*24*60*60*1000).toISOString() // 12个月后
  };

  // 测试模式：直接显示VPN订阅URL
  const testVpnUrl = vpnSubscriptionUrl || `https://mistcurrent.com/subscribe?token=${btoa('test@example.com').substring(0, 16)}&user=test`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 黑色顶部长条 */}
      <div className="bg-black w-full py-4">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold">MistCurrent</h1>
        </div>
      </div>
      
      {/* 主要内容区域 - 桌面端左右布局 */}
      <div className="flex flex-col lg:flex-row lg:max-w-6xl lg:mx-auto">
        {/* 左侧 - 成功信息和动画 */}
        <div className="w-full lg:w-2/5 flex flex-col items-center justify-center py-8 px-4 lg:px-6">
          {/* 中间的图片 */}
          <div className="mb-6">
            <Image
              src="/41.png"
              alt="World Literacy Day"
              width={300}
              height={300}
              className="max-w-full h-auto"
            />
          </div>
          
          {/* 动态绿色打勾圆形标志 */}
          <div className="relative mb-8">
            {/* 外圈动画 */}
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
              {/* 内圈 */}
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                {/* 打勾符号 */}
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            
            {/* 外围光圈动画 */}
            <div className="absolute inset-0 w-20 h-20 bg-green-400 rounded-full animate-ping opacity-30"></div>
          </div>

          {/* 支付成功英文文本 */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-lg text-gray-600">Your payment has been processed successfully.</p>
          </div>
        </div>

        {/* Right Side - Order Details and Features */}
        <div className="w-full lg:w-3/5 flex flex-col py-8 px-4 lg:px-6 lg:pl-8 overflow-y-auto">
          <div className="max-w-md">
            {/* 消息显示 */}
            {message && (
              <div className={`mb-4 p-3 rounded-lg text-center w-full ${
                message.includes('successful') || message.includes('copied') 
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}>
                {message}
              </div>
            )}

            {/* Order Details Card */}
            <div className="w-full mb-6 bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h3>
              </div>
              
              {displayOrderData ? (
                <div className="space-y-3">
                  {/* 订单号 */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium text-gray-800">{displayOrderData.id}</span>
                  </div>
                  
                  {/* 套餐信息 */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Plan:</span>
                    <div className="text-right">
                      <div className="font-medium text-gray-800">{displayOrderData.planName}</div>
                      <div className="text-sm text-gray-500">
                        {displayOrderData.planNameCN || displayOrderData.planName}
                      </div>
                    </div>
                  </div>
                  
                  {/* 价格 */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-lg text-green-600">{displayOrderData.price}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium text-gray-800">order_12345</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Plan:</span>
                    <div className="text-right">
                      <div className="font-medium text-gray-800">12-Month Network Acceleration Plan</div>
                      <div className="text-sm text-gray-500">{new Date().toLocaleDateString('zh-CN')}</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-lg text-green-600">$71.88</span>
                  </div>
                </div>
              )}
              
              {user ? (
                // 用户已登录 - 显示操作按钮
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => downloadConfig(displayOrderData)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Download Config
                  </button>
                  <button
                    onClick={goToAccount}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Manage Subscription
                  </button>
                </div>
              ) : (
                // 用户未登录 - 显示提示
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700 text-center">
                    Login to download configuration files and get access
                  </p>
                </div>
              )}
            </div>

            {/* VPN订阅地址显示 */}
            {user && vpnSubscriptionUrl && (
              <div className="w-full mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Your Network Acceleration Service</h3>
                <p className="text-sm text-blue-600 mb-3">Copy this URL to your network acceleration client:</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={vpnSubscriptionUrl}
                    readOnly
                    className="flex-1 p-2 border border-blue-300 rounded text-sm font-mono bg-white"
                  />
                  <button
                    onClick={() => copyToClipboard(vpnSubscriptionUrl)}
                    className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            {/* 登录/注册卡片 */}
            {!user && (
              <div className="w-full mb-6">
                {!showAuthCard ? (
                  <button
                    onClick={() => setShowAuthCard(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    Get Your Network Access
                  </button>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                    <div className="flex mb-4 border-b">
                      <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 text-center ${
                          isLogin 
                            ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' 
                            : 'text-gray-500'
                        }`}
                      >
                        Login
                      </button>
                      <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 text-center ${
                          !isLogin 
                            ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' 
                            : 'text-gray-500'
                        }`}
                      >
                        Register
                      </button>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your email"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your password"
                          required
                        />
                      </div>

                      {!isLogin && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Confirm your password"
                            required
                          />
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                          loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
                      </button>
                    </form>

                    <button
                      onClick={() => setShowAuthCard(false)}
                      className="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 返回按钮 */}
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl mb-8"
            >
              Return to Home
            </button>

            {/* APP下载提示区域 */}
            <div className="w-full">
              <div className="text-center mb-4">
                <p className="text-gray-600 text-sm">Download MistCurrent Network Acceleration App</p>
              </div>
              
              <div className="flex justify-center space-x-8">
                {/* iOS App 下载区域 */}
                <div className="flex flex-col items-center">
                  <div className="mb-3 cursor-pointer">
                    <Image
                      src="/45.png"
                      alt="iOS App"
                      width={48}
                      height={48}
                      className="hover:opacity-80 transition-opacity"
                    />
                  </div>
                  <button
                    disabled
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-lg text-sm"
                  >
                    In Development
                  </button>
                </div>

                {/* Android App 下载区域 */}
                <div className="flex flex-col items-center">
                  <div className="mb-3 cursor-pointer">
                    <Image
                      src="/46.png"
                      alt="Android App"
                      width={48}
                      height={48}
                      className="hover:opacity-80 transition-opacity"
                    />
                  </div>
                  <button
                    disabled
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-lg text-sm"
                  >
                    In Development
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentSuccess: React.FC = () => {
  return <PaymentSuccessContent />;
};

export default PaymentSuccess;