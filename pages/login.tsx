
  import React, { useState } from 'react';
  import Head from 'next/head';
  import Link from 'next/link';
  import { useRouter } from 'next/router';
  import { signIn, sendEmailOtp, verifyEmailOtp } from '../lib/supabase';

  const Login: React.FC = () => {
    const router = useRouter();
    const nextUrl = typeof router.query.next === 'string' ? router.query.next : '/checkout';

    const [mode, setMode] = useState<'password' | 'code'>('password');
    const [form, setForm] = useState({ email: '', password: '', code: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handlePasswordLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setMessage('');
      try {
        const { error } = await signIn(form.email, form.password);
        if (error) throw error;
        router.push(nextUrl);
      } catch (err: any) {
        setMessage(err.message || '登录失败');
      } finally {
        setLoading(false);
      }
    };

    const handleSendCode = async () => {
      setLoading(true);
      setMessage('');
      try {
        const { error } = await sendEmailOtp(form.email, false);
        if (error) throw error;
        setMessage('验证码已发送，请检查邮箱');
      } catch (err: any) {
        setMessage(err.message || '发送验证码失败');
      } finally {
        setLoading(false);
      }
    };

    const handleCodeLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setMessage('');
      try {
        const { error } = await verifyEmailOtp(form.email, form.code);
        if (error) throw error;
        router.push(nextUrl);
      } catch (err: any) {
        setMessage(err.message || '验证码登录失败');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Head>
          <title>登录 - MistCurrent</title>
        </Head>

        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">登录</h1>
          <p className="text-gray-600 mb-6">登录后继续购买 VPN 订阅</p>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setMode('password')}
              className={`flex-1 py-2 rounded-lg ${mode === 'password' ? 'bg-black text-white' : 'bg-gray-100 text-gray-  700'}`}
            >
              密码登录
            </button>
            <button
              onClick={() => setMode('code')}
              className={`flex-1 py-2 rounded-lg ${mode === 'code' ? 'bg-black text-white' : 'bg-gray-100 text-gray-
  700'}`}
            >
              验证码登录
            </button>
          </div>

          {message && (
            <div className="border border-gray-200 rounded-lg px-4 py-3 mb-4 text-sm text-gray-700">
              {message}
            </div>
          )}

          {mode === 'password' ? (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <input
                type="email"
                placeholder="邮箱地址"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                required
              />
              <input
                type="password"
                placeholder="密码"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
              >
                {loading ? '处理中...' : '登录'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCodeLogin} className="space-y-4">
              <input
                type="email"
                placeholder="邮箱地址"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                required
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="验证码"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
                  required
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={loading}
                  className="px-4 py-3 bg-gray-900 text-white rounded-lg"
                >
                  发送
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
              >
                {loading ? '处理中...' : '验证码登录'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-600 mt-4">
            没有账号？
            <Link href={`/register?next=${encodeURIComponent(nextUrl)}`} className="text-black hover:underline ml-1">
              立即注册
            </Link>
          </p>
        </div>
      </div>
    );
  };

  export default Login;
