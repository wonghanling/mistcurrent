import { NextApiRequest, NextApiResponse } from 'next'
import { getSupabaseAdmin } from '../../../lib/supabaseAdmin'
import { ensureSubscriptionForOrder } from '../../../lib/serverSubscriptions'

const getAccessToken = (req: NextApiRequest): string | null => {
  const authHeader = req.headers.authorization || ''
  if (!authHeader.startsWith('Bearer ')) return null
  return authHeader.slice(7)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST is supported' })
  }

  try {
    const token = getAccessToken(req)
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const supabase = getSupabaseAdmin()
    const { data: authData, error: authError } = await supabase.auth.getUser(token)
    if (authError || !authData?.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { orderId } = req.body || {}
    if (!orderId) {
      return res.status(400).json({ error: 'Missing orderId' })
    }

    const { data: orders, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .eq('user_id', authData.user.id)
      .limit(1)

    if (orderError) {
      return res.status(500).json({ error: orderError.message })
    }

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const order = orders[0]

    if (order.status !== 'paid') {
      await supabase
        .from('orders')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('order_id', orderId)
    }

    const { data: subscription } = await ensureSubscriptionForOrder(supabase, {
      order_id: order.order_id,
      user_id: order.user_id,
      customer_email: order.customer_email,
      plan_id: order.plan_id,
    })

    return res.status(200).json({
      success: true,
      subscription: subscription
        ? {
            id: subscription.id,
            order_id: subscription.order_id,
            plan_id: subscription.plan_id,
            status: subscription.status,
            token: subscription.token,
            expires_at: subscription.expires_at,
            created_at: subscription.created_at,
          }
        : null,
    })
  } catch (error: any) {
    console.error('Order confirm failed:', error)
    return res.status(500).json({ error: error.message || 'Failed to confirm order' })
  }
}
