# MistCurrnet VPN 订阅网站

一个使用 Next.js + Tailwind CSS 构建的现代化 VPN 订阅服务网站，对标 NordVPN、ExpressVPN 等顶级 VPN 服务商的设计风格。

## 🚀 功能特性

- **响应式设计** - 完美适配桌面端、平板和移动设备
- **现代化UI** - 使用 Tailwind CSS 构建的精美界面
- **动态动画** - 流畅的滚动动画和交互效果  
- **营销弹窗** - 智能化的促销弹窗系统
- **SEO优化** - 完整的SEO元数据和结构化数据
- **多页面支持** - 首页、定价页面等完整页面结构

## 📦 项目结构

```
mistcurrent-com/
├── components/
│   ├── Navbar.tsx      # 导航栏组件
│   ├── Hero.tsx        # 首页英雄区域
│   ├── Features.tsx    # 功能特性展示
│   ├── Pricing.tsx     # 价格方案
│   ├── PromoPopup.tsx  # 营销弹窗
│   └── Footer.tsx      # 页脚组件
├── pages/
│   ├── index.tsx       # 首页
│   ├── pricing.tsx     # 定价页面
│   ├── _app.tsx        # App 根组件
│   └── _document.tsx   # 文档结构
├── styles/
│   └── globals.css     # 全局样式
├── tailwind.config.js  # Tailwind 配置
├── next.config.js      # Next.js 配置
├── package.json        # 项目依赖
└── tsconfig.json       # TypeScript 配置
```

## 🛠️ 技术栈

- **Next.js 15** - React 全栈框架
- **TypeScript** - 类型安全
- **Tailwind CSS 3** - 原子化CSS框架
- **Heroicons** - 精美图标库
- **响应式设计** - 移动端优先

## 🎨 设计特色

- **渐变背景** - 动态渐变背景效果
- **玻璃拟态** - 半透明玻璃效果
- **悬浮动画** - 鼠标悬停交互效果
- **滚动动画** - 元素进入视口时的淡入动画
- **现代排版** - 清晰的视觉层次和间距

## 🚀 快速开始

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```

3. **构建生产版本**
   ```bash
   npm run build
   ```

4. **启动生产服务器**
   ```bash
   npm start
   ```

## 📱 页面功能

### 首页 (index.tsx)
- Hero 区域：品牌展示 + CTA按钮
- 功能特性：6个核心功能展示卡片
- 价格方案：三套餐对比 + 年付优惠
- 营销弹窗：30秒后自动弹出限时优惠

### 定价页面 (pricing.tsx)
- 价格对比表：详细的套餐对比
- 常见问题：FAQ部分
- 支付保障：安全支付说明

## 🎯 营销功能

- **智能弹窗** - 30秒后自动显示优惠信息
- **倒计时** - 营造紧迫感的限时优惠
- **社会证明** - 用户数量和信任标识
- **退款保证** - 30天退款承诺降低用户顾虑

## 📊 SEO优化

- 完整的 Meta 标签
- Open Graph 社交媒体分享
- Twitter Card 支持
- JSON-LD 结构化数据
- 语义化 HTML 结构

## 🌍 国际化准备

项目使用中文内容，但结构支持多语言扩展。可以轻松添加英文等其他语言版本。

## 📝 License

MIT License - 可自由使用于商业和非商业项目。

---

**MistCurrnet - 雾中自由畅行** 🌫️