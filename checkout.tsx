import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase, signIn, signUp } from '../lib/supabase';
import { PLANS } from '../lib/plans';
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
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '', confirm: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);

  // 浠嶶RL鍙傛暟鑾峰彇閫変腑鐨勫椁?  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    if (plan) {
      setSelectedPlan(plan);
    }
  }, []);

  React.useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (session?.user?.email) {
        setUserEmail(session.user.email);
        setFormData(prev => ({ ...prev, email: session.user.email || '' }));
      }
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
        setFormData(prev => ({ ...prev, email: session.user.email || '' }));
      } else {
        setUserEmail(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const plans = PLANS;

  const currentPlan = plans[selectedPlan as keyof typeof plans] || plans['2year'];

  // 鐢ㄧ簿纭叕寮忚绠楃画璐规棩鏈熺殑鍑芥暟
  const calculateRenewalDate = (planId: string) => {
    const now = new Date();
    const Y0 = now.getFullYear();  // 璧峰骞?    const M0 = now.getMonth() + 1; // 璧峰鏈?(1-12)
    const day = now.getDate();     // 淇濇寔鐩稿悓鏃ユ湡
    
    // 鏍规嵁濂楅鑾峰彇鏈堟暟 N
    let N = 0; // 濂楅鏈堟暟
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
        N = 26; // 24涓湀浠樿垂 + 2涓湀鍏嶈垂
        break;
      default:
        N = 26;
    }
    
    // 浣跨敤浣犵殑绮剧‘鍏紡璁＄畻缁垂骞存湀
    const Yr = Y0 + Math.floor((M0 + N - 1) / 12);     // 缁垂骞达細Yr = Y鈧€ + 鈱?M鈧€ + N - 1) / 12鈱?    const Mr = ((M0 + N - 1) % 12) + 1;                // 缁垂鏈堬細Mr = (M鈧€ + N - 1) mod 12 + 1
    
    // 鍒涘缓缁垂鏃ユ湡锛屽鐞嗘湀鏈棩鏈熻竟鐣岄棶棰?    let renewalDate = new Date(Yr, Mr - 1, day); // JavaScript鏈堜唤浠?寮€濮?    
    // 澶勭悊鏈堟湯鏃ユ湡闂锛堝1鏈?1鏃?+ 1涓湀 = 2鏈?8鏃?29鏃ワ級
    if (renewalDate.getMonth() !== (Mr - 1)) {
      // 濡傛灉鏃ユ湡婧㈠嚭鍒颁笅涓湀锛岃缃负璇ユ湀鏈€鍚庝竴澶?      renewalDate = new Date(Yr, Mr, 0); // 涓嬩釜鏈堢殑绗?澶?= 褰撴湀鏈€鍚庝竴澶?    }
    
    // 鏍煎紡鍖栨棩鏈熶负瀹屾暣鏍煎紡
    return renewalDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 鑾峰彇缁垂鍛ㄦ湡鏂囨湰
  const getRenewalPeriodText = (planId: string) => {
    switch(planId) {
      case '1month':
        return 'on a monthly basis';
      case '6month':
        return 'on a 6-month basis';  
      case '12month':
        return 'on an annual basis';
      case '2year':
        return 'on a 26-month basis'; // 淇锛?6涓湀鍛ㄦ湡锛?4涓湀浠樿垂 + 2涓湀鍏嶈垂锛?      default:
        return 'on a 26-month basis';
    }
  };

  const renewalDate = calculateRenewalDate(selectedPlan);
  const renewalPeriod = getRenewalPeriodText(selectedPlan);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthMessage('');

    try {
      if (authMode === 'register') {
        if (authForm.password !== authForm.confirm) {
          setAuthMessage('两次密码不一致');
          setAuthLoading(false);
          return;
        }
        const { error } = await signUp(authForm.email, authForm.password);
        if (error) throw error;
        setAuthMessage('注册成功，请检查邮箱验证后登录');
      } else {
        const { error } = await signIn(authForm.email, authForm.password);
        if (error) throw error;
        setAuthMessage('登录成功');
      }
    } catch (err: any) {
      setAuthMessage(err.message || '操作失败');
    } finally {
      setAuthLoading(false);
    }
  };

  const getSession = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session || null;
  };

  const paymentMethods = [
    {
      id: 'applepay',
      name: 'Apple Pay 鑻规灉鏀粯',
      icon: '/apple_pay_icon.png',
      description: 'CONTINUE BELOW TO BUY A VPN SUBSCRIPTION WITH APPLE PAY'
    },
    {
      id: 'googlepay', 
      name: 'Google Pay 璋锋瓕鏀粯',
      icon: '/google_gpay_icon.png',
      description: 'CONTINUE BELOW TO BUY A VPN SUBSCRIPTION WITH GOOGLE PAY'
    },
    {
      id: 'creditcard',
      name: 'Credit Card 淇＄敤鍗?,
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
      name: 'Crypto 鍔犲瘑璐у竵',
      icon: '/206681_payment_bitcoin_method_icon.png',
      description: 'CONTINUE BELOW TO BUY A VPN SUBSCRIPTION WITH CRYPTO'
    },
    {
      id: 'unionpay',
      name: '閾惰仈 UnionPay',
      icon: '/10.png',
      description: 'CONTINUE BELOW TO BUY A VPN SUBSCRIPTION WITH UNIONPAY'
    },
    {
      id: 'amazon',
      name: 'Amazon Pay 浜氶┈閫婃敮浠?,
      icon: '/浜氶┈閫?png',
      description: 'CONTINUE BELOW TO BUY A VPN SUBSCRIPTION WITH AMAZON PAY'
    }
  ];

  const handlePaymentToggle = (methodId: string) => {
    setExpandedPayment(expandedPayment === methodId ? null : methodId);
  };

  // 琛ㄥ崟瀛楁鏇存柊澶勭悊
  const handleInputChange = (field: keyof FormData, value: string) => {
    let formattedValue = value;
    
    // 鐗规畩鏍煎紡鍖栧鐞?    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      const newCardType = detectCardType(formattedValue);
      setDetectedCardType(newCardType);
      
      // 娓呴櫎涔嬪墠鐨勯敊璇?      if (formErrors.cardNumber) {
        setFormErrors(prev => ({ ...prev, cardNumber: undefined }));
      }
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
      
      // 娓呴櫎涔嬪墠鐨勯敊璇?      if (formErrors.expiryDate) {
        setFormErrors(prev => ({ ...prev, expiryDate: undefined }));
      }
    } else if (field === 'cvc') {
      // 鍙厑璁告暟瀛楋紝闄愬埗闀垮害
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
      
      // 娓呴櫎涔嬪墠鐨勯敊璇?      if (formErrors.cvc) {
        setFormErrors(prev => ({ ...prev, cvc: undefined }));
      }
    } else {
      // 娓呴櫎瀵瑰簲瀛楁鐨勯敊璇?      if (formErrors[field]) {
        setFormErrors(prev => ({ ...prev, [field]: undefined }));
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  // 琛ㄥ崟楠岃瘉
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    // 楠岃瘉閭
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    // 濡傛灉閫夋嫨浜嗕俊鐢ㄥ崱鏀粯锛岄獙璇佷俊鐢ㄥ崱淇℃伅
    if (expandedPayment === 'creditcard') {
      const firstNameError = validateRequired(formData.firstName, '鍚嶅瓧');
      if (firstNameError) errors.firstName = firstNameError;
      
      const lastNameError = validateRequired(formData.lastName, '濮撴皬');
      if (lastNameError) errors.lastName = lastNameError;
      
      const zipCodeError = validateRequired(formData.zipCode, '閭斂缂栫爜');
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
      // 婊氬姩鍒扮涓€涓敊璇瓧娈?      if (formErrors.email && emailInputRef.current) {
        emailInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        emailInputRef.current.focus();
      }
      return;
    }
    
    const session = await getSession();
    if (!session) {
      setAuthMessage('请先登录后再购买');
      return;
    }

    setIsProcessing(true);

    try {
      // 鏋勫缓鏀粯鏁版嵁
      const customerEmail = session.user.email || formData.email;
      const paymentData = {
        email: customerEmail,
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
      
      console.log('澶勭悊鏀粯:', paymentData);
      
      // 璋冪敤Airwallex鏀粯API
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          planId: selectedPlan,
          customerEmail: customerEmail,
          customerName: `${formData.firstName} ${formData.lastName}`.trim() || customerEmail,
          paymentMethod: methodId,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // 淇濆瓨閫変腑鐨勫椁愬埌鏈湴瀛樺偍
        localStorage.setItem('selectedPlan', selectedPlan);
        
        // 鏀粯鎰忓浘鍒涘缓鎴愬姛
        console.log('鏀粯鎰忓浘鍒涘缓鎴愬姛:', result.paymentIntent);
        
        // 鏄剧ず鏀粯鎴愬姛淇℃伅
        alert(`鏀粯鍒濆鍖栨垚鍔燂紒\n璁㈠崟ID: ${result.paymentIntent.order_id}\n鏀粯鏂瑰紡: ${paymentMethods.find(m => m.id === methodId)?.name}\n閭: ${customerEmail}\n濂楅: ${currentPlan.name}\n閲戦: $${currentPlan.totalPrice.toFixed(2)}\n\n姝ｅ湪璺宠浆鍒版敮浠橀〉闈?..`);
        
        // 璺宠浆鍒板姞杞介〉闈㈠鐞咥irwallex璁㈠崟
        const mockFlag = result.mock ? '&mock=1' : '';
        window.location.href = `/loading-test?order_id=${result.paymentIntent.order_id}&payment_intent_id=${result.paymentIntent.id}${mockFlag}`;
        
      } else {
        throw new Error(result.error || '鏀粯鍒濆鍖栧け璐?);
      }
      
    } catch (error) {
      console.error('鏀粯澶勭悊寮傚父:', error);
      alert('鏀粯澶勭悊寮傚父锛岃閲嶈瘯鎴栬仈绯诲鏈嶃€?);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!userEmail) {
    return (
      <>
        <Head>
          <title>结算 - MistCurrent VPN</title>
        </Head>

        <div className="min-h-screen bg-gray-50">
          <Navbar />

          <main className="pt-20">
            <div className="max-w-md mx-auto px-4 py-12">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">请先登录</h2>
                <p className="text-gray-600 mb-6">登录或注册后继续购买 VPN 订阅</p>

                {authMessage && (
                  <div className="border border-gray-200 rounded-lg px-4 py-3 mb-4 text-sm text-gray-700">
                    {authMessage}
                  </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="邮箱地址"
                      value={authForm.email}
                      onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="密码"
                      value={authForm.password}
                      onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3"
                      required
                    />
                  </div>
                  {authMode === 'register' && (
                    <div>
                      <input
                        type="password"
                        placeholder="确认密码"
                        value={authForm.confirm}
                        onChange={(e) => setAuthForm({ ...authForm, confirm: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        required
                      />
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
                  >
                    {authLoading ? '处理中...' : authMode === 'register' ? '注册' : '登录'}
                  </button>
                  <p className="text-center text-sm text-gray-600">
                    {authMode === 'register' ? '已有账号？' : '还没有账号？'}
                    <button
                      type="button"
                      onClick={() => setAuthMode(authMode === 'register' ? 'login' : 'register')}
                      className="text-black hover:underline ml-1"
                    >
                      {authMode === 'register' ? '立即登录' : '立即注册'}
                    </button>
                  </p>
                </form>
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>缁撶畻 - MistCurrent VPN</title>
        <meta name="description" content="瀹夊叏渚挎嵎鐨凪istCurrent VPN缁撶畻椤甸潰锛屾敮鎸佸绉嶆敮浠樻柟寮? />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* 宸︿晶 - 缁撶畻琛ㄥ崟 */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
                  
                  {/* 姝ラ1 - 閭 */}
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        1
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Enter your email address: 杈撳叆鎮ㄧ殑閭鍦板潃锛?                      </h2>
                    </div>
                    
                    <div className="ml-11">
                      <input
                        ref={emailInputRef}
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        readOnly={Boolean(userEmail)}
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

                  {/* 姝ラ2 - 鏀粯鏂瑰紡 */}
                  <div className="mb-8">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        2
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Select payment method 閫夋嫨鏀粯鏂瑰紡
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
                          <p className="font-semibold text-green-800">Secure checkout 瀹夊叏缁撶畻</p>
                          <p className="text-sm text-green-600">Your payment information is fully protected. 鎮ㄧ殑鏀粯淇℃伅瀹屽叏鍙楀埌淇濇姢銆?/p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {paymentMethods.map((method) => (
                          <div key={method.id} className="border border-gray-200 rounded-lg">
                            {/* 鏀粯鏂瑰紡鏍囬鏍?*/}
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
                                      console.log(`鍥炬爣鍔犺浇澶辫触: ${method.icon}`);
                                    }}
                                  />
                                </div>
                                <span className="font-medium text-gray-900">{method.name}</span>
                                {method.showCards && (
                                  <div className="flex ml-4 space-x-2">
                                    {/* 鍔ㄦ€佹樉绀烘娴嬪埌鐨勫崱鐗囩被鍨嬫垨鎵€鏈夋敮鎸佺殑绫诲瀷 */}
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

                            {/* 灞曞紑鐨勬敮浠樿〃鍗?*/}
                            {expandedPayment === method.id && (
                              <div className="px-4 pb-4 border-t border-gray-200 bg-gray-50">
                                <div className="mt-4">
                                  <p className="text-sm text-gray-600 mb-4">{method.description}</p>
                                  <p className="text-sm text-gray-500 mb-4">
                                    缁х画涓嬮潰鐨勫唴瀹癸紝浣跨敤 {method.name.split(' ')[0]} 璐拱 VPN 璁㈤槄銆?                                  </p>

                                  {/* 淇＄敤鍗¤〃鍗?*/}
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

                                  {/* 鏈嶅姟鏉℃ */}
                                  <div className="text-xs text-gray-500 mb-4">
                                    <p className="mb-2">
                                      By clicking below, I agree I have reviewed and consent to the 
                                      <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-green-600 underline"> Terms of Service</a> (including its dispute resolution clause) and 
                                      <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-green-600 underline"> Privacy Policy</a>.
                                    </p>
                                    <p className="mb-2">鐐瑰嚮涓嬫柟锛屽嵆琛ㄧず鎴戝悓鎰忔垜宸查槄璇诲苟鍚屾剰鏈嶅姟鏉℃锛堝寘鎷叾浜夎瑙ｅ喅鏉℃锛夊拰闅愮鏀跨瓥銆?/p>
                                    <p>
                                      Subscription will renew <strong>{renewalPeriod}</strong> on {renewalDate}, at the then-current rate 
                                      (<strong>now ${currentPlan.totalPrice.toFixed(2)}/period</strong>) to the same credit card, Unless you cancel by going to the Subscription tab under My Account and following the "Cancel" prompts.
                                    </p>
                                  </div>

                                  {/* 璁㈤槄鎸夐挳 */}
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
                                        Processing... 澶勭悊涓?..
                                      </>
                                    ) : (
                                      <span className="flex items-center">
                                        {method.id === 'applepay' && (
                                          <>
                                            Subscribe with 
                                            <img src="/apple_pay_icon.png" alt="Apple Pay" className="w-8 h-6 mx-2 object-contain filter brightness-0 invert" />
                                            Pay 鏀粯
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
                                            绔嬪嵆璁㈤槄
                                          </>
                                        )}
                                        {method.id === 'paypal' && (
                                          <>
                                            <img src="/paypal_method_payment_icon.png" alt="PayPal" className="w-6 h-6 mr-2 object-contain" />
                                            PayPal 璁㈤槄
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
                                            <img src="/10.png" alt="閾惰仈" className="w-6 h-6 mx-2 object-contain" />
                                            閾惰仈
                                          </>
                                        )}
                                        {method.id === 'amazon' && (
                                          <>
                                            Subscribe with 
                                            <img src="/浜氶┈閫?png" alt="Amazon Pay" className="w-6 h-6 mx-2 object-contain" />
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

              {/* 鍙充晶 - 璁㈠崟鎽樿 */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-24">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Order summary 璁㈠崟鎽樿</h3>
                  
                  {/* 濂楅淇℃伅 */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{currentPlan.name}</p>
                        {currentPlan.discount > 0 && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full mt-1">
                            Save {currentPlan.discount}% 鑺傜渷 {currentPlan.discount}%
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        {currentPlan.discount > 0 && (
                          <p className="text-sm text-gray-500 line-through">${(currentPlan.originalPrice * (currentPlan.name.includes('6涓湀') ? 6 : currentPlan.name.includes('12涓湀') ? 12 : currentPlan.name.includes('2骞?) ? 26 : 1)).toFixed(2)}</p>
                        )}
                        <p className="text-lg font-bold text-gray-900">${currentPlan.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* 鎬昏 */}
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Order total 璁㈠崟鎬昏</span>
                      <div className="text-right">
                        <p className="text-sm text-green-600">Save {currentPlan.discount}%</p>
                        <p className="text-2xl font-bold text-green-600">${currentPlan.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* 淇濋殰淇℃伅 */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-green-600 font-bold text-lg">30</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800 mb-1">30-day money-back guarantee</h4>
                        <h4 className="font-semibold text-green-800 mb-1">30澶╅€€娆句繚璇?/h4>
                        <p className="text-sm text-green-600">
                          Not satisfied in the first 30 days? First-time users can ask Support for a full refund. It's that easy.
                        </p>
                        <p className="text-sm text-green-600">
                          鍓?0澶╁唴涓嶆弧鎰忥紵鏂扮敤鎴峰彲鑱旂郴瀹㈡湇鐢宠鍏ㄩ閫€娆撅紝灏辨槸杩欎箞绠€鍗曘€?                        </p>
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

