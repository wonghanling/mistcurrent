import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';
import { ShieldCheckIcon, GlobeAltIcon, BoltIcon, StarIcon } from '@heroicons/react/24/outline';

const PricingPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>定价方案 - MistCurrnet VPN服务</title>
        <meta name="description" content="查看MistCurrnet VPN的所有定价方案，基础版、专业版、旗舰版，30天退款保证，支持多种支付方式。" />
        <meta name="keywords" content="VPN价格,VPN定价,VPN套餐,MistCurrnet价格,VPN订阅" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-slate-900">
        {/* Navigation */}
        <Navbar />

        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-b from-slate-900 to-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              选择最适合您的{' '}
              <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                VPN方案
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              无论您是个人用户还是企业客户，我们都有适合您的方案。所有套餐都享有30天退款保证。
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <ShieldCheckIcon className="w-8 h-8 text-sky-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">军工级加密</h3>
                <p className="text-gray-400 text-sm">AES-256 & ChaCha20</p>
              </div>
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <GlobeAltIcon className="w-8 h-8 text-sky-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">全球节点</h3>
                <p className="text-gray-400 text-sm">60+ 国家服务器</p>
              </div>
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <BoltIcon className="w-8 h-8 text-sky-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">极速连接</h3>
                <p className="text-gray-400 text-sm">10Gbps 超高带宽</p>
              </div>
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <StarIcon className="w-8 h-8 text-sky-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">服务保证</h3>
                <p className="text-gray-400 text-sm">30天退款保证</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <Pricing />

        {/* FAQ Section */}
        <section className="py-16 bg-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">常见问题</h2>
            
            <div className="space-y-6">
              <div className="bg-slate-700/30 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-3">可以随时取消订阅吗？</h3>
                <p className="text-gray-300">当然可以。您可以随时在用户面板中取消订阅，已付费用将按比例退还。我们承诺30天内无理由退款。</p>
              </div>
              
              <div className="bg-slate-700/30 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-3">支持哪些支付方式？</h3>
                <p className="text-gray-300">我们支持支付宝、微信支付、银行卡、PayPal、信用卡等多种支付方式，确保您的支付安全便捷。</p>
              </div>
              
              <div className="bg-slate-700/30 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-3">可以同时在多台设备上使用吗？</h3>
                <p className="text-gray-300">是的，根据您选择的套餐，可以同时在3-10台设备上使用。支持Windows、Mac、iOS、Android、Linux等所有主流平台。</p>
              </div>
              
              <div className="bg-slate-700/30 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-3">有流量限制吗？</h3>
                <p className="text-gray-300">所有套餐都是无流量限制的。您可以自由使用，无需担心流量用完的问题。</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default PricingPage;