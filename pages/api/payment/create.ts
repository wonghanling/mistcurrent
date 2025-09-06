// Airwallex 支付处理 API 端点
import { NextApiRequest, NextApiResponse } from 'next';
import { airwallexService } from '../../../lib/airwallex';
import { createClient } from '@supabase/supabase-js';

// 初始化Supabase客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持POST请求' });
  }

  try {
    const { planId, customerEmail, customerName } = req.body;

    // 验证必要参数
    if (!planId || !customerEmail || !customerName) {
      return res.status(400).json({
        error: '缺少必要参数',
        details: {
          planId: !planId ? '套餐ID必填' : null,
          customerEmail: !customerEmail ? '邮箱必填' : null,
          customerName: !customerName ? '姓名必填' : null
        }
      });
    }

    // 套餐价格映射
    const plans = {
      '1month': { name: '1个月套餐', price: 11.99 },
      '6month': { name: '6个月套餐', price: 41.94 },
      '12month': { name: '12个月套餐', price: 71.88 },
      '2year': { name: '2年+2个月免费', price: 52.56 }
    };

    const selectedPlan = plans[planId as keyof typeof plans];
    if (!selectedPlan) {
      return res.status(400).json({ error: '无效的套餐ID' });
    }

    // 创建支付意图
    const paymentIntent = await airwallexService.createPaymentIntent({
      planId,
      amount: selectedPlan.price,
      customerEmail,
      customerName
    });

    // 返回支付信息
    res.status(200).json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        order_id: paymentIntent.order_id
      },
      plan: selectedPlan
    });

  } catch (error: any) {
    console.error('创建支付意图失败:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || '支付初始化失败',
      code: error.code || 'PAYMENT_ERROR'
    });
  }
}