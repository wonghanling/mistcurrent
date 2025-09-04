import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signUp, signIn, getCurrentUser } from '../../lib/supabase';

const PaymentSuccess: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showAuthCard, setShowAuthCard] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [vpnSubscriptionUrl, setVpnSubscriptionUrl] = useState('');

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { user } = await getCurrentUser();
    if (user) {
      setUser(user);
      generateVpnSubscriptionUrl(user.email);
    }
  };

  const generateVpnSubscriptionUrl = (userEmail: string) => {
    // 生成白标VPN节点订阅地址
    const baseUrl = 'https://your-vpn-provider.com/subscribe';
    const subscriptionUrl = `${baseUrl}?user=${encodeURIComponent(userEmail)}&token=${generateToken(userEmail)}`;
    setVpnSubscriptionUrl(subscriptionUrl);
  };

  const generateToken = (email: string) => {
    // 简单的token生成，实际应该使用更安全的方法
    return btoa(email + Date.now()).substring(0, 32);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!email || !password) {
      setMessage('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { data, error } = await signIn(email, password);
        if (error) {
          setMessage(error.message);
        } else if (data.user) {
          setUser(data.user);
          setShowAuthCard(false);
          generateVpnSubscriptionUrl(data.user.email);
          setMessage('Login successful!');
        }
      } else {
        const { data, error } = await signUp(email, password);
        if (error) {
          setMessage(error.message);
        } else if (data.user) {
          setMessage('Registration successful! Please check your email to verify your account.');
          setIsLogin(true);
        }
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setMessage('Subscription URL copied to clipboard!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to copy. Please copy manually.');
    }
  };

  return (
    <div>
      {/* 黑色顶部长条 */}
      <div className="bg-black w-full py-4">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold">MistCurrent</h1>
        </div>
      </div>
      
      {/* 支付成功页面内容 */}
      <div className="flex flex-col items-center justify-center py-8 px-4 max-w-md mx-auto">
        {/* 中间的图片 - 往上移动 */}
        <div className="mb-6 mt-8">
          <Image
            src="/41.png"
            alt="World Literacy Day"
            width={300}
            height={300}
            className="max-w-full h-auto"
          />
        </div>
        
        {/* 动态绿色打勾圆形标志 - 往上移动 */}
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
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-lg text-gray-600">Your payment has been processed successfully.</p>
        </div>

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

        {/* VPN订阅地址显示 */}
        {user && vpnSubscriptionUrl && (
          <div className="w-full mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Your VPN Subscription</h3>
            <p className="text-sm text-blue-600 mb-3">Copy this URL to your VPN client:</p>
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
                Get Your VPN Access
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
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;