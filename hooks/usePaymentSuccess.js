import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signUp, signIn, getCurrentUser } from '../lib/supabase';
import { VpnService } from '../utils/vpnService';

// 套餐配置映射 - 测试价格 $0.01
const PLAN_CONFIG = {
  '1month': { 
    name: '1个月套餐', 
    price: 0.1, 
    duration: 1,
    displayName: '1-Month VPN Plan'
  },
  '6month': { 
    name: '6个月套餐', 
    price: 0.1, 
    duration: 6,
    displayName: '6-Month VPN Plan' 
  },
  '12month': { 
    name: '12个月套餐', 
    price: 0.1, 
    duration: 12,
    displayName: '12-Month VPN Plan'
  },
  '2year': { 
    name: '2年+2个月免费', 
    price: 0.1, 
    duration: 26,
    displayName: '2-Year + 2 Months Free VPN Plan'
  }
};

export const usePaymentSuccess = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [showAuthCard, setShowAuthCard] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [vpnSubscriptionUrl, setVpnSubscriptionUrl] = useState('');
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    checkUser();
    loadOrderData();
  }, []);

  const checkUser = async () => {
    const { user } = await getCurrentUser();
    if (user) {
      setUser(user);
      setUserEmail(user.email);
      generateVpnSubscriptionUrl(user.email);
    }
  };

  const loadOrderData = () => {
    // 从URL参数或localStorage获取订单数据
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order_id');
    const planType = params.get('plan') || '12month'; // 默认12个月套餐
    
    // 从套餐配置中获取详细信息
    const planConfig = PLAN_CONFIG[planType] || PLAN_CONFIG['12month'];
    
    // 计算到期日期
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + planConfig.duration);
    
    if (orderId || planType) {
      setOrderData({
        id: orderId || `order_${planType}_${Date.now()}`,
        plan: planType,
        planName: planConfig.displayName,
        planNameCN: planConfig.name,
        price: `$${planConfig.price}`,
        duration: planConfig.duration,
        status: 'paid',
        purchaseDate: startDate.toISOString(),
        startDate: startDate.toISOString(), 
        expiryDate: expiryDate.toISOString()
      });
    }
  };

  const generateVpnSubscriptionUrl = (userEmail) => {
    const baseUrl = 'https://your-vpn-provider.com/subscribe';
    const subscriptionUrl = `${baseUrl}?user=${encodeURIComponent(userEmail)}&token=${generateToken(userEmail)}`;
    setVpnSubscriptionUrl(subscriptionUrl);
  };

  const generateToken = (email) => {
    return btoa(email + Date.now()).substring(0, 32);
  };

  const handleAuth = async (e) => {
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
          setUserEmail(data.user.email);
          setShowAuthCard(false);
          generateVpnSubscriptionUrl(data.user.email);
          setMessage('Login successful!');
          // 激活VPN服务
          await activateVpnService(data.user.email);
        }
      } else {
        const { data, error } = await signUp(email, password);
        if (error) {
          setMessage(error.message);
        } else if (data.user) {
          // 检查是否需要邮箱确认
          if (data.user.email_confirmed_at) {
            // 邮箱已确认，直接登录
            setUser(data.user);
            setUserEmail(data.user.email);
            setShowAuthCard(false);
            generateVpnSubscriptionUrl(data.user.email);
            setMessage('Registration successful and logged in!');
            await activateVpnService(data.user.email);
          } else if (data.session) {
            // 如果有session但邮箱未确认，说明禁用了邮箱确认
            setUser(data.user);
            setUserEmail(data.user.email);
            setShowAuthCard(false);
            generateVpnSubscriptionUrl(data.user.email);
            setMessage('Registration successful and logged in!');
            await activateVpnService(data.user.email);
          } else {
            // 需要邮箱确认
            setMessage('Registration successful! Please check your email to verify your account.');
            setIsLogin(true);
          }
        }
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setMessage('Subscription URL copied to clipboard!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to copy. Please copy manually.');
    }
  };

  const activateVpnService = async (userEmail) => {
    try {
      // 这里调用VPN服务激活API
      console.log('Activating VPN service for:', userEmail);
      // 实际实现中应该调用后端API
    } catch (error) {
      console.error('Failed to activate VPN service:', error);
    }
  };

  const saveOrderToDatabase = async (orderInfo) => {
    try {
      // 这里保存订单到数据库
      console.log('Saving order to database:', orderInfo);
      // 实际实现中应该调用Supabase保存订单
    } catch (error) {
      console.error('Failed to save order:', error);
    }
  };

  const goHome = () => {
    router.push('/');
  };

  const downloadConfig = async (subscription, configType = 'ovpn') => {
    try {
      let configContent;
      
      if (configType === 'ovpn') {
        configContent = VpnService.generateOpenVPNConfig(userEmail || 'user@example.com', subscription?.id || 'sub_001');
      } else if (configType === 'wg') {
        configContent = VpnService.generateWireGuardConfig(userEmail || 'user@example.com', subscription?.id || 'sub_001');
      }
      
      if (configContent) {
        // 创建下载链接
        const blob = new Blob([configContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mistcurrent-${configType}.${configType === 'wg' ? 'conf' : 'ovpn'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        setMessage('配置文件下载成功！');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error downloading config:', error);
      setMessage('下载配置文件失败');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const goToAccount = () => {
    // 传递套餐信息和用户邮箱到账户页面
    const planParam = orderData?.plan || '12month';
    router.push(`/account?email=${encodeURIComponent(userEmail)}&plan=${planParam}`);
  };

  return {
    // 状态
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
    orderData,
    
    // 设置状态的方法
    setShowAuthCard,
    setIsLogin,
    setEmail,
    setPassword,
    setConfirmPassword,
    setMessage,
    
    // 业务方法
    handleAuth,
    copyToClipboard,
    activateVpnService,
    saveOrderToDatabase,
    downloadConfig,
    goHome,
    goToAccount
  };
};