import { SupabaseClient } from '@supabase/supabase-js'
import { calculateExpiryDate } from './subscriptionUtils'
import { generateMistToken } from './tokens'

export interface OrderRecord {
  order_id: string
  user_id: string
  customer_email: string
  plan_id: string
}

export const ensureSubscriptionForOrder = async (
  supabase: SupabaseClient,
  order: OrderRecord
) => {
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('order_id', order.order_id)
    .limit(1)

  if (existing && existing.length > 0) {
    return { data: existing[0], created: false }
  }

  const expiresAt = calculateExpiryDate(order.plan_id)
  const token = generateMistToken()

  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      order_id: order.order_id,
      user_id: order.user_id,
      user_email: order.customer_email,
      plan_id: order.plan_id,
      token,
      status: 'pending',
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return { data, created: true }
}
