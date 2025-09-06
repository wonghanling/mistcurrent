import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// 动态导入组件，禁用SSR
const AccountManagementContent = dynamic(() => Promise.resolve(AccountManagementContentComponent), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-screen">
      <div>Loading...</div>
    </div>
  )
});

const AccountManagementContentComponent: React.FC = () => {
  const { useRouter } = require('next/router');
  const { DocumentDuplicateIcon } = require('@heroicons/react/24/solid');
  const { useAccount } = require('../hooks/useAccount');
  
  // 使用钩子获取所有状态和方法
  const {
    user,
    userEmail,
    subscriptions,
    orders,
    loading,
    message,
    usageStats,
    serverList,
    setMessage,
    downloadConfig,
    copySubscriptionUrl,
    renewSubscription,
    cancelSubscription,
    handleLogout,
    refreshData,
    calculateDaysLeft,
    getStatusColor,
    getStatusText,
    goHome,
    goToCheckout,
    goToSupport
  } = useAccount();

  // 获取URL参数中的套餐信息（从支付成功页面传递）
  const router = useRouter();
  const { plan: urlPlan } = router.query;
  
  // 套餐配置类型和映射
  type PlanKey = '1month' | '6month' | '12month' | '2year';
  const PLAN_CONFIG: Record<PlanKey, { name: string; price: string; duration: number }> = {
    '1month': { name: '1-Month Network Acceleration Plan', price: '$11.99', duration: 1 },
    '6month': { name: '6-Month Network Acceleration Plan', price: '$41.94', duration: 6 },
    '12month': { name: '12-Month Network Acceleration Plan', price: '$71.88', duration: 12 },
    '2year': { name: '2-Year + 2 Months Free Plan', price: '$52.56', duration: 26 }
  };
  
  // 根据URL参数或默认使用12月套餐
  const planKey = (urlPlan as PlanKey) || '12month';
  const selectedPlan = PLAN_CONFIG[planKey] || PLAN_CONFIG['12month'];
  
  // 动态生成订阅数据
  const currentDate = new Date();
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + selectedPlan.duration);

  // 测试模式：模拟订阅数据
  const currentSubscription = subscriptions[0] || {
    id: `sub_${planKey}_001`,
    planName: selectedPlan.name,
    startDate: currentDate.toISOString().split('T')[0],
    expiryDate: expiryDate.toISOString().split('T')[0],
    price: selectedPlan.price,
    status: 'active',
    devicesAllowed: 5
  };

  const daysLeft = currentSubscription.expiryDate 
    ? calculateDaysLeft(currentSubscription.expiryDate) 
    : 345;

  return (
    <>
      <Head>
        <title>Account Management - MistCurrent Network Acceleration</title>
        <meta name="description" content="Manage your network acceleration subscription and download configurations" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Black Top Bar */}
        <div className="bg-black w-full py-4">
          <div className="text-center">
            <h1 className="text-white text-2xl font-bold">MistCurrent</h1>
          </div>
        </div>
        
        {/* Page Content Area */}
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          
          {/* Simple Black & White List - Current Subscription Summary */}
          <div className="mb-8">
            <div className="bg-white border border-gray-800">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-800">
                    <td className="px-4 py-3 font-semibold text-black">Current Subscription</td>
                    <td className="px-4 py-3 text-black">{currentSubscription.planName}</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="px-4 py-3 font-semibold text-black">Days Left</td>
                    <td className="px-4 py-3 text-black">{daysLeft} days</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-black">Device Limit</td>
                    <td className="px-4 py-3 text-black">Up to {currentSubscription.devicesAllowed} devices</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Subscription Details Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Subscription Details</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subscription ID:</span>
                <span className="font-mono text-sm text-gray-800">{currentSubscription.id}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Start Date:</span>
                <span className="text-gray-800">{currentSubscription.startDate ? new Date(currentSubscription.startDate).toLocaleDateString() : 'N/A'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Expiry Date:</span>
                <span className="text-gray-800">{currentSubscription.expiryDate ? new Date(currentSubscription.expiryDate).toLocaleDateString() : 'N/A'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Price:</span>
                <span className="font-bold text-gray-800">{currentSubscription.price}</span>
              </div>
            </div>

            {/* Marketing Copy */}
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="font-semibold text-gray-800">Military Grade Encryption</div>
                  <div className="text-gray-600">Military Grade</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Global Network</div>
                  <div className="text-gray-600">Global Servers</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">High Speed Connection</div>
                  <div className="text-gray-600">High Speed</div>
                </div>
              </div>
            </div>

            {/* 复制链接按钮 */}
            <button
              onClick={() => copySubscriptionUrl(currentSubscription)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mb-4"
            >
              <DocumentDuplicateIcon className="w-5 h-5" />
              Copy Subscription Link
            </button>

            {/* Subscription Management Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => renewSubscription(currentSubscription)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Renew Subscription
              </button>
              <button
                onClick={() => cancelSubscription(currentSubscription)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Cancel Subscription
              </button>
            </div>
          </div>

          {/* App Icons Area */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="w-20 h-20 mb-4 mx-auto">
                <Image
                  src="/45.png"
                  alt="iOS App"
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors">
                In Development
              </button>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mb-4 mx-auto">
                <Image
                  src="/46.png"
                  alt="Android App"
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors">
                In Development
              </button>
            </div>
          </div>

          {/* Message Alert */}
          {message && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {message}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

const AccountManagement: React.FC = () => {
  return <AccountManagementContent />;
};

export default AccountManagement;

// 阻止静态预渲染，解决SSR构建错误
export async function getServerSideProps() {
  return { props: {} };
}