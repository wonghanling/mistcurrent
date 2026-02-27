export const PLAN_MONTHS: Record<string, number> = {
  '1month': 1,
  '6month': 6,
  '12month': 12,
  '2year': 26,
}

export const calculateExpiryDate = (planId: string, startDate = new Date()): Date => {
  const months = PLAN_MONTHS[planId] ?? PLAN_MONTHS['2year']
  const Y0 = startDate.getFullYear()
  const M0 = startDate.getMonth() + 1
  const day = startDate.getDate()

  const Yr = Y0 + Math.floor((M0 + months - 1) / 12)
  const Mr = ((M0 + months - 1) % 12) + 1

  let expiry = new Date(Yr, Mr - 1, day)
  if (expiry.getMonth() !== (Mr - 1)) {
    expiry = new Date(Yr, Mr, 0)
  }

  return expiry
}
