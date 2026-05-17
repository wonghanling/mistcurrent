import { GetServerSideProps } from 'next';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps = async () => {
  return { redirect: { destination: '/about', permanent: false } };
};

// 定义类型接口
interface OrderData {
  orderId: string;
  planName: string;
  price: number;
  duration: number;
  planType: string;
  formattedEndDate: string;
  remainingDays: number;
}

interface User {
  email: string;
  isLoggedIn: boolean;
}

const PaymentSuccess: React.FC = () => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [user, setUser] = useState<User>({ email: '', isLoggedIn: false });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [isRegistering, setIsRegistering] = useState(false);

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
    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id') || 'ORDER-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // 获取存储的套餐信息
    const selectedPlan = localStorage.getItem('selectedPlan') || '2year';

    // 套餐映射
    const planMap: Record<string, { name: string; price: number; duration: number }> = {
      '1month': { name: '1个月套餐', price: 11.99, duration: 1 },
      '6month': { name: '6个月套餐', price: 41.94, duration: 6 },
      '12month': { name: '12个月套餐', price: 71.88, duration: 12 },
      '2year': { name: '2年套餐+2个月免费', price: 52.56, duration: 26 }
    };

    const currentPlan = planMap[selectedPlan] || planMap['2year'];
    const endDate = calculateRenewalDate(selectedPlan);
    const today = new Date();
    const endDateObj = new Date(endDate);
    const diffTime = endDateObj.getTime() - today.getTime();
    const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const order: OrderData = {
      orderId,
      planName: currentPlan.name,
      price: currentPlan.price,
      duration: currentPlan.duration,
      planType: selectedPlan,
      formattedEndDate: endDate,
      remainingDays: Math.max(0, remainingDays)
    };

    setOrderData(order);
    setLoading(false);
  }, []);

  // 登录处理
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // 模拟登录
    if (loginForm.email && loginForm.password) {
      setUser({ email: loginForm.email, isLoggedIn: true });
      setShowLoginForm(false);
      setMessage('登录成功！现在可以下载配置文件了');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // 注册处理
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      setMessage('密码不匹配');
      return;
    }
    // 模拟注册
    if (registerForm.email && registerForm.password) {
      setUser({ email: registerForm.email, isLoggedIn: true });
      setShowLoginForm(false);
      setIsRegistering(false);
      setMessage('注册成功！现在可以下载配置文件了');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // 下载配置文件
  const downloadConfig = (type: 'openvpn' | 'wireguard') => {
    if (!user.isLoggedIn) {
      setMessage('请先登录后下载配置文件');
      setShowLoginForm(true);
      return;
    }

    const config = type === 'openvpn' 
      ? `# OpenVPN配置 - ${orderData?.planName}\nclient\nremote vpn.mistcurrent.com 1194\nproto udp\nauth-user-pass\n`
      : `# WireGuard配置 - ${orderData?.planName}\n[Interface]\nPrivateKey = YOUR_PRIVATE_KEY\nAddress = 10.0.0.2/24\n`;
    
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>支付成功 - MistCurrent</title>
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
        
        
        {/* 成功提示 */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-white text-2xl">✓</div>
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">支付成功</h2>
          <p className="text-gray-600">您的VPN服务已激活</p>
        </div>

        {/* 订单信息 */}
        {orderData && (
          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-black mb-4">订单详情</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">订单号</span>
                <span className="text-black">{orderData.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">套餐</span>
                <span className="text-black">{orderData.planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">价格</span>
                <span className="text-black">${orderData.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">到期日</span>
                <span className="text-black">{orderData.formattedEndDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">剩余天数</span>
                <span className="text-black">{orderData.remainingDays} 天</span>
              </div>
            </div>
          </div>
        )}

        {/* 消息提示 - 在剩余天数和下载配置文件之间 */}
        {message && (
          <div className="border border-gray-300 bg-white text-gray-800 px-6 py-4 rounded-lg shadow-lg mb-8 text-center">
            {message}
          </div>
        )}

        {/* 用户状态 */}
        {!user.isLoggedIn ? (
          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-black mb-4">下载配置文件</h3>
            <p className="text-gray-600 mb-4">请登录或注册账户后下载VPN配置文件</p>
            <button
              onClick={() => setShowLoginForm(true)}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
            >
              登录/注册
            </button>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-black">欢迎，{user.email}</h3>
              <button
                onClick={() => setUser({ email: '', isLoggedIn: false })}
                className="text-gray-500 hover:text-black text-sm"
              >
                退出
              </button>
            </div>
            <p className="text-gray-600 mb-4">选择配置文件类型下载</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => downloadConfig('openvpn')}
                className="border border-gray-300 py-3 rounded-lg hover:bg-gray-50 text-black"
              >
                OpenVPN
              </button>
              <button
                onClick={() => downloadConfig('wireguard')}
                className="border border-gray-300 py-3 rounded-lg hover:bg-gray-50 text-black"
              >
                WireGuard
              </button>
            </div>
          </div>
        )}

        {/* 下一步操作 */}
        <div className="text-center">
          <Link
            href="/account"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 mr-4"
          >
            管理订阅
          </Link>
          <Link
            href="/"
            className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50"
          >
            返回首页
          </Link>
        </div>
      </div>

      {/* 登录/注册模态框 */}
      {showLoginForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-black">
                {isRegistering ? '注册账户' : '登录账户'}
              </h3>
              <button
                onClick={() => setShowLoginForm(false)}
                className="text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>

            {!isRegistering ? (
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
                <p className="text-center text-sm text-gray-600">
                  还没有账户？
                  <button
                    type="button"
                    onClick={() => setIsRegistering(true)}
                    className="text-black hover:underline ml-1"
                  >
                    立即注册
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="邮箱地址"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="密码"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="确认密码"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
                >
                  注册
                </button>
                <p className="text-center text-sm text-gray-600">
                  已有账户？
                  <button
                    type="button"
                    onClick={() => setIsRegistering(false)}
                    className="text-black hover:underline ml-1"
                  >
                    立即登录
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
