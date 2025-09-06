import React from 'react';
import PaymentLoading from '../components/PaymentLoading';

const LoadingTest: React.FC = () => {
  const handleTimeout = () => {
    alert('支付超时！将跳转到失败页面');
    // 实际使用时这里应该跳转到支付失败页面
  };

  return <PaymentLoading onTimeout={handleTimeout} timeoutMs={30000} />;
};

export default LoadingTest;