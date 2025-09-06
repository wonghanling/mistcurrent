// 信用卡类型检测和验证工具

export interface CardTypeInfo {
  type: string;
  name: string;
  icon: string;
  pattern: RegExp;
  lengths: number[];
  cvcLength: number[];
}

export const cardTypes: CardTypeInfo[] = [
  {
    type: 'visa',
    name: 'Visa',
    icon: '/206684_visa_method_card_payment_icon.png',
    pattern: /^4/,
    lengths: [13, 16, 19],
    cvcLength: [3]
  },
  {
    type: 'mastercard',
    name: 'MasterCard',
    icon: '/2629972_card_cash_checkout_credit_mastercard_icon.png',
    pattern: /^5[1-5]|^2[2-7]/,
    lengths: [16],
    cvcLength: [3]
  },
  {
    type: 'amex',
    name: 'American Express',
    icon: '/american_express_method_card_payment_icon.png',
    pattern: /^3[47]/,
    lengths: [15],
    cvcLength: [4]
  },
  {
    type: 'diners',
    name: 'Diners Club',
    icon: '/1156716_club_diners_international_icon.png',
    pattern: /^3[068]/,
    lengths: [14],
    cvcLength: [3]
  },
  {
    type: 'jcb',
    name: 'JCB',
    icon: '/358102_card_jcb_payment_icon.png',
    pattern: /^35/,
    lengths: [16],
    cvcLength: [3]
  }
];

export const detectCardType = (number: string): CardTypeInfo | null => {
  const cleanNumber = number.replace(/\s/g, '');
  
  for (const cardType of cardTypes) {
    if (cardType.pattern.test(cleanNumber)) {
      return cardType;
    }
  }
  
  return null;
};

export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\s/g, '').replace(/[^0-9]/g, '');
  
  // 限制最大长度为19位
  const limited = cleaned.substring(0, 19);
  
  // 按4位分组
  const chunks = limited.match(/.{1,4}/g) || [];
  return chunks.join(' ');
};

export const formatExpiryDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length >= 2) {
    return cleaned.substring(0, 2) + (cleaned.length > 2 ? ' / ' + cleaned.substring(2, 4) : '');
  }
  
  return cleaned;
};

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return '请输入邮箱地址';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return '请输入有效的邮箱地址';
  }
  
  return null;
};

export const validateCardNumber = (number: string): string | null => {
  const cleaned = number.replace(/\s/g, '');
  
  if (!cleaned) {
    return '请输入信用卡号';
  }
  
  if (cleaned.length < 13) {
    return '信用卡号太短';
  }
  
  if (cleaned.length > 19) {
    return '信用卡号太长';
  }
  
  const cardType = detectCardType(cleaned);
  if (!cardType) {
    return '不支持的信用卡类型';
  }
  
  if (!cardType.lengths.includes(cleaned.length)) {
    return `${cardType.name} 卡号长度不正确`;
  }
  
  // Luhn算法验证
  if (!luhnCheck(cleaned)) {
    return '信用卡号无效';
  }
  
  return null;
};

export const validateExpiryDate = (expiry: string): string | null => {
  const cleaned = expiry.replace(/\D/g, '');
  
  if (!cleaned) {
    return '请输入有效期';
  }
  
  if (cleaned.length !== 4) {
    return '请输入完整的有效期 (MM/YY)';
  }
  
  const month = parseInt(cleaned.substring(0, 2));
  const year = 2000 + parseInt(cleaned.substring(2, 4));
  
  if (month < 1 || month > 12) {
    return '月份无效';
  }
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return '信用卡已过期';
  }
  
  return null;
};

export const validateCVC = (cvc: string, cardType: CardTypeInfo | null): string | null => {
  const cleaned = cvc.replace(/\D/g, '');
  
  if (!cleaned) {
    return '请输入CVC';
  }
  
  if (!cardType) {
    return cleaned.length >= 3 && cleaned.length <= 4 ? null : 'CVC长度不正确';
  }
  
  if (!cardType.cvcLength.includes(cleaned.length)) {
    const expectedLength = cardType.cvcLength[0];
    return `${cardType.name} CVC应为${expectedLength}位数字`;
  }
  
  return null;
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value.trim()) {
    return `请输入${fieldName}`;
  }
  return null;
};

// Luhn算法验证信用卡号
const luhnCheck = (cardNumber: string): boolean => {
  let sum = 0;
  let isEven = false;
  
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i));
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit = digit % 10 + 1;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};