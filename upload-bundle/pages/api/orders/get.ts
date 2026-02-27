import { NextApiRequest, NextApiResponse } from 'next'
import { getSupabaseAdmin } from '../../../lib/supabaseAdmin'

const getAccessToken = (req: NextApiRequest): string | null => {
  const authHeader = req.headers.authorization || ''
  if (!authHeader.startsWith('Bearer ')) return null
  return authHeader.slice(7)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET is supported' })
  }

  try {
    const token = getAccessToken(req)
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const orderId = typeof req.query.order_id === 'string' ? req.query.order_id : ''
    if (!orderId) {
      return res.status(400).json({ error: 'Missing order_id' })
    }

    const supabase = getSupabaseAdmin()
    const { data: authData, error: authError } = await supabase.auth.getUser(token)
    if (authError || !authData?.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .eq('user_id', authData.user.id)
      .limit(1)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' })
    }

    return res.status(200).json({ order: orders[0] })
  } catch (error: any) {
    console.error('Get order failed:', error)
    return res.status(500).json({ error: error.message || 'Failed to load order' })
  }
}
