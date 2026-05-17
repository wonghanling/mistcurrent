import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return { redirect: { destination: '/about', permanent: false } };
};

import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import SecurityFeatures from '../components/SecurityFeatures';
import Pricing from '../components/Pricing';
import PromoPopup from '../components/PromoPopup';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>第1页 - MistCurrnet |Network Cloud Acceleration Service</title>
        <meta name="description" content="MistCurrnet提供军工级加密的VPN服务，60+国家节点，10Gbps超高速连接，30天退款保证。雾中自由畅行，保护您的数字隐私。" />
        <meta name="keywords" content="VPN,加速器,翻墙,科学上网,网络安全,隐私保护,MistCurrnet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="MistCurrnet" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="MistCurrnet - 雾中自由畅行 | 军工级VPN加密服务" />
        <meta property="og:description" content="专业VPN服务提供商，军工级加密，全球60+节点，30天退款保证" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mistcurrnet.com" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:site_name" content="MistCurrnet" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MistCurrnet - 雾中自由畅行" />
        <meta name="twitter:description" content="军工级加密VPN服务，全球60+节点，30天退款保证" />
        <meta name="twitter:image" content="/twitter-image.jpg" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "MistCurrnet",
              "applicationCategory": "VPN Software",
              "description": "军工级加密VPN服务，提供安全、稳定、高速的网络加速",
              "operatingSystem": "Windows, Mac, iOS, Android, Linux",
              "offers": {
                "@type": "Offer",
                "price": "19",
                "priceCurrency": "CNY",
                "description": "基础版月付方案"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "50000"
              }
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <main>
          <Hero />
          <Features />
          
          {/* 圆形立即获取按钮 */}
          <section className="py-16 bg-white flex justify-center items-center">
            <div className="flex flex-col items-center relative">
              <div className="relative">
                <button 
                  window.location.href = '/login?next=/checkout?plan=2year'
                  className="w-24 h-24 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-all duration-300 hover:scale-110 shadow-lg border-4 border-green-500/30 flex items-center justify-center group"
                >
                  {/* 电源标志 */}
                  <div className="relative">
                    {/* 圆弧部分 */}
                    <div className="w-12 h-12 border-4 border-white border-t-transparent border-l-transparent rounded-full transform rotate-45 group-hover:rotate-90 transition-transform duration-300"></div>
                    {/* 竖线部分 */}
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-white"></div>
                  </div>
                </button>
              </div>
              
              {/* 动态向上三箭头 */}
              <div className="mt-4 flex justify-center">
                <div className="flex space-x-3">
                  <svg className="w-8 h-8 text-green-500 animate-bounce" style={{animationDelay: '0s'}} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4l8 8h-6v8h-4v-8H4l8-8z"/>
                  </svg>
                  <svg className="w-8 h-8 text-green-500 animate-bounce" style={{animationDelay: '0.2s'}} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4l8 8h-6v8h-4v-8H4l8-8z"/>
                  </svg>
                  <svg className="w-8 h-8 text-green-500 animate-bounce" style={{animationDelay: '0.4s'}} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4l8 8h-6v8h-4v-8H4l8-8z"/>
                  </svg>
                </div>
              </div>
              
              {/* 按钮说明文字 */}
              <div className="mt-4 text-center">
                <p className="text-green-600 font-semibold text-2xl">点击⏻立即获取</p>
                <p className="text-purple-500 font-bold text-xl">￥2.19/月 🔥 限时优惠 · 节省82%</p>
              </div>
            </div>
          </section>
          
          <SecurityFeatures />
          <Pricing />
        </main>

        {/* Footer */}
        <Footer />

        {/* Promotional Popup */}
        <PromoPopup />
      </div>
    </>
  );
};

export default Home;
