import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser, signOut } from '../lib/supabase';
import { OrderService } from '../utils/orderService';
import { VpnService } from '../utils/vpnService';

// TypeScript 类型定义
interface Subscription {
  id: string;
  planName: string;
  status: string;
  start_date?: string;
  end_date?: string;
  expiryDate?: string;
  startDate?: string;
  price: string;
  daysLeft?: number;
  bandwidth_limit?: string;
  devices_limit?: number;
  devicesAllowed?: number;
  vpn_config_url?: string;
}

interface Order {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  plan_name: string;
}

interface UsageStats {
  dataUsed?: string;
  connectTime?: string;
  devicesConnected?: number;
  lastConnection?: string;
  totalTraffic?: number;
  monthlyTraffic?: number;
  connectedDevices?: number;
}

interface ServerInfo {
  id: string;
  name: string;
  location: string;
  latency: number;
  status: string;
}

export const useAccount = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [serverList, setServerList] = useState<ServerInfo[]>([]);

  useEffect(() => {
    initializeAccount();
  }, []);

  const initializeAccount = async () => {
    try {
      setLoading(true);
      
      // 获取用户信息
      await loadUserInfo();
      
      // 加载订阅数据
      await loadSubscriptions();
      
      // 加载订单历史
      await loadOrders();
      
      // 加载使用统计
      await loadUsageStats();
      
      // 加载服务器列表
      await loadServerList();
      
    } catch (error) {
      console.error('Error initializing account:', error);
      setMessage('加载账户信息时出错');
    } finally {
      setLoading(false);
    }
  };

  const loadUserInfo = async (): Promise<void> => {
    const { user } = await getCurrentUser();
    if (user && user.email) {
      setUser(user);
      setUserEmail(user.email);
    } else {
      // 尝试从URL参数获取邮箱
      const params = new URLSearchParams(window.location.search);
      const email = params.get('email') || localStorage.getItem('userEmail');
      if (email) {
        setUserEmail(email);
      }
    }
  };

  const loadSubscriptions = async (): Promise<void> => {
    if (!userEmail) return;
    
    try {
      const result = await OrderService.getUserSubscriptions(userEmail);
      if (result.success) {
        setSubscriptions(result.data || []);
      } else {
        // 如果数据库查询失败，使用模拟数据
        setSubscriptions([
          {
            id: 'sub_001',
            planName: '12个月VPN套餐',
            status: 'active',
            start_date: '2025-01-15',
            end_date: '2026-01-15',
            price: '$71.88',
            daysLeft: calculateDaysLeft('2026-01-15'),
            bandwidth_limit: 'unlimited',
            devices_limit: 5,
            vpn_config_url: VpnService.generateConfigDownloadUrl(userEmail, 'sub_001')
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    }
  };

  const loadOrders = async (): Promise<void> => {
    if (!userEmail) return;
    
    try {
      const result = await OrderService.getUserOrders(userEmail);
      if (result.success) {
        setOrders(result.data || []);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadUsageStats = async (): Promise<void> => {
    if (subscriptions.length > 0) {
      try {
        const result = await VpnService.getUsageStats(userEmail, subscriptions[0].id);
        if (result.success && result.stats) {
          setUsageStats(result.stats);
        }
      } catch (error) {
        console.error('Error loading usage stats:', error);
      }
    }
  };

  const loadServerList = async (): Promise<void> => {
    if (subscriptions.length > 0) {
      try {
        const result = await VpnService.getServerList(subscriptions[0].id);
        if (result.success && result.servers) {
          setServerList(result.servers);
        }
      } catch (error) {
        console.error('Error loading server list:', error);
      }
    }
  };

  const calculateDaysLeft = (endDate: string): number => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const downloadConfig = async (subscription: Subscription, configType: string = 'ovpn'): Promise<void> => {
    try {
      let configContent;
      
      if (configType === 'ovpn') {
        configContent = VpnService.generateOpenVPNConfig(userEmail, subscription.id);
      } else if (configType === 'wg') {
        configContent = VpnService.generateWireGuardConfig(userEmail, subscription.id);
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
    }
  };

  const copySubscriptionUrl = async (subscription: Subscription): Promise<void> => {
    try {
      const subscriptionUrl = VpnService.generateSubscriptionUrl(
        userEmail, 
        subscription.id, 
        subscription.planName
      );
      
      if (subscriptionUrl) {
        await navigator.clipboard.writeText(subscriptionUrl);
        setMessage('订阅链接已复制到剪贴板！');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error copying subscription URL:', error);
      setMessage('复制失败，请手动复制');
    }
  };

  const renewSubscription = (subscription: Subscription): void => {
    // 跳转到续费页面
    router.push(`/checkout?renew=${subscription.id}&plan=${subscription.planName}`);
  };

  const cancelSubscription = async (subscription: Subscription): Promise<void> => {
    if (window.confirm('确定要取消这个订阅吗？')) {
      try {
        const result = await VpnService.deactivateSubscription(userEmail, subscription.id);
        if (result.success) {
          // 更新本地状态
          setSubscriptions(prev => 
            prev.map(sub => 
              sub.id === subscription.id 
                ? { ...sub, status: 'cancelled' } 
                : sub
            )
          );
          setMessage('订阅已取消');
        } else {
          setMessage('取消订阅失败');
        }
      } catch (error) {
        console.error('Error cancelling subscription:', error);
        setMessage('取消订阅时出错');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem('userEmail');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      setMessage('退出登录失败');
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'expired': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'active': return '活跃';
      case 'expired': return '已过期';
      case 'cancelled': return '已取消';
      default: return '未知';
    }
  };

  const refreshData = async (): Promise<void> => {
    await initializeAccount();
    setMessage('数据已刷新');
    setTimeout(() => setMessage(''), 2000);
  };

  return {
    // 状态
    user,
    userEmail,
    subscriptions,
    orders,
    loading,
    message,
    usageStats,
    serverList,
    
    // 设置状态
    setMessage,
    
    // 业务方法
    downloadConfig,
    copySubscriptionUrl,
    renewSubscription,
    cancelSubscription,
    handleLogout,
    refreshData,
    
    // 工具方法
    calculateDaysLeft,
    getStatusColor,
    getStatusText,
    
    // 导航方法
    goHome: () => router.push('/'),
    goToCheckout: () => router.push('/checkout'),
    goToSupport: () => window.open('mailto:support@mistcurrent.com', '_blank')
  };
};