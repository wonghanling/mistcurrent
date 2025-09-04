# MistCurrent VPN 支付系统集成文档

## 项目概述

MistCurrent 是一个 VPN 服务网站，集成了 Airwallex 支付系统和 Supabase 用户认证。用户可以通过任意邮箱购买 VPN 套餐，支付成功后通过登录/注册获取专属的 VPN 节点订阅链接。

## 技术栈

- **前端框架**: Next.js 15.5.2 + TypeScript
- **样式**: Tailwind CSS
- **用户认证**: Supabase Auth
- **支付系统**: Airwallex
- **部署**: Render (https://mistcurrent.onrender.com)

## 核心功能

### 1. 支付流程
1. 用户在网站选择 VPN 套餐
2. 通过 Airwallex 完成支付
3. 支付成功跳转到自定义支付成功页面
4. 支付失败跳转到支付失败页面

### 2. 用户认证
- 支付成功后用户可以登录或注册
- 注册时发送邮箱验证
- 登录成功后获取 VPN 订阅链接

### 3. VPN 订阅
- 每个用户获得唯一的订阅 URL
- URL 包含用户邮箱和生成的令牌
- 可复制到 VPN 客户端使用

## 文件结构

```
D:\项目\mistcurrent-com\
├── lib/
│   ├── airwallex.ts          # Airwallex 支付服务
│   └── supabase.ts           # Supabase 认证服务
├── pages/
│   ├── api/
│   │   ├── payment/
│   │   │   └── create.ts     # 创建支付意图 API
│   │   └── webhook/
│   │       └── airwallex.ts  # Airwallex webhook 处理
│   ├── payment/
│   │   ├── success.tsx       # 支付成功页面
│   │   └── failed.tsx        # 支付失败页面
│   └── account.tsx           # 订阅管理页面（待开发）
├── .env.local                # 环境变量配置
└── PROJECT_DOCUMENTATION.md  # 本文档
```

## 环境变量配置

### .env.local 文件配置

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://zpqtktstvbiurdwdkech.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwcXRrdHN0dmJpdXJkd2RrZWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MTMxMTYsImV4cCI6MjA3MjQ4OTExNn0.aj5KlC_OwlNEeGWr7KdGrZ6RCxtaGIKBux9VgWBqmQA

# 网站基础 URL
NEXT_PUBLIC_BASE_URL=https://mistcurrent.onrender.com

# Airwallex 配置
AIRWALLEX_CLIENT_ID=your_client_id
AIRWALLEX_SECRET_KEY=your_secret_key
AIRWALLEX_ACCOUNT_ID=your_account_id
AIRWALLEX_API_URL=https://api-demo.airwallex.com/api/v1
AIRWALLEX_WEBHOOK_SECRET=whsec_S_AOfJDKQ1fz-9KgYeMXX7gIDYAvxWVq

# 开发模式配置
NODE_ENV=development
AIRWALLEX_MOCK_MODE=true
```

## 支付套餐配置

```typescript
const plans = {
  '1month': { name: '1个月套餐', price: 11.99 },
  '6month': { name: '6个月套餐', price: 41.94 },
  '12month': { name: '12个月套餐', price: 71.88 },
  '2year': { name: '2年+2个月免费', price: 52.56 }
};
```

## Airwallex Webhook 配置

### Webhook URL
```
https://mistcurrent.onrender.com/api/webhook/airwallex
```

### 事件配置
- 已设置为"全选"所有事件
- 主要监听支付成功/失败事件
- 自动更新用户订阅状态

### 回调 URL 配置
- **成功回调**: `https://mistcurrent.onrender.com/payment/success?order_id={order_id}`
- **失败回调**: `https://mistcurrent.onrender.com/payment/failed?order_id={order_id}`

## 页面设计规范

### 通用设计元素
- **顶部黑条**: 包含白色 "MistCurrent" 标志
- **现代时尚风格**: 匹配网站整体设计
- **响应式布局**: 适配移动端和桌面端

### 支付成功页面特色
- 世界扫盲日图片 (41.png)
- 动态绿色打勾动画效果
- 登录/注册卡片组件
- VPN 订阅链接复制功能

### 支付失败页面特色
- 红色 X 动态效果
- 简洁的失败提示
- 返回主页按钮

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 生产环境启动
npm start
```

## 常见问题解决

### 1. 开发服务器端口冲突
```bash
# 查看端口占用
netstat -ano | findstr :3000

# 杀死进程
taskkill /PID [进程ID] /F

# 或使用内置命令停止所有 node 进程
taskkill /f /im node.exe
```

### 2. 页面更改不生效
- 清除 `.next` 缓存文件夹
- 硬刷新浏览器 (Ctrl+Shift+R)
- 重启开发服务器

### 3. Supabase 认证错误
- 检查环境变量是否正确配置
- 验证 Supabase 项目 URL 和密钥
- 确保 RLS 策略正确设置

## 部署信息

### 生产环境
- **域名**: https://mistcurrent.onrender.com
- **平台**: Render
- **自动部署**: Git 推送触发

### 环境变量设置
确保生产环境中所有环境变量都已正确配置：
- Supabase 连接信息
- Airwallex API 凭据
- Webhook 密钥
- 基础 URL

## 业务流程

### 购买流程
1. 用户访问网站选择套餐
2. 点击购买跳转 Airwallex 支付页面
3. 完成支付后跳转到自定义成功页面
4. 用户进行登录或注册
5. 获取专属 VPN 订阅链接

### 订阅管理
- 用户可通过账户页面管理订阅
- 查看订阅状态和到期时间
- 下载配置文件或获取订阅链接

## 安全考虑

### API 安全
- 所有支付 API 都有适当的验证
- Webhook 签名验证防止伪造请求
- 敏感信息通过环境变量管理

### 用户数据保护
- Supabase 自动处理密码加密
- 用户邮箱验证机制
- 订阅令牌定期更新

## 后续开发计划

1. **订阅管理页面**
   - 完善账户信息显示
   - 添加订阅续费功能
   - 使用统计展示

2. **用户体验优化**
   - 添加支付进度指示
   - 优化移动端体验
   - 多语言支持

3. **管理后台**
   - 用户管理界面
   - 订单统计分析
   - 系统监控面板

## 联系信息

项目开发时间: 2025年
技术支持: Claude Code Assistant
最后更新: 2025-09-04

---

*此文档记录了 MistCurrent VPN 支付系统的完整实现过程，包括技术架构、配置信息和开发流程。*