import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import PaymentLoading from '../components/PaymentLoading';

const LoadingTest: React.FC = () => {
  const router = useRouter();
  const { order_id, payment_intent_id } = router.query;
  
  useEffect(() => {
    // 模拟Airwallex订单处理时间 (3-5秒)
    if (order_id && payment_intent_id) {
      const processingTime = 3000 + Math.random() * 2000; // 3-5秒随机
      
      const timer = setTimeout(() => {
        // 跳转到支付成功页面
        window.location.href = `/payment/success?order_id=${order_id}&payment_intent_id=${payment_intent_id}`;
      }, processingTime);
      
      return () => clearTimeout(timer);
    }
  }, [order_id, payment_intent_id]);

  const handleTimeout = () => {
    // 超时跳转到失败页面
    window.location.href = `/payment/failed?error=timeout`;
  };

  return <PaymentLoading onTimeout={handleTimeout} timeoutMs={30000} />;
};

export default LoadingTest;

// 阻止静态预渲染，解决SSR构建错误
export async function getServerSideProps() {
  return { props: {} };
}