import { createClient } from '@supabase/supabase-js'

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const rawSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

function isValidSupabaseUrl(value: string) {
  if (!value || value.includes('your_supabase_url')) {
    return false
  }

  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

const hasValidSupabaseConfig =
  isValidSupabaseUrl(rawSupabaseUrl) &&
  !!rawSupabaseAnonKey &&
  !rawSupabaseAnonKey.includes('your_supabase_anon_key')

const fallbackSupabaseUrl = 'https://placeholder.supabase.co'
const fallbackSupabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder.placeholder'

export const supabase = createClient(
  hasValidSupabaseConfig ? rawSupabaseUrl : fallbackSupabaseUrl,
  hasValidSupabaseConfig ? rawSupabaseAnonKey : fallbackSupabaseAnonKey
)

function createConfigError() {
  return new Error(
    'Supabase environment variables are missing or invalid. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  )
}

function ensureSupabaseConfig() {
  if (!hasValidSupabaseConfig) {
    throw createConfigError()
  }
}

export const signUp = async (email: string, password: string) => {
  ensureSupabaseConfig()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  ensureSupabaseConfig()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  ensureSupabaseConfig()
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  ensureSupabaseConfig()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  return { user, error }
}

export const sendEmailOtp = async (email: string, shouldCreateUser = false) => {
  ensureSupabaseConfig()
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser },
  })
  return { data, error }
}

export const verifyEmailOtp = async (email: string, token: string) => {
  ensureSupabaseConfig()
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })
  return { data, error }
}

export const updatePassword = async (password: string) => {
  ensureSupabaseConfig()
  const { data, error } = await supabase.auth.updateUser({ password })
  return { data, error }
}
