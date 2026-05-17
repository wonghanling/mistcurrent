import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return { redirect: { destination: '/about', permanent: false } };
};

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// 定义类型接口
interface Subscription {
  id: string;
  planName: string;
  planType: string;
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  remainingDays: number;
  price: number;
  autoRenew: boolean;
}

interface User {
  email: string;
  isLoggedIn: boolean;
}

const Account: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [user, setUser] = useState<User>({ email: '', isLoggedIn: false });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // 计算续费日期的函数
  const calculateRenewalDate = (planId: string) => {
    const now = new Date();
    const Y0 = now.getFullYear();
    const M0 = now.getMonth() + 1;
    const day = now.getDate();
    
    let N = 0;
    switch(planId) {
      case '1month': N = 1; break;
      case '6month': N = 6; break;
      case '12month': N = 12; break;
      case '2year': N = 26; break;
      default: N = 26;
    }
    
    const Yr = Y0 + Math.floor((M0 + N - 1) / 12);
    const Mr = ((M0 + N - 1) % 12) + 1;
    
    let renewalDate = new Date(Yr, Mr - 1, day);
    
    if (renewalDate.getMonth() !== (Mr - 1)) {
      renewalDate = new Date(Yr, Mr, 0);
    }
    
    return renewalDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    // 检查是否已登录
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      loadSubscriptions(userData.email);
    } else {
      setLoading(false);
    }
  }, []);

  // 登录处理
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.email && loginForm.password) {
      const userData = { email: loginForm.email, isLoggedIn: true };
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setShowLoginForm(false);
      loadSubscriptions(loginForm.email);
    }
  };

  // 加载用户订阅信息
  const loadSubscriptions = async (email: string) => {
    try {
      // 模拟从后端API获取订阅数据
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟订阅数据
      const mockSubscriptions: Subscription[] = [
        {
          id: 'sub-001',
          planName: '2年套餐+2个月免费',
          planType: '2year',
          status: 'active',
          startDate: new Date().toISOString(),
          endDate: calculateRenewalDate('2year'),
          remainingDays: 0,
          price: 52.56,
          autoRenew: true
        }
      ];

      // 计算剩余天数
      const processedSubscriptions = mockSubscriptions.map(sub => {
        const endDate = new Date(sub.endDate);
        const today = new Date();
        const diffTime = endDate.getTime() - today.getTime();
        const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
          ...sub,
          remainingDays: Math.max(0, remainingDays),
          status: remainingDays > 0 ? 'active' as const : 'expired' as const
        };
      });

      setSubscriptions(processedSubscriptions);
    } catch (error) {
      console.error('加载订阅信息失败:', error);
      setMessage('加载订阅信息失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 下载配置文件
  const downloadConfig = (type: string, subscription: any) => {
    const config = type === 'openvpn'
      ? `# OpenVPN配置 - ${subscription.planName}\nclient\nremote vpn.mistcurrent.com 1194\nproto udp\nauth-user-pass`
      : `# WireGuard配置 - ${subscription.planName}\n[Interface]\nPrivateKey = YOUR_PRIVATE_KEY\nAddress = 10.0.0.2/24`;

    const blob = new Blob([config], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mistcurrent-${type}.${type === 'openvpn' ? 'ovpn' : 'conf'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // 复制VPN链接
  const copyVpnUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setMessage('VPN链接已复制');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('复制失败');
    }
  };

  // 退出登录
  const handleLogout = () => {
    setUser({ email: '', isLoggedIn: false });
    setSubscriptions([]);
    localStorage.removeItem('currentUser');
    setMessage('已退出登录');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>账户管理 - MistCurrent</title>
      </Head>

      {/* 顶部导航 */}
      <header className="border-b border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-black">MistCurrent</h1>
            <div className="flex items-center gap-4">
              {user.isLoggedIn && (
                <span className="text-gray-600 text-sm">{user.email}</span>
              )}
              <Link href="/" className="text-gray-500 hover:text-black">
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">

        {!user.isLoggedIn ? (
          /* 未登录状态 */
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-black mb-2">账户管理</h2>
              <p className="text-gray-600">请登录查看您的订阅信息</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-8">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="邮箱地址"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="密码"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
                >
                  登录
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* 已登录状态 */
          <div>
            {/* 用户信息 */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-black mb-1">我的账户</h2>
                <p className="text-gray-600">管理您的VPN订阅</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-black"
              >
                退出登录
              </button>
            </div>

            {/* 订阅列表 */}
            {subscriptions.length === 0 ? (
              <div className="border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-600 mb-4">暂无订阅信息</p>
                <Link
                  href="/"
                  className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
                >
                  购买套餐
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {subscriptions.map(subscription => (
                  <div key={subscription.id} className="border border-gray-200 rounded-lg p-6">
                    {/* 订阅基本信息 */}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-black">{subscription.planName}</h3>
                        <p className="text-gray-500 text-sm">订阅ID: {subscription.id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        subscription.status === 'active' ? 'bg-gray-100 text-black' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {subscription.status === 'active' ? '活跃' :
                         subscription.status === 'expired' ? '已过期' : '已取消'}
                      </span>
                    </div>

                    {/* 订阅详情 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                      <div>
                        <span className="text-gray-500">价格</span>
                        <p className="text-black font-medium">${subscription.price}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">开始日期</span>
                        <p className="text-black font-medium">{new Date(subscription.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">到期日期</span>
                        <p className="text-black font-medium">{new Date(subscription.endDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">剩余天数</span>
                        <p className="text-black font-medium">{subscription.remainingDays} 天</p>
                      </div>
                    </div>

                    {/* VPN链接 */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-black mb-2">VPN订阅链接</label>
                      <div className="flex">
                        <input
                          type="text"
                          value={`https://vpn.mistcurrent.com/subscribe?user=${user.email}&token=${btoa(subscription.id).substring(0, 32)}&plan=${subscription.planType}`}
                          readOnly
                          className="flex-1 p-3 border border-gray-300 rounded-l-lg text-sm bg-gray-50"
                        />
                        <button
                          onClick={() => copyVpnUrl(`https://vpn.mistcurrent.com/subscribe?user=${user.email}&token=${btoa(subscription.id).substring(0, 32)}&plan=${subscription.planType}`)}
                          className="bg-black text-white px-4 py-3 rounded-r-lg hover:bg-gray-800"
                        >
                          复制
                        </button>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => downloadConfig('openvpn', subscription)}
                        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm"
                      >
                        OpenVPN
                      </button>
                      <button
                        onClick={() => downloadConfig('wireguard', subscription)}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 text-sm"
                      >
                        WireGuard
                      </button>
                      <Link
                        href={`/checkout?renew=${subscription.id}`}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm"
                      >
                        续费
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 使用说明 */}
            <div className="border border-gray-200 rounded-lg p-6 mt-8">
              <h3 className="font-bold text-black mb-4">使用说明</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start">
                  <span className="text-black mr-2 flex-shrink-0">1.</span>
                  <span>复制VPN订阅链接，在支持的客户端中导入</span>
                </div>
                <div className="flex items-start">
                  <span className="text-black mr-2 flex-shrink-0">2.</span>
                  <span>或下载配置文件，手动导入到VPN客户端</span>
                </div>
                <div className="flex items-start">
                  <span className="text-black mr-2 flex-shrink-0">3.</span>
                  <span>推荐客户端：Clash、V2rayN、Shadowrocket等</span>
                </div>
                <div className="flex items-start">
                  <span className="text-black mr-2 flex-shrink-0">4.</span>
                  <span>如有问题，请联系客服：support@mistcurrent.com</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 消息提示 */}
        {message && (
          <div className="fixed bottom-6 right-6 bg-gray-100 border border-gray-300 text-gray-800 px-4 py-3 rounded-lg shadow-lg">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;