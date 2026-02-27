import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const LoadingTest: React.FC = () => {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('初始化支付')

  useEffect(() => {
    const orderId = typeof router.query.order_id === 'string' ? router.query.order_id : ''
    const isMock = router.query.mock === '1'

    const stages = [
      '初始化支付',
      '连接支付网关',
      '验证支付信息',
      '处理交易',
      '确认支付结果',
      '激活服务',
      '完成',
    ]

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 15
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            const finalOrderId = orderId || 'TEST_ORDER_123'
            const mockParam = isMock ? '&mock=1' : ''
            router.push(`/payment/success?order_id=${finalOrderId}${mockParam}`)
          }, 1000)
          return 100
        }

        const stageIndex = Math.floor((next / 100) * stages.length)
        if (stageIndex < stages.length) {
          setStage(stages[stageIndex])
        }

        return next
      })
    }, 800)

    return () => clearInterval(interval)
  }, [router.query.order_id, router.query.mock])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Head>
        <title>支付处理中 - MistCurrent</title>
      </Head>

      <div className="w-full max-w-sm mx-4">
        <div className="text-center mb-16">
          <h1 className="text-2xl font-bold text-black mb-3">MistCurrent</h1>
          <div className="w-12 h-0.5 bg-black mx-auto mb-6"></div>
          <p className="text-gray-500 text-sm">正在处理您的支付</p>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-lg font-medium text-black mb-2">处理中...</h2>
          <p className="text-gray-500 text-sm">{stage}</p>
        </div>

        <div className="mb-12">
          <div className="flex justify-between text-xs text-gray-400 mb-3">
            <span>进度</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-0.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="border border-gray-200 rounded p-4 mb-8">
          <div className="flex items-start">
            <div className="w-3 h-3 bg-black rounded-full flex-shrink-0 mt-1"></div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">您的支付信息已加密保护</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-400 mb-4">请勿关闭此页面</p>
          <button
            onClick={() => router.push('/checkout')}
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoadingTest
