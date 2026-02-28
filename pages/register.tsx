 import React, { useState } from 'react';
  import Head from 'next/head';
  import Link from 'next/link';
  import { useRouter } from 'next/router';
  import { sendEmailOtp, verifyEmailOtp, updatePassword } from '../lib/supabase';

  const Register: React.FC = () => {
    const router = useRouter();
    const nextUrl = typeof router.query.next === 'string' ? router.query.next : '/checkout';

    const [form, setForm] = useState({ email: '', password: '', confirm: '', code: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSendCode = async () => {
      setLoading(true);
      setMessage('');
      try {
        const { error } = await sendEmailOtp(form.email, true);
        if (error) throw error;
        setMessage('验证码已发送，请检查邮箱');
      } catch (err: any) {
        setMessage(err.message || '发送验证码失败');
      } finally {
        setLoading(false);
      }
    };

    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setMessage('');

      if (form.password !== form.confirm) {
        setMessage('两次密码不一致');
        setLoading(false);
        return;
      }

      try {
        const { error } = await verifyEmailOtp(form.email, form.code);
        if (error) throw error;

        const { error: pwdError } = await updatePassword(form.password);
        if (pwdError) throw pwdError;

        setMessage('注册成功，正在跳转...');
        setTimeout(() => router.push(nextUrl), 1200);
      } catch (err: any) {
        setMessage(err.message || '注册失败');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Head>
          <title>注册 - MistCurrent</title>
        </Head>

        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">注册</h1>
          <p className="text-gray-600 mb-6">创建账号后继续购买 VPN 订阅</p>

          {message && (
            <div className="border border-gray-200 rounded-lg px-4 py-3 mb-4 text-sm text-gray-700">
              {message}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
            >
              {loading ? '处理中...' : '注册'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            已有账号？
            <Link href={`/login?next=${encodeURIComponent(nextUrl)}`} className="text-black hover:underline ml-1">
              立即登录
            </Link>
          </p>
        </div>
      </div>
    );
  };
