import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return { redirect: { destination: '/about', permanent: false } };
};

import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  detectCardType,
  formatCardNumber,
  formatExpiryDate,
  validateEmail,
  validateCardNumber,
  validateExpiryDate,
  validateCVC,
  validateRequired,
  CardTypeInfo
} from '../utils/cardValidation';

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  zipCode: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

interface FormErrors {
  email?: string;
  firstName?: string;
  lastName?: string;
  zipCode?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
}

const Checkout: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvc: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [selectedPlan, setSelectedPlan] = useState('2year');
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedCardType, setDetectedCardType] = useState<CardTypeInfo | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // 从URL参数获取选中的套餐
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    if (plan) {
      setSelectedPlan(plan);
    }
  }, []);

  const plans = {
    '1month': { 
      name: '1个月套餐', 
      price: 11.99, 
      originalPrice: 11.99, 
      discount: 0,
      totalPrice: 11.99
    },
    '6month': { 
      name: '6个月套餐', 
      price: 6.99, 
      originalPrice: 11.99, 
      discount: 42,
      totalPrice: 41.94 // 6.99 * 6 = 41.94
    },
    '12month': { 
      name: '12个月套餐', 
      price: 5.99, 
      originalPrice: 11.99, 
      discount: 50,
      totalPrice: 71.88 // 5.99 * 12 = 71.88
    },
    '2year': { 
      name: '2年+2个月免费', 
      price: 2.19, 
      originalPrice: 11.99, 
      discount: 82,
      totalPrice: 52.56 // 26个月的总价
    }
  };

  const currentPlan = plans[selectedPlan as keyof typeof plans] || plans['2year'];

  // 用精确公式计算续费日期的函数
  const calculateRenewalDate = (planId: string) => {
    const now = new Date();
    const Y0 = now.getFullYear();  // 起始年
    const M0 = now.getMonth() + 1; // 起始月 (1-12)
    const day = now.getDate();     // 保持相同日期
    
    // 根据套餐获取月数 N
    let N = 0; // 套餐月数
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
        N = 26; // 24个月付费 + 2个月免费
        break;
      default:
        N = 26;
    }
    
    // 使用你的精确公式计算续费年月
    const Yr = Y0 + Math.floor((M0 + N - 1) / 12);     // 续费年：Yr = Y₀ + ⌊(M₀ + N - 1) / 12⌋
    const Mr = ((M0 + N - 1) % 12) + 1;                // 续费月：Mr = (M₀ + N - 1) mod 12 + 1
    
    // 创建续费日期，处理月末日期边界问题
    let renewalDate = new Date(Yr, Mr - 1, day); // JavaScript月份从0开始
    
    // 处理月末日期问题（如1月31日 + 1个月 = 2月28日/29日）
    if (renewalDate.getMonth() !== (Mr - 1)) {
      // 如果日期溢出到下个月，设置为该月最后一天
      renewalDate = new Date(Yr, Mr, 0); // 下个月的第0天 = 当月最后一天
    }
    
    // 格式化日期为完整格式
    return renewalDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 获取续费周期文本
  const getRenewalPeriodText = (planId: string) => {
    switch(planId) {
      case '1month':
        return 'on a monthly basis';
      case '6month':
        return 'on a 6-month basis';  
      case '12month':
        return 'on an annual basis';
      case '2year':
        return 'on a 26-month basis'; // 修正：26个月周期（24个月付费 + 2个月免费）
      default:
        return 'on a 26-month basis';
    }
  };

  const renewalDate = calculateRenewalDate(selectedPlan);
  const renewalPeriod = getRenewalPeriodText(selectedPlan);

  const paymentMethods = [
    {
      id: 'applepay',
      name: 'Apple Pay 苹果支付',
      icon: '/apple_pay_icon.png',
      description: 'CONTINUE BELOW TO BUY A VPN SUBSCRIPTION WITH APPLE PAY'
    },
    {
      id: 'googlepay', 
      name: 'Google Pay 谷歌支付',
      icon: '/google_gpay_icon.png',
      description: 'CONTINUE BELOW TO BUY A VPN SUBSCRIPTION WITH GOOGLE PAY'
    },
    {
      id: 'creditcard',
      name: 'Credit Card 信用卡',
      icon: '/206684_visa_method_card_payment_icon.png',
      description: 'CONTINUE BELOW TO BUY A VPN SUBSCRIPTION WITH CREDIT CARD',
      showCards: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '/paypal_method_payment_icon.png',
      description: 'CONTINUE BELOW TO BUY A VPN SUBSCRIPTION WITH PAYPAL.'
    },
    {
      id: 'crypto',
      name: 'Crypto 加密货币',
      icon: '/206681_payment_bitcoin_method_icon.png',
      description: 'CONTINUE BELOW TO BUY A VPN SUBSCRIPTION WITH CRYPTO'
    },
    {
      id: 'unionpay',
      name: '银联 UnionPay',
      icon: '/10.png',
      description: 'CONTINUE BELOW TO BUY A VPN SUBSCRIPTION WITH UNIONPAY'
    },
    {
      id: 'amazon',
      name: 'Amazon Pay 亚马逊支付',
      icon: '/亚马逊.png',
      description: 'CONTINUE BELOW TO BUY A VPN SUBSCRIPTION WITH AMAZON PAY'
    }
  ];

  const handlePaymentToggle = (methodId: string) => {
    setExpandedPayment(expandedPayment === methodId ? null : methodId);
  };

  // 表单字段更新处理
  const handleInputChange = (field: keyof FormData, value: string) => {
    let formattedValue = value;
    
    // 特殊格式化处理
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      const newCardType = detectCardType(formattedValue);
      setDetectedCardType(newCardType);
      
      // 清除之前的错误
      if (formErrors.cardNumber) {
        setFormErrors(prev => ({ ...prev, cardNumber: undefined }));
      }
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
      
      // 清除之前的错误
      if (formErrors.expiryDate) {
        setFormErrors(prev => ({ ...prev, expiryDate: undefined }));
      }
    } else if (field === 'cvc') {
      // 只允许数字，限制长度
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
      
      // 清除之前的错误
      if (formErrors.cvc) {
        setFormErrors(prev => ({ ...prev, cvc: undefined }));
      }
    } else {
      // 清除对应字段的错误
      if (formErrors[field]) {
        setFormErrors(prev => ({ ...prev, [field]: undefined }));
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  // 表单验证
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    // 验证邮箱
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    // 如果选择了信用卡支付，验证信用卡信息
    if (expandedPayment === 'creditcard') {
      const firstNameError = validateRequired(formData.firstName, '名字');
      if (firstNameError) errors.firstName = firstNameError;
      
      const lastNameError = validateRequired(formData.lastName, '姓氏');
      if (lastNameError) errors.lastName = lastNameError;
      
      const zipCodeError = validateRequired(formData.zipCode, '邮政编码');
      if (zipCodeError) errors.zipCode = zipCodeError;
      
      const cardNumberError = validateCardNumber(formData.cardNumber);
      if (cardNumberError) errors.cardNumber = cardNumberError;
      
      const expiryError = validateExpiryDate(formData.expiryDate);
      if (expiryError) errors.expiryDate = expiryError;
      
      const cvcError = validateCVC(formData.cvc, detectedCardType);
      if (cvcError) errors.cvc = cvcError;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubscribe = async (methodId: string) => {
    if (!validateForm()) {
      // 滚动到第一个错误字段
      if (formErrors.email && emailInputRef.current) {
        emailInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        emailInputRef.current.focus();
      }
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // 构建支付数据
      const paymentData = {
        email: formData.email,
        plan: selectedPlan,
        paymentMethod: methodId,
        amount: currentPlan.totalPrice,
        currency: 'USD',
        ...(methodId === 'creditcard' && {
          cardInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            zipCode: formData.zipCode,
            cardNumber: formData.cardNumber.replace(/\s/g, ''),
            expiryDate: formData.expiryDate.replace(/\s/g, '').replace('/', ''),
            cvc: formData.cvc,
            cardType: detectedCardType?.type
          }
        })
      };
      
      console.log('处理支付:', paymentData);
      
      // 调用Airwallex支付API
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: selectedPlan,
          customerEmail: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // 保存选中的套餐到本地存储
        localStorage.setItem('selectedPlan', selectedPlan);
        
        // 支付意图创建成功
        console.log('支付意图创建成功:', result.paymentIntent);
        
        // 显示支付成功信息
        alert(`支付初始化成功！\n订单ID: ${result.paymentIntent.order_id}\n支付方式: ${paymentMethods.find(m => m.id === methodId)?.name}\n邮箱: ${formData.email}\n套餐: ${currentPlan.name}\n金额: $${currentPlan.totalPrice.toFixed(2)}\n\n正在跳转到支付页面...`);
        
        // 跳转到加载页面处理Airwallex订单
        window.location.href = `/loading-test?order_id=${result.paymentIntent.order_id}&payment_intent_id=${result.paymentIntent.id}`;
        
      } else {
        throw new Error(result.error || '支付初始化失败');
      }
      
    } catch (error) {
      console.error('支付处理异常:', error);
      alert('支付处理异常，请重试或联系客服。');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Head>
        <title>结算 - MistCurrent VPN</title>
        <meta name="description" content="安全便捷的MistCurrent VPN结算页面，支持多种支付方式" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* 左侧 - 结算表单 */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
                  
                  {/* 步骤1 - 邮箱 */}
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        1
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Enter your email address: 输入您的邮箱地址：
                      </h2>
                    </div>
                    
                    <div className="ml-11">
                      <input
                        ref={emailInputRef}
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="name@example.com"
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none text-lg transition-colors ${
                          formErrors.email 
                            ? 'border-red-300 focus:border-red-500 bg-red-50' 
                            : 'border-gray-200 focus:border-blue-500'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                      )}
                      <div className="flex items-start mt-3">
                        <input type="checkbox" defaultChecked className="mt-1 mr-2" />
                        <p className="text-sm text-gray-600">
                          MistCurrent and its affiliates may email me security tips, updates, and offers. I can unsubscribe anytime, and my information will not otherwise be shared, as per the Privacy Policy.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 步骤2 - 支付方式 */}
                  <div className="mb-8">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        2
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Select payment method 选择支付方式
                      </h2>
                    </div>

                    <div className="ml-11">
                      <div className="flex items-center mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-green-800">Secure checkout 安全结算</p>
                          <p className="text-sm text-green-600">Your payment information is fully protected. 您的支付信息完全受到保护。</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {paymentMethods.map((method) => (
                          <div key={method.id} className="border border-gray-200 rounded-lg">
                            {/* 支付方式标题栏 */}
                            <div
                              onClick={() => handlePaymentToggle(method.id)}
                              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                            >
                              <div className="flex items-center">
                                <div className="w-8 h-8 mr-4 flex items-center justify-center bg-gray-50 rounded">
                                  <img 
                                    src={method.icon} 
                                    alt={method.name}
                                    className="max-w-full max-h-full object-contain"
                                    onError={(e) => {
                                      console.log(`图标加载失败: ${method.icon}`);
                                    }}
                                  />
                                </div>
                                <span className="font-medium text-gray-900">{method.name}</span>
                                {method.showCards && (
                                  <div className="flex ml-4 space-x-2">
                                    {/* 动态显示检测到的卡片类型或所有支持的类型 */}
                                    {detectedCardType ? (
                                      <div className="flex items-center">
                                        <img 
                                          src={detectedCardType.icon} 
                                          alt={detectedCardType.name} 
                                          className="h-6 object-contain border-2 border-blue-500 rounded" 
                                        />
                                        <span className="ml-2 text-sm text-blue-600 font-medium">{detectedCardType.name}</span>
                                      </div>
                                    ) : (
                                      <>
                                        <img src="/american_express_method_card_payment_icon.png" alt="AmEx" className="h-6 object-contain opacity-50" />
                                        <img src="/2629972_card_cash_checkout_credit_mastercard_icon.png" alt="MasterCard" className="h-6 object-contain opacity-50" />
                                        <img src="/206684_visa_method_card_payment_icon.png" alt="Visa" className="h-6 object-contain opacity-50" />
                                        <img src="/1156716_club_diners_international_icon.png" alt="Diners Club" className="h-6 object-contain opacity-50" />
                                        <img src="/358102_card_jcb_payment_icon.png" alt="JCB" className="h-6 object-contain opacity-50" />
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                              <svg 
                                className={`w-5 h-5 text-gray-400 transition-transform ${
                                  expandedPayment === method.id ? 'rotate-180' : ''
                                }`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>

                            {/* 展开的支付表单 */}
                            {expandedPayment === method.id && (
                              <div className="px-4 pb-4 border-t border-gray-200 bg-gray-50">
                                <div className="mt-4">
                                  <p className="text-sm text-gray-600 mb-4">{method.description}</p>
                                  <p className="text-sm text-gray-500 mb-4">
                                    继续下面的内容，使用 {method.name.split(' ')[0]} 购买 VPN 订阅。
                                  </p>

                                  {/* 信用卡表单 */}
                                  {method.id === 'creditcard' && (
                                    <div className="space-y-4 mb-4">
                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                          <input 
                                            type="text" 
                                            placeholder="First name" 
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            className={`w-full border rounded-lg px-3 py-2 focus:outline-none transition-colors ${
                                              formErrors.firstName 
                                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                : 'border-gray-300 focus:border-blue-500'
                                            }`}
                                          />
                                          {formErrors.firstName && (
                                            <p className="mt-1 text-xs text-red-600">{formErrors.firstName}</p>
                                          )}
                                        </div>
                                        <div>
                                          <input 
                                            type="text" 
                                            placeholder="Last name" 
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            className={`w-full border rounded-lg px-3 py-2 focus:outline-none transition-colors ${
                                              formErrors.lastName 
                                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                : 'border-gray-300 focus:border-blue-500'
                                            }`}
                                          />
                                          {formErrors.lastName && (
                                            <p className="mt-1 text-xs text-red-600">{formErrors.lastName}</p>
                                          )}
                                        </div>
                                        <div className="sm:col-span-2 lg:col-span-1">
                                          <input 
                                            type="text" 
                                            placeholder="ZIP/Postal code" 
                                            value={formData.zipCode}
                                            onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                            className={`w-full border rounded-lg px-3 py-2 focus:outline-none transition-colors ${
                                              formErrors.zipCode 
                                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                : 'border-gray-300 focus:border-blue-500'
                                            }`}
                                          />
                                          {formErrors.zipCode && (
                                            <p className="mt-1 text-xs text-red-600">{formErrors.zipCode}</p>
                                          )}
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                        <div className="lg:col-span-2">
                                          <div className="relative">
                                            <input 
                                              type="text" 
                                              placeholder="Card number" 
                                              value={formData.cardNumber}
                                              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                                              maxLength={23} // 19 digits + 4 spaces
                                              className={`w-full border rounded-lg px-3 py-2 pr-12 focus:outline-none transition-colors ${
                                                formErrors.cardNumber 
                                                  ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                  : 'border-gray-300 focus:border-blue-500'
                                              }`}
                                            />
                                            {detectedCardType && (
                                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                                <img 
                                                  src={detectedCardType.icon} 
                                                  alt={detectedCardType.name}
                                                  className="h-6 object-contain"
                                                />
                                              </div>
                                            )}
                                          </div>
                                          {formErrors.cardNumber && (
                                            <p className="mt-1 text-xs text-red-600">{formErrors.cardNumber}</p>
                                          )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <input 
                                              type="text" 
                                              placeholder="MM / YY" 
                                              value={formData.expiryDate}
                                              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                                              maxLength={7} // MM / YY
                                              className={`w-full border rounded-lg px-3 py-2 focus:outline-none transition-colors ${
                                                formErrors.expiryDate 
                                                  ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                  : 'border-gray-300 focus:border-blue-500'
                                              }`}
                                            />
                                            {formErrors.expiryDate && (
                                              <p className="mt-1 text-xs text-red-600">{formErrors.expiryDate}</p>
                                            )}
                                          </div>
                                          <div>
                                            <input 
                                              type="text" 
                                              placeholder="CVC" 
                                              value={formData.cvc}
                                              onChange={(e) => handleInputChange('cvc', e.target.value)}
                                              maxLength={4}
                                              className={`w-full border rounded-lg px-3 py-2 focus:outline-none transition-colors ${
                                                formErrors.cvc 
                                                  ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                  : 'border-gray-300 focus:border-blue-500'
                                              }`}
                                            />
                                            {formErrors.cvc && (
                                              <p className="mt-1 text-xs text-red-600">{formErrors.cvc}</p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* 服务条款 */}
                                  <div className="text-xs text-gray-500 mb-4">
                                    <p className="mb-2">
                                      By clicking below, I agree I have reviewed and consent to the 
                                      <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-green-600 underline"> Terms of Service</a> (including its dispute resolution clause) and 
                                      <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-green-600 underline"> Privacy Policy</a>.
                                    </p>
                                    <p className="mb-2">点击下方，即表示我同意我已阅读并同意服务条款（包括其争议解决条款）和隐私政策。</p>
                                    <p>
                                      Subscription will renew <strong>{renewalPeriod}</strong> on {renewalDate}, at the then-current rate 
                                      (<strong>now ${currentPlan.totalPrice.toFixed(2)}/period</strong>) to the same credit card, Unless you cancel by going to the Subscription tab under My Account and following the "Cancel" prompts.
                                    </p>
                                  </div>

                                  {/* 订阅按钮 */}
                                  <button
                                    onClick={() => handleSubscribe(method.id)}
                                    disabled={isProcessing}
                                    className={`w-full py-3 px-6 rounded-full font-bold text-white transition-all duration-200 flex items-center justify-center ${
                                      isProcessing 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : method.id === 'applepay' ? 'bg-black hover:bg-gray-800' :
                                          method.id === 'paypal' ? 'bg-yellow-500 hover:bg-yellow-600 text-blue-800' :
                                          method.id === 'creditcard' ? 'bg-green-600 hover:bg-green-700' :
                                          'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                  >
                                    {isProcessing ? (
                                      <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing... 处理中...
                                      </>
                                    ) : (
                                      <span className="flex items-center">
                                        {method.id === 'applepay' && (
                                          <>
                                            Subscribe with 
                                            <img src="/apple_pay_icon.png" alt="Apple Pay" className="w-8 h-6 mx-2 object-contain filter brightness-0 invert" />
                                            Pay 支付
                                          </>
                                        )}
                                        {method.id === 'googlepay' && (
                                          <>
                                            Subscribe with 
                                            <img src="/google_gpay_icon.png" alt="Google Pay" className="w-6 h-6 mx-2 object-contain" />
                                            Pay
                                          </>
                                        )}
                                        {method.id === 'creditcard' && (
                                          <>
                                            Subscribe now 
                                            <img src="/206684_visa_method_card_payment_icon.png" alt="Credit Card" className="w-6 h-6 mx-2 object-contain" />
                                            立即订阅
                                          </>
                                        )}
                                        {method.id === 'paypal' && (
                                          <>
                                            <img src="/paypal_method_payment_icon.png" alt="PayPal" className="w-6 h-6 mr-2 object-contain" />
                                            PayPal 订阅
                                          </>
                                        )}
                                        {method.id === 'crypto' && (
                                          <>
                                            Subscribe with 
                                            <img src="/206681_payment_bitcoin_method_icon.png" alt="Crypto" className="w-6 h-6 mx-2 object-contain" />
                                            Crypto
                                          </>
                                        )}
                                        {method.id === 'unionpay' && (
                                          <>
                                            Subscribe with 
                                            <img src="/10.png" alt="银联" className="w-6 h-6 mx-2 object-contain" />
                                            银联
                                          </>
                                        )}
                                        {method.id === 'amazon' && (
                                          <>
                                            Subscribe with 
                                            <img src="/亚马逊.png" alt="Amazon Pay" className="w-6 h-6 mx-2 object-contain" />
                                            Amazon Pay
                                          </>
                                        )}
                                      </span>
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧 - 订单摘要 */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-24">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Order summary 订单摘要</h3>
                  
                  {/* 套餐信息 */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{currentPlan.name}</p>
                        {currentPlan.discount > 0 && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full mt-1">
                            Save {currentPlan.discount}% 节省 {currentPlan.discount}%
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        {currentPlan.discount > 0 && (
                          <p className="text-sm text-gray-500 line-through">${(currentPlan.originalPrice * (currentPlan.name.includes('6个月') ? 6 : currentPlan.name.includes('12个月') ? 12 : currentPlan.name.includes('2年') ? 26 : 1)).toFixed(2)}</p>
                        )}
                        <p className="text-lg font-bold text-gray-900">${currentPlan.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* 总计 */}
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Order total 订单总计</span>
                      <div className="text-right">
                        <p className="text-sm text-green-600">Save {currentPlan.discount}%</p>
                        <p className="text-2xl font-bold text-green-600">${currentPlan.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* 保障信息 */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-green-600 font-bold text-lg">30</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800 mb-1">30-day money-back guarantee</h4>
                        <h4 className="font-semibold text-green-800 mb-1">30天退款保证</h4>
                        <p className="text-sm text-green-600">
                          Not satisfied in the first 30 days? First-time users can ask Support for a full refund. It's that easy.
                        </p>
                        <p className="text-sm text-green-600">
                          前30天内不满意？新用户可联系客服申请全额退款，就是这么简单。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Checkout;