import crypto from 'crypto'

export const generateMistToken = (): string => {
  const raw = crypto.randomBytes(32).toString('base64')
  return raw.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}
