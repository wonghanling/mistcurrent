import { GetServerSideProps } from 'next'
import { getSupabaseAdmin } from '../lib/supabaseAdmin'

const Subscribe = () => null

export const getServerSideProps: GetServerSideProps = async ({ res, query }) => {
  const token = typeof query.token === 'string' ? query.token : ''

  if (!token) {
    res.statusCode = 400
    res.end('Missing token')
    return { props: {} }
  }

  const supabase = getSupabaseAdmin()
  const { data: rows, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('token', token)
    .limit(1)

  if (error || !rows || rows.length === 0) {
    res.statusCode = 404
    res.end('Invalid token')
    return { props: {} }
  }

  const subscription = rows[0]
  const now = new Date()

  if (!subscription.expires_at) {
    res.statusCode = 403
    res.end('Subscription not active')
    return { props: {} }
  }

  if (new Date(subscription.expires_at) <= now) {
    res.statusCode = 410
    res.end('Subscription expired')
    return { props: {} }
  }

  if (subscription.status !== 'active' || !subscription.supplier_url) {
    res.statusCode = 403
    res.end('Subscription not active')
    return { props: {} }
  }

  try {
    const upstream = await fetch(subscription.supplier_url, { redirect: 'follow' })
    if (!upstream.ok) {
      res.statusCode = 502
      res.end('Upstream unavailable')
      return { props: {} }
    }

    const buffer = Buffer.from(await upstream.arrayBuffer())
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/octet-stream')
    res.setHeader('Cache-Control', 'no-store')
    res.statusCode = upstream.status
    res.end(buffer)
    return { props: {} }
  } catch (err) {
    res.statusCode = 502
    res.end('Upstream unavailable')
    return { props: {} }
  }
}

export default Subscribe
