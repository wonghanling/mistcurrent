import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import { getPlan } from '../../lib/plans'

interface OrderRecord {
  order_id: string
  plan_id: string
  amount: number
  status: string
}

interface SubscriptionRecord {
  id: string
  token: string
  status: string
  expires_at: string
}

const PaymentSuccess: React.FC = () => {
  const router = useRouter()
  const [order, setOrder] = useState<OrderRecord | null>(null)
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const session = sessionData.session
      const orderId = typeof router.query.order_id === 'string' ? router.query.order_id : ''
      const isMock = router.query.mock === '1'

      if (!session || !orderId) {
        setLoading(false)
        return
      }

      try {
        const orderRes = await fetch(`/api/orders/get?order_id=${encodeURIComponent(orderId)}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        if (orderRes.ok) {
          const payload = await orderRes.json()
          setOrder(payload.order)
        }

        if (isMock) {
          const confirmRes = await fetch('/api/orders/confirm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ orderId }),
          })
          if (confirmRes.ok) {
            const payload = await confirmRes.json()
            setSubscription(payload.subscription)
            setMessage('订阅已创建，等待分配供应商链接')
          }
        }
      } catch (err) {
        setMessage('加载订单信息失败')
      } finally {
        setLoading(false)
      }
    }

    if (router.isReady) {
      load()
    }
  }, [router.isReady, router.query.order_id, router.query.mock])

  const plan = order ? getPlan(order.plan_id) : null

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>支付成功 - MistCurrent</title>
      </Head>

      <header className="border-b border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-black">MistCurrent</h1>
            <Link href="/" className="text-gray-500 hover:text-black">
              返回首页
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-white text-2xl">✓</div>
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">支付成功</h2>
          <p className="text-gray-600">您的 VPN 服务正在激活中</p>
        </div>

        {message && (
          <div className="border border-gray-300 bg-white text-gray-800 px-6 py-4 rounded-lg shadow-lg mb-8 text-center">
            {message}
          </div>
        )}

        {order && (
          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-black mb-4">订单详情</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">订单号</span>
                <span className="text-black">{order.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">套餐</span>
                <span className="text-black">{plan?.name || order.plan_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">金额</span>
                <span className="text-black">${order.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">状态</span>
                <span className="text-black">{order.status}</span>
              </div>
            </div>
          </div>
        )}

        {subscription && (
          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-black mb-4">订阅状态</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">状态</span>
                <span className="text-black">{subscription.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">到期时间</span>
                <span className="text-black">{subscription.expires_at ? new Date(subscription.expires_at).toLocaleDateString() : '-'}</span>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <Link
            href="/account"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 mr-4"
          >
            管理订阅
          </Link>
          <Link
            href="/"
            className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
