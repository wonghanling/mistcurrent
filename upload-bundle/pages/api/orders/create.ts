import { NextApiRequest, NextApiResponse } from 'next'
import { getSupabaseAdmin } from '../../../lib/supabaseAdmin'
import { getPlan } from '../../../lib/plans'

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

    const { planId } = req.body || {}
    if (!planId) {
      return res.status(400).json({ error: 'Missing planId' })
    }

    const plan = getPlan(planId)
    if (!plan) {
      return res.status(400).json({ error: 'Invalid planId' })
    }

    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_id: orderId,
        user_id: authData.user.id,
        customer_email: authData.user.email,
        plan_id: planId,
        amount: plan.totalPrice,
        currency: 'USD',
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ success: true, order: data })
  } catch (error: any) {
    console.error('Order create failed:', error)
    return res.status(500).json({ error: error.message || 'Failed to create order' })
  }
}
