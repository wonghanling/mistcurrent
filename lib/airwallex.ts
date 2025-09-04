// Airwallex 支付集成服务
import axios from 'axios';

// Airwallex API 配置
interface AirwallexConfig {
  clientId: string;
  secretKey: string;
  accountId: string;
  apiUrl: string;
}

// 支付意图创建请求
interface PaymentIntentRequest {
  amount: number;
  currency: string;
  order_id: string;
  customer_email: string;
  customer_name: string;
  description: string;
  return_url: string;
  cancel_url: string;
  webhook_url?: string;
}

// 支付意图响应
interface PaymentIntentResponse {
  id: string;
  client_secret: string;
  status: string;
  amount: number;
  currency: string;
  order_id: string;
}

// Airwallex 错误响应
interface AirwallexError {
  code: string;
  message: string;
  details?: any;
}

export class AirwallexService {
  private config: AirwallexConfig;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    this.config = {
      clientId: process.env.AIRWALLEX_CLIENT_ID || '',
      secretKey: process.env.AIRWALLEX_SECRET_KEY || '',
      accountId: process.env.AIRWALLEX_ACCOUNT_ID || '',
      apiUrl: process.env.AIRWALLEX_API_URL || 'https://api-demo.airwallex.com/api/v1'
    };
  }

  // 获取访问令牌
  private async getAccessToken(): Promise<string> {
    // 如果token存在且未过期，直接返回
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      console.log('尝试获取 Airwallex token...', {
        apiUrl: this.config.apiUrl,
        clientId: this.config.clientId ? this.config.clientId.substring(0, 8) + '***' : 'missing',
        secretKey: this.config.secretKey ? 'provided' : 'missing'
      });

      // 尝试多种认证方式
      let response;
      
      // 方式1: 使用 Basic Auth
      try {
        const basicAuth = Buffer.from(`${this.config.clientId}:${this.config.secretKey}`).toString('base64');
        response = await axios.post(
          `${this.config.apiUrl}/authentication/login`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Basic ${basicAuth}`
            }
          }
        );
      } catch (basicAuthError: any) {
        console.log('Basic Auth 失败, 尝试 Header Auth...', basicAuthError.response?.data);
        
        // 方式2: 使用 Headers
        response = await axios.post(
          `${this.config.apiUrl}/authentication/login`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'x-client-id': this.config.clientId,
              'x-api-key': this.config.secretKey
            }
          }
        );
      }

      this.accessToken = response.data.token;
      // 设置token过期时间（通常是1小时，这里设为55分钟安全起见）
      this.tokenExpiry = new Date(Date.now() + 55 * 60 * 1000);
      
      if (!this.accessToken) {
        throw new Error('未能获取访问令牌');
      }
      
      console.log('成功获取 Airwallex token');
      return this.accessToken;
      
    } catch (error: any) {
      console.error('获取Airwallex访问令牌失败:', error.response?.data || error.message);
      
      // 如果是认证问题，提供更详细的错误信息
      if (error.response?.data?.code === 'credentials_invalid') {
        throw new Error('Airwallex 认证凭据无效，请检查 Client ID 和 Secret Key');
      }
      
      throw new Error('认证失败: ' + (error.response?.data?.message || error.message));
    }
  }

  // 生成订单号
  private generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9).toUpperCase();
    return `ORDER_${timestamp}_${random}`;
  }

  // 创建支付意图
  async createPaymentIntent(params: {
    planId: string;
    amount: number;
    customerEmail: string;
    customerName: string;
  }): Promise<PaymentIntentResponse> {
    try {
      // 临时模拟支付意图（用于开发测试）
      if (process.env.NODE_ENV === 'development' && process.env.AIRWALLEX_MOCK_MODE === 'true') {
        console.log('模拟模式：跳过真实 Airwallex API 调用');
        const mockOrderId = this.generateOrderId();
        
        return {
          id: `pi_mock_${Date.now()}`,
          client_secret: `pi_mock_${Date.now()}_secret`,
          status: 'requires_confirmation',
          amount: Math.round(params.amount * 100),
          currency: 'USD',
          order_id: mockOrderId
        };
      }

      const token = await this.getAccessToken();
      const orderId = this.generateOrderId();

      const requestData: PaymentIntentRequest = {
        amount: Math.round(params.amount * 100), // 转换为分
        currency: 'USD',
        order_id: orderId,
        customer_email: params.customerEmail,
        customer_name: params.customerName,
        description: `MistCurrent VPN - ${params.planId}套餐`,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?order_id=${orderId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?plan=${params.planId}`,
        webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/airwallex`
      };

      const response = await axios.post(
        `${this.config.apiUrl}/pa/payment_intents`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-api-version': '2024-01-01'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('创建支付意图失败:', error.response?.data || error.message);
      const errorData: AirwallexError = error.response?.data || {
        code: 'UNKNOWN_ERROR',
        message: '支付初始化失败，请重试'
      };
      throw errorData;
    }
  }

  // 确认支付意图
  async confirmPaymentIntent(paymentIntentId: string): Promise<any> {
    try {
      const token = await this.getAccessToken();

      const response = await axios.post(
        `${this.config.apiUrl}/pa/payment_intents/${paymentIntentId}/confirm`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-api-version': '2024-01-01'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('确认支付失败:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  }

  // 查询支付状态
  async getPaymentIntent(paymentIntentId: string): Promise<any> {
    try {
      const token = await this.getAccessToken();

      const response = await axios.get(
        `${this.config.apiUrl}/pa/payment_intents/${paymentIntentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-api-version': '2024-01-01'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('查询支付状态失败:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  }

  // 处理Webhook签名验证
  static verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    // Airwallex webhook签名验证逻辑
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return signature === expectedSignature;
  }
}

// 导出单例实例
export const airwallexService = new AirwallexService();