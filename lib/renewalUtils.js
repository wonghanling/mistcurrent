// 续费日期计算工具函数

export const calculateRenewalDate = (planId) => {
  const now = new Date();
  const Y0 = now.getFullYear();
  const M0 = now.getMonth() + 1; // JavaScript月份从0开始，需要+1
  const day = now.getDate();
  
  // 根据套餐ID确定月数
  let N = 0;
  switch(planId) {
    case '1month':
      N = 1;
      break;
    case '6month':
      N = 6;
      break;
    case '12month':
      N = 12;
      break;
    case '2year':
      N = 26; // 2年+2个月免费 = 26个月
      break;
    default:
      N = 26; // 默认2年套餐
  }
  
  // 计算续费年月
  const Yr = Y0 + Math.floor((M0 + N - 1) / 12);
  const Mr = ((M0 + N - 1) % 12) + 1;
  
  // 创建续费日期对象
  let renewalDate = new Date(Yr, Mr - 1, day);
  
  // 处理特殊情况：如果目标月份没有对应的日期（比如2月30日）
  // 则设置为该月的最后一天
  if (renewalDate.getMonth() !== (Mr - 1)) {
    renewalDate = new Date(Yr, Mr, 0); // 设置为Mr月的前一天，即Mr-1月的最后一天
  }
  
  return renewalDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 计算剩余天数
export const calculateRemainingDays = (endDate) => {
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// 格式化日期为中文
export const formatDateToChinese = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 判断订阅状态
export const getSubscriptionStatus = (endDate) => {
  const remainingDays = calculateRemainingDays(endDate);
  if (remainingDays > 30) return 'active';
  if (remainingDays > 0) return 'expiring';
  return 'expired';
};

// 获取套餐信息
export const getPlanInfo = (planId) => {
  const plans = {
    '1month': {
      name: '1个月套餐',
      duration: 1,
      price: 11.99,
      originalPrice: 11.99,
      discount: 0
    },
    '6month': {
      name: '6个月套餐',
      duration: 6,
      price: 41.94,
      originalPrice: 71.94,
      discount: 42
    },
    '12month': {
      name: '12个月套餐',
      duration: 12,
      price: 71.88,
      originalPrice: 143.88,
      discount: 50
    },
    '2year': {
      name: '2年套餐+2个月免费',
      duration: 26,
      price: 52.56,
      originalPrice: 311.74,
      discount: 82
    }
  };
  
  return plans[planId] || plans['2year'];
};