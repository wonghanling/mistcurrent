import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// TypeScript 类型定义
interface OrderData {
  id: string;
  planName: string;
  price: string;
  status: string;
  failureDate?: string;
  failureTime?: string;
  reason?: string;
}

export const usePaymentFailed = () => {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [failureReason, setFailureReason] = useState<string>('');
  const [retryLoading, setRetryLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    loadFailedOrderData();
  }, []);

  const loadFailedOrderData = (): void => {
    // 从URL参数获取失败订单数据
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order_id');
    const planName = params.get('plan');
    const price = params.get('price');
    const reason = params.get('reason') || 'Payment processing failed';
    
    setFailureReason(reason);
    
    if (orderId) {
      setOrderData({
        id: orderId,
        planName: planName || '12-Month Network Acceleration Plan',
        price: price || '$71.88',
        status: 'failed',
        failureTime: new Date().toISOString(),
        reason: reason
      });
    }
  };

  const retryPayment = async (): Promise<void> => {
    setRetryLoading(true);
    try {
      // 直接跳转到 checkout 页面重试支付
      router.push('http://localhost:3000/checkout');
    } catch (error) {
      setMessage('Retry failed, please try again later');
      console.error('Retry payment error:', error);
    } finally {
      setRetryLoading(false);
    }
  };

  const contactSupport = (): void => {
    // 可以跳转到客服页面或者打开邮件客户端
    const supportEmail = 'support@mistcurrent.com';
    const subject = encodeURIComponent(`Payment Failed Support - Order ID: ${orderData?.id || 'N/A'}`);
    const body = encodeURIComponent(`
Order Information:
- Order ID: ${orderData?.id || 'N/A'}
- Plan: ${orderData?.planName || 'N/A'}
- Amount: ${orderData?.price || 'N/A'}
- Failure Reason: ${failureReason}
- Failure Time: ${orderData?.failureTime ? new Date(orderData.failureTime).toLocaleString() : 'N/A'}

Please help with payment issues.
    `);
    
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
  };

  const saveFailedOrderToDatabase = async (orderInfo: OrderData): Promise<void> => {
    try {
      // 保存失败订单到数据库，用于后续分析
      console.log('Saving failed order to database:', orderInfo);
      // 实际实现中应该调用后端API保存失败记录
    } catch (error) {
      console.error('Failed to save failed order:', error);
    }
  };

  const goHome = (): void => {
    router.push('/');
  };

  const goBack = (): void => {
    router.back();
  };

  const viewPlans = (): void => {
    router.push('/checkout');
  };

  // 获取常见失败原因的用户友好说明
  const getFailureMessage = (): string => {
    const reasonMap: Record<string, string> = {
      'card_declined': 'Your card was declined. Please check card details or contact your bank',
      'insufficient_funds': 'Insufficient funds. Please ensure you have enough balance',
      'expired_card': 'Card has expired. Please use a valid card',
      'invalid_card': 'Invalid card information. Please check card number, expiry date and CVV',
      'processing_error': 'Payment processing error. Please try again later',
      'network_error': 'Network connection issue. Please check your network and try again',
      'timeout': 'Payment timeout. Please try again',
      'cancelled': 'Payment was cancelled',
      'default': 'Payment processing failed, please retry or contact support'
    };

    return reasonMap[failureReason] || reasonMap['default'];
  };

  return {
    // 状态
    orderData,
    failureReason,
    retryLoading,
    message,
    
    // 设置状态的方法  
    setMessage,
    
    // 业务方法
    retryPayment,
    contactSupport,
    saveFailedOrderToDatabase,
    goHome,
    goBack,
    viewPlans,
    getFailureMessage
  };
};