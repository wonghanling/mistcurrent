import { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { getSupabaseAdmin } from '../../../lib/supabaseAdmin'
import { ensureSubscriptionForOrder } from '../../../lib/serverSubscriptions'

export const config = {
  api: {
    bodyParser: false,
  },
}

const verifyWebhookSignature = (payload: string, signature: string, secret: string): boolean => {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex')

  const receivedSignature = signature.replace('sha256=', '')

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(receivedSignature, 'hex')
    )
  } catch (err) {
    return false
  }
}

const readRawBody = async (req: NextApiRequest): Promise<string> => {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks).toString('utf8')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const rawBody = await readRawBody(req)
    const signature = (req.headers['x-signature'] as string) || ''
    const webhookSecret = process.env.AIRWALLEX_WEBHOOK_SECRET

    if (!webhookSecret) {
      return res.status(500).json({ error: 'Webhook secret not configured' })
    }

    if (!signature || !verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      return res.status(401).json({ error: 'Invalid signature' })
    }

    const event = JSON.parse(rawBody)
    const supabase = getSupabaseAdmin()

    switch (event.name) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(supabase, event.data.object)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(supabase, event.data.object)
        break
      case 'payment_intent.cancelled':
        await handlePaymentCancelled(supabase, event.data.object)
        break
      default:
        break
    }

    return res.status(200).json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return res.status(500).json({ error: 'Webhook processing failed' })
  }
}

const extractOrderId = (paymentIntent: any): string | null => {
  return paymentIntent?.metadata?.order_id || paymentIntent?.order_id || null
}

async function handlePaymentSuccess(supabase: ReturnType<typeof getSupabaseAdmin>, paymentIntent: any) {
  const orderId = extractOrderId(paymentIntent)
  if (!orderId) return

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('order_id', orderId)
    .limit(1)

  if (!orders || orders.length === 0) return

  const order = orders[0]

  await supabase
    .from('orders')
    .update({
      status: 'paid',
      payment_intent_id: paymentIntent.id,
      paid_at: new Date().toISOString(),
    })
    .eq('order_id', orderId)

  await ensureSubscriptionForOrder(supabase, {
    order_id: order.order_id,
    user_id: order.user_id,
    customer_email: order.customer_email,
    plan_id: order.plan_id,
  })
}

async function handlePaymentFailure(supabase: ReturnType<typeof getSupabaseAdmin>, paymentIntent: any) {
  const orderId = extractOrderId(paymentIntent)
  if (!orderId) return

  await supabase
    .from('orders')
    .update({
      status: 'failed',
      payment_intent_id: paymentIntent.id,
      failed_at: new Date().toISOString(),
    })
    .eq('order_id', orderId)
}

async function handlePaymentCancelled(supabase: ReturnType<typeof getSupabaseAdmin>, paymentIntent: any) {
  const orderId = extractOrderId(paymentIntent)
  if (!orderId) return

  await supabase
    .from('orders')
    .update({
      status: 'cancelled',
      payment_intent_id: paymentIntent.id,
      cancelled_at: new Date().toISOString(),
    })
    .eq('order_id', orderId)
}
