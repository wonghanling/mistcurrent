import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return { redirect: { destination: '/about', permanent: false } };
};

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const LoadingTest: React.FC = () => {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('初始化支付');

  useEffect(() => {
    const stages = [
      '初始化支付',
      '连接支付网关',
      '验证支付信息',
      '处理交易',
      '确认支付结果',
      '激活服务',
      '完成'
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            router.push('/payment/success?order_id=TEST_ORDER_123&test=true');
          }, 1000);
          return 100;
        }
        
        const stageIndex = Math.floor((newProgress / 100) * stages.length);
        if (stageIndex < stages.length) {
          setStage(stages[stageIndex]);
        }
        
        return newProgress;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Head>
        <title>支付处理中 - MistCurrent</title>
      </Head>

      <div className="w-full max-w-sm mx-4">
        
        {/* 品牌标识 */}
        <div className="text-center mb-16">
          <h1 className="text-2xl font-bold text-black mb-3">MistCurrent</h1>
          <div className="w-12 h-0.5 bg-black mx-auto mb-6"></div>
          <p className="text-gray-500 text-sm">正在处理您的支付</p>
        </div>

        {/* 机器动画 */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            {/* 保险箱风格的机器人头部 */}
            <div className="absolute inset-2">
              {/* 主体方形框 - 像保险箱 */}
              <div className="w-16 h-16 bg-white border-2 border-black rounded-lg shadow-lg relative animate-pulse">
                
                {/* 圆形"眼睛"密码锁风格 */}
                <div className="absolute top-3 left-3">
                  <div className="w-3 h-3 border-2 border-black rounded-full bg-white animate-spin"></div>
                  <div className="absolute inset-0.5 w-2 h-2 bg-black rounded-full animate-pulse delay-200"></div>
                </div>
                
                <div className="absolute top-3 right-3">
                  <div className="w-3 h-3 border-2 border-black rounded-full bg-white animate-spin delay-500"></div>
                  <div className="absolute inset-0.5 w-2 h-2 bg-black rounded-full animate-pulse delay-700"></div>
                </div>
                
                {/* 方形"嘴巴"像保险箱门把手 */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                  <div className="w-4 h-1 bg-black rounded animate-pulse delay-300"></div>
                </div>
                
                {/* 侧面装饰线 */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-black"></div>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black"></div>
                <div className="absolute top-0 left-0 w-0.5 h-full bg-black"></div>
                <div className="absolute top-0 right-0 w-0.5 h-full bg-black"></div>
                
              </div>
              
              {/* 顶部天线指示器 */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div className="w-1 h-2 bg-black"></div>
                <div className="w-2 h-2 border border-black rounded-full bg-white animate-ping delay-1000"></div>
              </div>
              
            </div>
          </div>
        </div>

        {/* 状态信息 */}
        <div className="text-center mb-10">
          <h2 className="text-lg font-medium text-black mb-2">处理中</h2>
          <p className="text-gray-500 text-sm">{stage}</p>
        </div>

        {/* 进度条 */}
        <div className="mb-12">
          <div className="flex justify-between text-xs text-gray-400 mb-3">
            <span>进度</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-0.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 安全提示 */}
        <div className="border border-gray-200 rounded p-4 mb-8">
          <div className="flex items-start">
            <div className="w-3 h-3 bg-black rounded-full flex-shrink-0 mt-1"></div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">您的支付信息已加密保护</p>
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-4">请勿关闭此页面</p>
          <button
            onClick={() => router.push('/login?next=/checkout')}
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            取消
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoadingTest;
