import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { supabase, signIn, signUp, signOut } from '../lib/supabase'
import { getPlan } from '../lib/plans'

interface Subscription {
  id: string
  order_id: string | null
  plan_id: string
  status: string
  token: string
  expires_at: string | null
  created_at: string
}

const Account: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [authForm, setAuthForm] = useState({ email: '', password: '', confirm: '' })
  const [authLoading, setAuthLoading] = useState(false)

  const loadSubscriptions = async (accessToken: string) => {
    try {
      const res = await fetch('/api/subscriptions/list', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) {
        throw new Error('Failed to load subscriptions')
      }
      const payload = await res.json()
      setSubscriptions(payload.subscriptions || [])
    } catch (err) {
      setMessage('加载订阅信息失败')
    }
  }

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      if (session) {
        setUserEmail(session.user.email || null)
        await loadSubscriptions(session.access_token)
      }
      setLoading(false)
    }

    init()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUserEmail(session.user.email || null)
        await loadSubscriptions(session.access_token)
      } else {
        setUserEmail(null)
        setSubscriptions([])
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setMessage('')

    try {
      if (authMode === 'register') {
        if (authForm.password !== authForm.confirm) {
          setMessage('两次密码不一致')
          setAuthLoading(false)
          return
        }
        const { error } = await signUp(authForm.email, authForm.password)
        if (error) throw error
        setMessage('注册成功，请检查邮箱验证后登录')
      } else {
        const { error } = await signIn(authForm.email, authForm.password)
        if (error) throw error
        setMessage('登录成功')
      }
    } catch (err: any) {
      setMessage(err.message || '操作失败')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    setUserEmail(null)
    setSubscriptions([])
    setMessage('已退出登录')
  }

  const copyVpnUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setMessage('VPN 链接已复制')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('复制失败')
    }
  }

  const downloadConfig = (type: string, subscription: Subscription) => {
    const plan = getPlan(subscription.plan_id)
    const config = type === 'openvpn'
      ? `# OpenVPN配置 - ${plan?.name || subscription.plan_id}\nclient\nremote vpn.mistcurrent.com 1194\nproto udp\nauth-user-pass`
      : `# WireGuard配置 - ${plan?.name || subscription.plan_id}\n[Interface]\nPrivateKey = YOUR_PRIVATE_KEY\nAddress = 10.0.0.2/24`

    const blob = new Blob([config], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `mistcurrent-${type}.${type === 'openvpn' ? 'ovpn' : 'conf'}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>账户管理 - MistCurrent</title>
      </Head>

      <header className="border-b border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-black">MistCurrent</h1>
            <div className="flex items-center gap-4">
              {userEmail && (
                <span className="text-gray-600 text-sm">{userEmail}</span>
              )}
              <Link href="/" className="text-gray-500 hover:text-black">
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {!userEmail ? (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-black mb-2">账户管理</h2>
              <p className="text-gray-600">请登录后查看您的订阅信息</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-8">
              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="邮箱地址"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="密码"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    required
                  />
                </div>
                {authMode === 'register' && (
                  <div>
                    <input
                      type="password"
                      placeholder="确认密码"
                      value={authForm.confirm}
                      onChange={(e) => setAuthForm({ ...authForm, confirm: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3"
                      required
                    />
                  </div>
                )}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
                >
                  {authLoading ? '处理中...' : authMode === 'register' ? '注册' : '登录'}
                </button>
                <p className="text-center text-sm text-gray-600">
                  {authMode === 'register' ? '已有账号？' : '还没有账号？'}
                  <button
                    type="button"
                    onClick={() => setAuthMode(authMode === 'register' ? 'login' : 'register')}
                    className="text-black hover:underline ml-1"
                  >
                    {authMode === 'register' ? '立即登录' : '立即注册'}
                  </button>
                </p>
              </form>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-black mb-1">我的账户</h2>
                <p className="text-gray-600">管理您的 VPN 订阅</p>
              </div>
              <button onClick={handleLogout} className="text-gray-500 hover:text-black">
                退出登录
              </button>
            </div>

            {subscriptions.length === 0 ? (
              <div className="border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-600 mb-4">暂无订阅信息</p>
                <Link
                  href="/"
                  className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
                >
                  购买套餐
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {subscriptions.map((subscription) => {
                  const plan = getPlan(subscription.plan_id)
                  const expiresAt = subscription.expires_at ? new Date(subscription.expires_at) : null
                  const remainingDays = expiresAt
                    ? Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    : 0
                  const isExpired = expiresAt ? expiresAt.getTime() <= Date.now() : false
                  const isActive = subscription.status === 'active' && !isExpired

                  return (
                    <div key={subscription.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-lg font-bold text-black">{plan?.name || subscription.plan_id}</h3>
                          {subscription.order_id && (
                            <p className="text-gray-500 text-sm">订单号: {subscription.order_id}</p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          isActive ? 'bg-gray-100 text-black' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {isActive ? '活跃' : isExpired ? '已过期' : subscription.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                        <div>
                          <span className="text-gray-500">价格</span>
                          <p className="text-black font-medium">${plan?.totalPrice ?? '-'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">到期日期</span>
                          <p className="text-black font-medium">
                            {expiresAt ? expiresAt.toLocaleDateString() : '-'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">剩余天数</span>
                          <p className="text-black font-medium">{Math.max(0, remainingDays)} 天</p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-black mb-2">VPN 订阅链接</label>
                        <div className="flex">
                          <input
                            type="text"
                            value={`https://vpn.mistcurrent.com/subscribe?token=${subscription.token}`}
                            readOnly
                            className="flex-1 p-3 border border-gray-300 rounded-l-lg text-sm bg-gray-50"
                          />
                          <button
                            onClick={() => copyVpnUrl(`https://vpn.mistcurrent.com/subscribe?token=${subscription.token}`)}
                            disabled={!isActive}
                            className={`px-4 py-3 rounded-r-lg ${
                              isActive ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            }`}
                          >
                            复制
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => downloadConfig('openvpn', subscription)}
                          disabled={!isActive}
                          className={`px-4 py-2 rounded-lg text-sm ${
                            isActive ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          OpenVPN
                        </button>
                        <button
                          onClick={() => downloadConfig('wireguard', subscription)}
                          disabled={!isActive}
                          className={`px-4 py-2 rounded-lg text-sm ${
                            isActive ? 'bg-gray-800 text-white hover:bg-gray-900' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          WireGuard
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {message && (
          <div className="fixed bottom-6 right-6 bg-gray-100 border border-gray-300 text-gray-800 px-4 py-3 rounded-lg shadow-lg">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

export default Account
