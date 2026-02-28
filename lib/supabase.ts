
  import { createClient } from '@supabase/supabase-js'

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  export const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // 密码注册
  export const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  // 密码登录
  export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  // 退出
  export const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  // 当前用户
  export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  }

  // 发送邮箱验证码（可用于登录/注册）
  export const sendEmailOtp = async (email: string, shouldCreateUser = false) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser }
    })
    return { data, error }
  }

  // 校验邮箱验证码
  export const verifyEmailOtp = async (email: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    })
    return { data, error }
  }

  // 设置密码（验证码注册后可设置）
  export const updatePassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({ password })
    return { data, error }
  }

