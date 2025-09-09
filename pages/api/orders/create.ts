// 订单创建 API 端点
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 初始化Supabase客户端（可选，支持模拟模式）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseServiceKey && supabaseUrl !== 'your_supabase_url/') {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
  } catch (error) {
    console.warn('Supabase初始化失败，使用模拟模式:', error);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持POST请求' });
  }

  try {
    const { 
      orderId, 
      planName, 
      price, 
      status, 
      paymentIntentId, 
      planType, 
      customerEmail 
    } = req.body;

    // 验证必要参数
    if (!orderId || !customerEmail) {
      return res.status(400).json({
        error: '缺少必要参数',
        details: {
          orderId: !orderId ? '订单ID必填' : null,
          customerEmail: !customerEmail ? '邮箱必填' : null
        }
      });
    }

    // 准备订单数据
    const orderData = {
      id: orderId,
      customer_email: customerEmail,
      plan_name: planName || 'Unknown Plan',
      plan_type: planType || 'unknown',
      price: price || 0,
      currency: 'USD',
      status: status || 'pending',
      payment_method: 'airwallex',
      payment_intent_id: paymentIntentId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const isDevelopment = process.env.NODE_ENV === 'development';
    const useMockMode = isDevelopment || !supabase;

    if (useMockMode) {
      // 模拟模式 - 直接返回成功
      console.log('模拟模式：保存订单数据', orderData);
      
      res.status(200).json({
        success: true,
        data: orderData,
        mock: true
      });
      
    } else {
      // 真实模式 - 保存到Supabase
      if (!supabase) {
        return res.status(500).json({
          success: false,
          error: 'Supabase未正确初始化'
        });
      }
      
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select();

      if (error) {
        console.error('保存订单失败:', error);
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      res.status(200).json({
        success: true,
        data: data[0]
      });
    }

  } catch (error: any) {
    console.error('订单创建异常:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || '订单创建失败'
    });
  }
}