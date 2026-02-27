export interface PlanInfo {
  name: string
  price: number
  totalPrice: number
  durationMonths: number
}

export const PLANS: Record<string, PlanInfo> = {
  '1month': {
    name: '1个月套餐',
    price: 11.99,
    totalPrice: 11.99,
    durationMonths: 1,
  },
  '6month': {
    name: '6个月套餐',
    price: 6.99,
    totalPrice: 41.94,
    durationMonths: 6,
  },
  '12month': {
    name: '12个月套餐',
    price: 5.99,
    totalPrice: 71.88,
    durationMonths: 12,
  },
  '2year': {
    name: '2年套餐+2个月免费',
    price: 2.19,
    totalPrice: 52.56,
    durationMonths: 26,
  },
}

export const getPlan = (planId: string): PlanInfo | null => {
  return PLANS[planId] || null
}
