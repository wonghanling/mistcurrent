import { NextApiRequest, NextApiResponse } from 'next'
import { airwallexService } from '../../../lib/airwallex'
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
    if (!authData.user.email) {
      return res.status(400).json({ error: 'User email not found' })
    }

    const { planId, customerName, paymentMethod } = req.body || {}
    if (!planId) {
      return res.status(400).json({ error: 'Missing planId' })
    }

    const plan = getPlan(planId)
    if (!plan) {
      return res.status(400).json({ error: 'Invalid planId' })
    }

    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const { error: insertError } = await supabase
      .from('orders')
      .insert({
        order_id: orderId,
        user_id: authData.user.id,
        customer_email: authData.user.email,
        plan_id: planId,
        amount: plan.totalPrice,
        currency: 'USD',
        status: 'pending',
        payment_method: paymentMethod || 'airwallex',
      })

    if (insertError) {
      return res.status(500).json({ error: insertError.message })
    }

    const hasAirwallexConfig = Boolean(
      process.env.AIRWALLEX_CLIENT_ID &&
      process.env.AIRWALLEX_SECRET_KEY &&
      process.env.AIRWALLEX_ACCOUNT_ID &&
      process.env.AIRWALLEX_API_URL
    )

    const useMockPayment = process.env.AIRWALLEX_MOCK_MODE === 'true' || !hasAirwallexConfig

    if (useMockPayment) {
      const mockPaymentIntent = {
        id: `pi_mock_${Date.now()}`,
        client_secret: `pi_mock_${Date.now()}_secret`,
        amount: Math.round(plan.totalPrice * 100),
        currency: 'USD',
        order_id: orderId,
      }

      await supabase
        .from('orders')
        .update({ payment_intent_id: mockPaymentIntent.id })
        .eq('order_id', orderId)

      return res.status(200).json({
        success: true,
        paymentIntent: mockPaymentIntent,
        plan,
        mock: true,
      })
    }

    const paymentIntent = await airwallexService.createPaymentIntent({
      planId,
      amount: plan.totalPrice,
      customerEmail: authData.user.email || '',
      customerName: customerName || authData.user.email || 'Customer',
      orderId,
      metadata: {
        order_id: orderId,
        user_id: authData.user.id,
      },
    })

    await supabase
      .from('orders')
      .update({ payment_intent_id: paymentIntent.id })
      .eq('order_id', orderId)

    return res.status(200).json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        order_id: paymentIntent.order_id,
      },
      plan,
    })
  } catch (error: any) {
    console.error('Payment create failed:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Payment initialization failed',
      code: error.code || 'PAYMENT_ERROR',
    })
  }
}
