import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('简体中文');

  const languages = [
    { code: 'zh-CN', name: '简体中文' },
    { code: 'en', name: 'English' },
    { code: 'id', name: 'Indonesian' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'bg', name: 'Bulgarian' },
    { code: 'it', name: 'Italiano' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'cs', name: 'Čeština' },
    { code: 'hu', name: 'Magyar' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'hr', name: 'Croatian' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'el', name: 'Ελληνικά' },
    { code: 'da', name: 'Dansk' },
    { code: 'no', name: 'Norsk' },
    { code: 'ar', name: 'العربية' },
    { code: 'de', name: 'Deutsch' },
    { code: 'pl', name: 'Polski' },
    { code: 'th', name: 'ไทย' },
    { code: 'es', name: 'Español' },
    { code: 'pt', name: 'Português' },
    { code: 'ja', name: '日本語' },
    { code: 'fi', name: 'Finnish' },
    { code: 'ru', name: 'Русский' },
    { code: 'ko', name: '한국어' },
    { code: 'fr', name: 'Français' },
    { code: 'ro', name: 'Română' },
    { code: 'he', name: 'Hebrew' },
    { code: 'sv', name: 'Svenska' }
  ];

  const handleLanguageSelect = (language: { code: string; name: string }) => {
    setCurrentLanguage(language.name);
    setIsLanguageDropdownOpen(false);
    // TODO: Implement actual language switching logic here
  };

  const footerLinks = {
    product: [
      { name: '产品功能', href: '#features' },
      { name: '价格方案', href: '#pricing' },
      { name: '服务器节点', href: '/servers' },
      { name: '应用下载', href: '/download' }
    ],
    company: [
      { name: '关于我们', href: '/about' },
      { name: '新闻资讯', href: '/news' },
      { name: '合作伙伴', href: '/partners' },
      { name: '职业机会', href: '/careers' }
    ],
    support: [
      { name: '帮助中心', href: '/help' },
      { name: '常见问题', href: '/faq' },
      { name: '联系客服', href: '/contact' },
      { name: '技术支持', href: '/support' }
    ],
    legal: [
      { name: '服务条款', href: '/terms' },
      { name: '隐私政策', href: '/privacy' },
      { name: '退款政策', href: '/refund' },
      { name: '法律声明', href: '/legal' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: '🐦' },
    { name: 'Telegram', href: '#', icon: '✈️' },
    { name: 'Discord', href: '#', icon: '🎮' },
    { name: 'Reddit', href: '#', icon: '📧' }
  ];

  return (
    <footer className="bg-slate-900">
      {/* Simple Footer Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left side - Copyright and Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-6 text-black text-xs sm:text-sm">
            <span>© {currentYear} MistCurrent. 保留所有权利</span>
            <Link href="/privacy" className="hover:text-black transition-colors duration-200">
              隐私政策
            </Link>
            <Link href="/terms" className="hover:text-black transition-colors duration-200">
              服务条款
            </Link>
            <Link href="/cookie" className="hover:text-black transition-colors duration-200 hidden sm:inline">
              Cookie 偏好
            </Link>
          </div>

          {/* Right side - Payment icons and Language */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            {/* Payment Icons */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
              <Image src="/7.png" alt="Mastercard" width={30} height={20} className="rounded" />
              <Image src="/8.png" alt="Visa" width={30} height={20} className="rounded" />
              <Image src="/9.png" alt="Discover" width={30} height={20} className="rounded" />
              <Image src="/10.png" alt="UnionPay" width={30} height={20} className="rounded" />
              <Image src="/11.png" alt="Amazon Pay" width={30} height={20} className="rounded" />
              <Image src="/12.png?v=2" alt="PayPal" width={35} height={22} className="rounded bg-white p-0.5" />
              <Image src="/13.png?v=2" alt="Stripe" width={35} height={22} className="rounded bg-white p-0.5" />
            </div>
            
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center gap-2 text-white text-xs sm:text-sm whitespace-nowrap hover:text-gray-300 transition-colors duration-200"
              >
                <GlobeAltIcon className="w-4 h-4" />
                <span>{currentLanguage}</span>
                <ChevronDownIcon className={`w-3 h-3 transition-transform duration-200 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Language Dropdown */}
              {isLanguageDropdownOpen && (
                <div className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48 max-h-60 overflow-y-auto z-50">
                  <div className="grid grid-cols-1 gap-1">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageSelect(language)}
                        className={`px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors duration-200 ${
                          currentLanguage === language.name ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        {language.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Remove scroll to top button */}
    </footer>
  );
};

export default Footer;