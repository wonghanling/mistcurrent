import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const PaymentFailed: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>支付失败 - MistCurrent</title>
      </Head>

      {/* 顶部导航 */}
      <header className="border-b border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-black">MistCurrent</h1>
            <Link href="/" className="text-gray-500 hover:text-black">
              返回首页
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        
        {/* 失败提示 */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-black text-2xl font-bold">×</div>
          </div>
          <h2 className="text-3xl font-bold text-black mb-4">支付失败</h2>
          <p className="text-gray-600 text-lg">很抱歉，您的支付未能成功完成</p>
        </div>

        {/* 可能原因 */}
        <div className="border border-gray-200 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-black mb-6">可能的原因</h3>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-start">
              <span className="text-black mr-3 flex-shrink-0 font-bold">•</span>
              <span>银行卡余额不足或被冻结</span>
            </div>
            <div className="flex items-start">
              <span className="text-black mr-3 flex-shrink-0 font-bold">•</span>
              <span>网络连接不稳定</span>
            </div>
            <div className="flex items-start">
              <span className="text-black mr-3 flex-shrink-0 font-bold">•</span>
              <span>支付信息填写错误</span>
            </div>
            <div className="flex items-start">
              <span className="text-black mr-3 flex-shrink-0 font-bold">•</span>
              <span>银行安全限制</span>
            </div>
            <div className="flex items-start">
              <span className="text-black mr-3 flex-shrink-0 font-bold">•</span>
              <span>支付处理超时</span>
            </div>
          </div>
        </div>

        {/* 解决方案 */}
        <div className="border border-gray-200 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-black mb-6">解决方案</h3>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-start">
              <span className="text-black font-bold mr-3 flex-shrink-0">1.</span>
              <span>检查银行卡信息是否正确</span>
            </div>
            <div className="flex items-start">
              <span className="text-black font-bold mr-3 flex-shrink-0">2.</span>
              <span>确认银行卡有足够余额</span>
            </div>
            <div className="flex items-start">
              <span className="text-black font-bold mr-3 flex-shrink-0">3.</span>
              <span>联系银行确认是否有限制</span>
            </div>
            <div className="flex items-start">
              <span className="text-black font-bold mr-3 flex-shrink-0">4.</span>
              <span>尝试使用其他支付方式</span>
            </div>
            <div className="flex items-start">
              <span className="text-black font-bold mr-3 flex-shrink-0">5.</span>
              <span>稍后重新尝试支付</span>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/checkout"
            className="bg-black text-white py-4 px-6 text-center rounded-lg hover:bg-gray-800 font-medium transition-colors"
          >
            重新尝试支付
          </Link>
          
          <Link
            href="/"
            className="border border-gray-300 text-gray-700 py-4 px-6 text-center rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            返回首页
          </Link>
        </div>

        {/* 客服信息 */}
        <div className="border border-gray-200 rounded-lg p-8 text-center">
          <h4 className="text-xl font-bold text-black mb-4">需要帮助？</h4>
          <p className="text-gray-600 mb-6">
            如果问题持续存在，请联系我们的客服团队
          </p>
          <div className="space-y-3 text-gray-600">
            <div className="flex justify-center items-center">
              <span className="text-black font-medium mr-2">邮箱:</span>
              <span className="font-medium">support@mistcurrent.com</span>
            </div>
            <div className="flex justify-center items-center">
              <span className="text-black font-medium mr-2">客服:</span>
              <span className="font-medium">24/7 在线服务</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentFailed;