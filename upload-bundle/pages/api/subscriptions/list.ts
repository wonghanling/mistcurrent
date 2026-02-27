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

    const supabase = getSupabaseAdmin()
    const { data: authData, error: authError } = await supabase.auth.getUser(token)
    if (authError || !authData?.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('id, order_id, plan_id, status, token, expires_at, created_at, updated_at')
      .eq('user_id', authData.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ subscriptions: subscriptions || [] })
  } catch (error: any) {
    console.error('List subscriptions failed:', error)
    return res.status(500).json({ error: error.message || 'Failed to load subscriptions' })
  }
}
