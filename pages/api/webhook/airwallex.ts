import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { supabase } from '../../../lib/supabase';

// Airwallex webhook 签名验证
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
  
  // Airwallex 签名格式通常是 "sha256=xxx"
  const receivedSignature = signature.replace('sha256=', '');
  
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(receivedSignature, 'hex')
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 获取原始请求体
    const rawBody = JSON.stringify(req.body);
    const signature = req.headers['x-signature'] as string;
    const webhookSecret = process.env.AIRWALLEX_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('Webhook secret not configured');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    // 验证签名
    if (signature && !verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    console.log('Airwallex webhook received:', event);

    // 处理不同的事件类型
    switch (event.name) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
      
      case 'payment_intent.cancelled':
        await handlePaymentCancelled(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.name}`);
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  try {
    const orderId = paymentIntent.metadata?.order_id;
    
    if (!orderId) {
      console.error('No order_id found in payment metadata');
      return;
    }

    // 更新订单状态为已支付
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: 'paid',
        payment_intent_id: paymentIntent.id,
        paid_at: new Date().toISOString()
      })
      .eq('order_id', orderId);

    if (error) {
      console.error('Failed to update order status:', error);
      return;
    }

    console.log(`Payment successful for order: ${orderId}`);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailure(paymentIntent: any) {
  try {
    const orderId = paymentIntent.metadata?.order_id;
    
    if (!orderId) {
      console.error('No order_id found in payment metadata');
      return;
    }

    // 更新订单状态为支付失败
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: 'failed',
        payment_intent_id: paymentIntent.id,
        failed_at: new Date().toISOString()
      })
      .eq('order_id', orderId);

    if (error) {
      console.error('Failed to update order status:', error);
      return;
    }

    console.log(`Payment failed for order: ${orderId}`);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handlePaymentCancelled(paymentIntent: any) {
  try {
    const orderId = paymentIntent.metadata?.order_id;
    
    if (!orderId) {
      console.error('No order_id found in payment metadata');
      return;
    }

    // 更新订单状态为已取消
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: 'cancelled',
        payment_intent_id: paymentIntent.id,
        cancelled_at: new Date().toISOString()
      })
      .eq('order_id', orderId);

    if (error) {
      console.error('Failed to update order status:', error);
      return;
    }

    console.log(`Payment cancelled for order: ${orderId}`);
  } catch (error) {
    console.error('Error handling payment cancellation:', error);
  }
}