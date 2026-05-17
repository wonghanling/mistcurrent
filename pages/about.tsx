import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number; y: number; size: number; color: string;
      speedX: number; speedY: number; rotation: number; rotSpeed: number;
      shape: 'rect' | 'circle' | 'star';
      opacity: number;
    }> = [];

    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 2,
        speedY: Math.random() * 2 + 1,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 5,
        shape: (['rect', 'circle', 'star'] as const)[Math.floor(Math.random() * 3)],
        opacity: Math.random() * 0.6 + 0.4,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          for (let j = 0; j < 5; j++) {
            const angle = (j * 4 * Math.PI) / 5 - Math.PI / 2;
            const r = j % 2 === 0 ? p.size / 2 : p.size / 4;
            ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
          }
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;
        p.speedY += 0.02;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
          p.speedY = Math.random() * 2 + 1;
        }
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-40 opacity-60" />;
}

const en = {
  title: 'MISTCURRENT LLC — Global Digital Rewards Infrastructure',
  langBtn: 'CN',
  heroTag: 'Trusted Digital Commerce',
  heroTitle: 'Powering the Future of Digital Rewards',
  heroDesc: 'We build secure infrastructure for digital gift cards, prepaid rewards, and loyalty programs across 40+ countries.',
  statsTransactions: 'Transactions Processed',
  statsCountries: 'Countries Served',
  statsPartners: 'Brand Partners',
  statsUptime: 'Platform Uptime',
  aboutTitle: 'About MISTCURRENT',
  aboutP1: 'MISTCURRENT LLC is a digital commerce company incorporated in the State of Wyoming, United States. We specialize in the programmatic distribution of digital value — from gift cards and prepaid instruments to loyalty credits and promotional rewards.',
  aboutP2: 'Our platform connects brands, merchants, and end-users through a unified API, enabling instant delivery of digital goods at scale. Whether it is a single consumer purchase or an enterprise bulk order, our infrastructure handles it with the same reliability and speed.',
  aboutP3: 'Founded with the mission to make digital value transfer frictionless, we serve clients ranging from e-commerce platforms and fintech companies to HR departments running employee recognition programs.',
  servicesTitle: 'What We Do',
  services: [
    { title: 'Digital Gift Cards', desc: 'Instant delivery of gift cards from 200+ brands including Apple, Google Play, Amazon, Steam, PlayStation, Xbox, Netflix, Spotify, and regional retailers. Available in 40+ countries with local currency support.', features: ['Real-time activation', 'Bulk ordering API', 'White-label solutions', 'Multi-currency support'] },
    { title: 'Prepaid Reward Cards', desc: 'Virtual and physical prepaid cards for employee incentives, customer cashback, survey rewards, and promotional campaigns. Fully customizable denominations from $5 to $10,000.', features: ['Custom branding', 'Programmable spending rules', 'Real-time balance tracking', 'Instant digital delivery'] },
    { title: 'Loyalty & Credits Platform', desc: 'End-to-end loyalty program infrastructure. Issue, manage, and redeem points and credits across channels. Integrate with existing CRM and marketing automation tools.', features: ['Points issuance engine', 'Redemption catalog', 'Analytics dashboard', 'Omnichannel integration'] },
    { title: 'Enterprise Solutions', desc: 'Tailored B2B solutions for large-scale reward distribution. Dedicated account management, custom SLAs, and enterprise-grade security for organizations processing high volumes.', features: ['Dedicated infrastructure', 'Custom API integration', 'Priority support', 'Volume pricing'] },
  ],
  complianceTitle: 'Compliance & Security',
  complianceDesc: 'Trust is the foundation of digital commerce. We maintain rigorous compliance standards and security practices to protect every transaction on our platform.',
  complianceItems: [
    { title: 'Anti-Money Laundering', desc: 'Full AML compliance with transaction monitoring, suspicious activity reporting, and risk-based customer due diligence procedures.' },
    { title: 'KYC Verification', desc: 'Robust Know Your Customer processes for all business accounts, including identity verification, beneficial ownership checks, and ongoing monitoring.' },
    { title: 'Data Protection', desc: 'End-to-end encryption for all data in transit and at rest. Regular penetration testing and SOC 2 aligned security controls.' },
    { title: 'Regulatory Compliance', desc: 'Adherence to FinCEN guidelines, state money transmitter regulations where applicable, and international digital commerce standards.' },
    { title: 'Transaction Security', desc: 'Multi-layer fraud detection, velocity checks, and real-time transaction scoring to prevent unauthorized use.' },
    { title: 'Audit & Reporting', desc: 'Complete transaction audit trails, automated regulatory reporting, and transparent record-keeping for all operations.' },
  ],
  processTitle: 'How It Works',
  processSteps: [
    { step: '01', title: 'Integration', desc: 'Connect via our RESTful API or use our merchant dashboard. Full documentation and sandbox environment provided.' },
    { step: '02', title: 'Configuration', desc: 'Select products, set denominations, configure delivery methods, and customize branding to match your platform.' },
    { step: '03', title: 'Distribution', desc: 'Trigger instant delivery via API call, scheduled batch, or manual dashboard action. Recipients get codes in seconds.' },
    { step: '04', title: 'Tracking', desc: 'Monitor redemption rates, track inventory, view analytics, and generate reports through our real-time dashboard.' },
  ],
  contactTitle: 'Company Information',
  contactEmail: 'Email',
  contactAddress: 'Registered Address',
  contactState: 'Jurisdiction',
  contactEin: 'EIN (Tax ID)',
  contactReg: 'Entity Number',
  contactHours: 'Business Hours',
  contactHoursVal: 'Monday - Friday, 9:00 AM - 6:00 PM MST',
  contactResponse: 'Response Time',
  contactResponseVal: 'Within 24 business hours',
  operationTitle: 'Our Operation',
  operationDesc: 'MISTCURRENT LLC operates as a fully digital enterprise. Our distributed team and cloud-native infrastructure enable us to serve clients globally without the constraints of physical locations. All business operations, client onboarding, and support are conducted through secure digital channels.',
  operationPoints: ['Cloud-native infrastructure with 99.9% uptime SLA', 'Distributed team across multiple time zones', 'Secure digital onboarding and support channels', '24/7 automated transaction processing', 'Scalable architecture handling millions of transactions'],
  partnersTitle: 'Trusted Brand Partners',
  partnersDesc: 'We work with the world\'s leading brands to deliver digital value seamlessly.',
  footerRights: '2025 MISTCURRENT LLC. All rights reserved.',
  footerPrivacy: 'Privacy Policy',
  footerTerms: 'Terms of Service',
  footerTagline: 'Digital Rewards Infrastructure',
};

const zh = {
  title: 'MISTCURRENT LLC — 全球数字奖励基础设施',
  langBtn: 'EN',
  heroTag: '值得信赖的数字商务',
  heroTitle: '驱动数字奖励的未来',
  heroDesc: '构建安全的数字礼品卡、预付奖励和忠诚度计划基础设施，服务覆盖全球 40+ 个国家。',
  statsTransactions: '已处理交易',
  statsCountries: '服务国家',
  statsPartners: '品牌合作伙伴',
  statsUptime: '平台在线率',
  aboutTitle: '关于 MISTCURRENT',
  aboutP1: 'MISTCURRENT LLC 是一家在美国怀俄明州注册的数字商务公司。我们专注于数字价值的程序化分发——从礼品卡和预付工具到忠诚度积分和促销奖励。',
  aboutP2: '我们的平台通过统一的 API 连接品牌、商户和终端用户，实现大规模数字商品的即时交付。无论是单笔消费者购买还是企业批量订单，我们的基础设施都能以同样的可靠性和速度处理。',
  aboutP3: '我们以让数字价值转移无摩擦为使命，服务的客户涵盖电商平台、金融科技公司，以及运营员工激励计划的人力资源部门。',
  servicesTitle: '我们的服务',
  services: [
    { title: '数字礼品卡', desc: '即时交付来自 200+ 品牌的礼品卡，包括 Apple、Google Play、Amazon、Steam、PlayStation、Xbox、Netflix、Spotify 及各地区零售商。支持 40+ 个国家的本地货币。', features: ['实时激活', '批量订购 API', '白标解决方案', '多币种支持'] },
    { title: '预付奖励卡', desc: '用于员工激励、客户返现、调研奖励和促销活动的虚拟及实体预付卡。完全可定制面额，从 $5 到 $10,000。', features: ['自定义品牌', '可编程消费规则', '实时余额追踪', '即时数字交付'] },
    { title: '忠诚度与积分平台', desc: '端到端的忠诚度计划基础设施。跨渠道发行、管理和兑换积分。与现有 CRM 和营销自动化工具集成。', features: ['积分发行引擎', '兑换目录', '分析仪表板', '全渠道集成'] },
    { title: '企业解决方案', desc: '为大规模奖励分发量身定制的 B2B 解决方案。专属客户经理、自定义 SLA 和企业级安全，适用于高交易量组织。', features: ['专属基础设施', '自定义 API 集成', '优先支持', '批量定价'] },
  ],
  complianceTitle: '合规与安全',
  complianceDesc: '信任是数字商务的基石。我们维护严格的合规标准和安全实践，保护平台上的每一笔交易。',
  complianceItems: [
    { title: '反洗钱', desc: '完全符合 AML 合规要求，包括交易监控、可疑活动报告和基于风险的客户尽职调查程序。' },
    { title: 'KYC 验证', desc: '对所有企业账户实施严格的了解客户流程，包括身份验证、受益所有权检查和持续监控。' },
    { title: '数据保护', desc: '所有传输中和静态数据的端到端加密。定期渗透测试和符合 SOC 2 标准的安全控制。' },
    { title: '监管合规', desc: '遵守 FinCEN 指南、适用的州货币传输法规以及国际数字商务标准。' },
    { title: '交易安全', desc: '多层欺诈检测、速率检查和实时交易评分，防止未经授权的使用。' },
    { title: '审计与报告', desc: '完整的交易审计追踪、自动化监管报告和所有运营的透明记录保存。' },
  ],
  processTitle: '运作流程',
  processSteps: [
    { step: '01', title: '接入集成', desc: '通过我们的 RESTful API 连接或使用商户仪表板。提供完整文档和沙盒环境。' },
    { step: '02', title: '配置设定', desc: '选择产品、设置面额、配置交付方式，并自定义品牌以匹配您的平台。' },
    { step: '03', title: '即时分发', desc: '通过 API 调用、计划批次或手动仪表板操作触发即时交付。接收者在数秒内获得代码。' },
    { step: '04', title: '追踪分析', desc: '通过实时仪表板监控兑换率、追踪库存、查看分析并生成报告。' },
  ],
  contactTitle: '公司信息',
  contactEmail: '电子邮箱',
  contactAddress: '注册地址',
  contactState: '注册管辖区',
  contactEin: 'EIN（税号）',
  contactReg: '公司编号',
  contactHours: '营业时间',
  contactHoursVal: '周一至周五，上午 9:00 - 下午 6:00（山地时间）',
  contactResponse: '响应时间',
  contactResponseVal: '24 个工作小时内',
  operationTitle: '运营模式',
  operationDesc: 'MISTCURRENT LLC 作为完全数字化企业运营。我们的分布式团队和云原生基础设施使我们能够在不受物理位置限制的情况下为全球客户提供服务。所有业务运营、客户入驻和支持均通过安全的数字渠道进行。',
  operationPoints: ['云原生基础设施，99.9% 在线率 SLA', '跨多个时区的分布式团队', '安全的数字化入驻和支持渠道', '7x24 小时自动化交易处理', '可扩展架构处理数百万笔交易'],
  partnersTitle: '值得信赖的品牌合作伙伴',
  partnersDesc: '我们与全球领先品牌合作，无缝交付数字价值。',
  footerRights: '2025 MISTCURRENT LLC. 保留所有权利。',
  footerPrivacy: '隐私政策',
  footerTerms: '服务条款',
  footerTagline: '数字奖励基础设施',
};

export default function AboutPage() {
  const [lang, setLang] = useState<'en' | 'zh'>('en');
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const t = lang === 'en' ? en : zh;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isVisible = (id: string) => visible.has(id);

  return (
    <>
      <Head>
        <title>{t.title}</title>
        <meta name="description" content="MISTCURRENT LLC - Global digital rewards infrastructure. Gift cards, prepaid rewards, and loyalty programs for businesses worldwide." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

      </Head>

      <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <Confetti />
        {/* Nav */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <img src="/logo-transparent.png" alt="MISTCURRENT" className="w-8 h-8 object-contain" />
                <span className={`text-sm font-semibold tracking-wide ${scrolled ? 'text-slate-900' : 'text-white'}`}>MISTCURRENT</span>
              </div>
              <button
                onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${scrolled ? 'border-slate-300 text-slate-600 hover:bg-slate-50' : 'border-white/30 text-white/90 hover:bg-white/10'}`}
              >
                {t.langBtn}
              </button>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative overflow-hidden bg-slate-900 min-h-[620px] md:min-h-[680px]">
          <div className="absolute inset-0 bg-[url('/2026.3.jpg')] bg-cover bg-center opacity-50"></div>
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative max-w-6xl mx-auto px-6 lg:px-8 pt-28 pb-12 md:pt-32 md:pb-16">
            <div className="max-w-[640px] min-h-[280px]">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-5">{t.heroTag}</span>
              <h1 className="max-w-[12ch] text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] mb-5">{t.heroTitle}</h1>
              <p className="max-w-[46ch] text-base sm:text-lg text-slate-200/90 leading-7">{t.heroDesc}</p>
              <a href="https://work.weixin.qq.com/ca/cawcdea247fcf9b646" target="_blank" rel="noopener noreferrer" className="inline-flex items-center mt-7 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-emerald-500/25">
                {lang === 'en' ? 'Contact Us' : '立即联系'}
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
            <div className="grid max-w-4xl grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 pt-10 mt-6 border-t border-white/10">
              {[
                { val: '2M+', label: t.statsTransactions },
                { val: '40+', label: t.statsCountries },
                { val: '200+', label: t.statsPartners },
                { val: '99.9%', label: t.statsUptime },
              ].map((s, i) => (
                <div key={i} className="min-w-0">
                  <div className="text-2xl md:text-3xl font-bold tracking-tight text-white">{s.val}</div>
                  <div className="mt-2 max-w-[14ch] text-sm leading-6 text-slate-300/80">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Partners Marquee */}
        <section className="py-20 bg-white border-b border-slate-100 overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 mb-12">
            <p className="text-sm text-slate-400 text-center">{t.partnersTitle}</p>
          </div>
          <div className="relative h-20 flex items-center">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
            <div className="flex animate-marquee space-x-16 items-center">
              {['/steam-icon-logo.svg', '/playstation-logo-and-wordmark.svg', '/xbox-one-2.svg', '/nintendo-switch-1.svg', '/spotify-logo-with-text-1.svg', '/roblox-10.svg', '/ebay-1.svg', '/visa-10.svg', '/mastercard-modern-design-.svg', '/paypal-4.svg', '/google-pay-2.svg', '/steam-icon-logo.svg', '/playstation-logo-and-wordmark.svg', '/xbox-one-2.svg', '/nintendo-switch-1.svg', '/spotify-logo-with-text-1.svg', '/roblox-10.svg', '/ebay-1.svg', '/visa-10.svg', '/mastercard-modern-design-.svg', '/paypal-4.svg', '/google-pay-2.svg'].map((src, i) => (
                <img key={i} src={src} alt="" className="h-10 w-auto max-w-[120px] opacity-40 hover:opacity-80 transition-opacity grayscale hover:grayscale-0 flex-shrink-0" />
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" data-animate className="py-20 bg-white">
          <div className={`max-w-6xl mx-auto px-6 lg:px-8 transition-all duration-700 ${isVisible('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">{t.aboutTitle}</h2>
              <div className="space-y-5 text-slate-600 leading-relaxed text-base">
                <p>{t.aboutP1}</p>
                <p>{t.aboutP2}</p>
                <p>{t.aboutP3}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" data-animate className="py-20 bg-slate-50">
          <div className={`max-w-6xl mx-auto px-6 lg:px-8 transition-all duration-700 ${isVisible('services') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t.servicesTitle}</h2>
            <div className="w-12 h-0.5 bg-emerald-500 mb-12"></div>
            <div className="grid md:grid-cols-2 gap-8">
              {t.services.map((svc, i) => (
                <div key={i} className="bg-white rounded-xl p-8 border border-slate-100 hover:border-slate-200 transition-all hover:shadow-lg group">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center mb-5 group-hover:bg-emerald-600 transition-colors">
                    <span className="text-white text-sm font-bold">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{svc.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-5">{svc.desc}</p>
                  <ul className="space-y-2">
                    {svc.features.map((f, j) => (
                      <li key={j} className="flex items-center text-sm text-slate-500">
                        <span className="w-1 h-1 bg-emerald-500 rounded-full mr-2.5"></span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section id="process" data-animate className="py-20 bg-white">
          <div className={`max-w-6xl mx-auto px-6 lg:px-8 transition-all duration-700 ${isVisible('process') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t.processTitle}</h2>
            <div className="w-12 h-0.5 bg-emerald-500 mb-12"></div>
            <div className="grid md:grid-cols-4 gap-8">
              {t.processSteps.map((step, i) => (
                <div key={i} className="relative">
                  <div className="text-5xl font-bold text-slate-100 mb-4">{step.step}</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance */}
        <section id="compliance" data-animate className="py-20 bg-slate-900">
          <div className={`max-w-6xl mx-auto px-6 lg:px-8 transition-all duration-700 ${isVisible('compliance') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl font-bold text-white mb-4">{t.complianceTitle}</h2>
            <p className="text-slate-400 max-w-2xl mb-12">{t.complianceDesc}</p>
            <div className="grid md:grid-cols-3 gap-6">
              {t.complianceItems.map((item, i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/30 transition-colors">
                  <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Operation */}
        <section id="operation" data-animate className="py-20 bg-white">
          <div className={`max-w-6xl mx-auto px-6 lg:px-8 transition-all duration-700 ${isVisible('operation') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">{t.operationTitle}</h2>
                <p className="text-slate-600 leading-relaxed mb-8">{t.operationDesc}</p>
                <ul className="space-y-3">
                  {t.operationPoints.map((p, i) => (
                    <li key={i} className="flex items-start text-sm text-slate-600">
                      <svg className="w-4 h-4 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100">
                      <span className="text-xs text-slate-500">API Requests / min</span>
                      <span className="text-sm font-semibold text-slate-900">12,847</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100">
                      <span className="text-xs text-slate-500">Avg Response</span>
                      <span className="text-sm font-semibold text-emerald-600">43ms</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100">
                      <span className="text-xs text-slate-500">Success Rate</span>
                      <span className="text-sm font-semibold text-slate-900">99.97%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100">
                      <span className="text-xs text-slate-500">Integrations</span>
                      <span className="text-sm font-semibold text-slate-900">1,240</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" data-animate className="py-20 bg-slate-50">
          <div className={`max-w-6xl mx-auto px-6 lg:px-8 transition-all duration-700 ${isVisible('contact') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t.contactTitle}</h2>
            <div className="w-12 h-0.5 bg-emerald-500 mb-12"></div>
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              <div className="divide-y divide-slate-100">
                {[
                  [t.contactEmail, 'wanghaojie@claudioweb.cn'],
                  [t.contactAddress, '30 N Gould St Ste R, Sheridan, WY 82801, United States'],
                  [t.contactState, 'Wyoming, United States'],
                  [t.contactEin, '98-1936546'],
                  [t.contactReg, '2026-001965662'],
                  [t.contactHours, t.contactHoursVal],
                  [t.contactResponse, t.contactResponseVal],
                ].map(([label, value], i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center px-8 py-5">
                    <span className="text-sm font-medium text-slate-400 sm:w-56 mb-1 sm:mb-0">{label}</span>
                    <span className="text-sm text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 border-t border-slate-800">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <img src="/logo-transparent.png" alt="MISTCURRENT" className="w-6 h-6 object-contain" />
                  <span className="text-sm font-semibold text-white">MISTCURRENT</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{t.footerTagline}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 mb-3">Legal</p>
                <div className="space-y-2">
                  <span className="block text-xs text-slate-500">{t.footerPrivacy}</span>
                  <span className="block text-xs text-slate-500">{t.footerTerms}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 mb-3">Contact</p>
                <p className="text-xs text-slate-500">wanghaojie@claudioweb.cn</p>
                <p className="text-xs text-slate-500 mt-1">Sheridan, WY, United States</p>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
              <p className="text-xs text-slate-500">{t.footerRights}</p>
              <div className="flex items-center space-x-4">
                <img src="/visa-10.svg" alt="Visa" className="h-5 opacity-40" />
                <img src="/mastercard-modern-design-.svg" alt="Mastercard" className="h-5 opacity-40" />
                <img src="/paypal-4.svg" alt="PayPal" className="h-5 opacity-40" />
                <img src="/google-pay-2.svg" alt="Google Pay" className="h-5 opacity-40" />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
