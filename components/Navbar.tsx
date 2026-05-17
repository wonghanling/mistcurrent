import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { supabase, signOut } from '../lib/supabase';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setUserEmail(data.session?.user?.email || null);
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    setUserEmail(null);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md border-b border-gray-200' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src="/logo-transparent.png"
                alt="MistCurrent Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-gray-900 font-bold text-xl">MistCurrent</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-900 hover:text-gray-600 font-medium">
              产品特点
            </Link>
            <Link href="#pricing" className="text-gray-900 hover:text-gray-600 font-medium">
              定价方案
            </Link>
            <Link
              href="/login?next=/checkout"
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-lg hover:scale-105"
            >
              开始使用
            </Link>

            {!userEmail ? (
              <>
                <Link href="/login?next=/checkout" className="text-gray-900 hover:text-gray-600 font-medium">
                  登录
                </Link>
                <Link href="/register?next=/checkout" className="text-gray-900 hover:text-gray-600 font-medium">
                  注册
                </Link>
              </>
            ) : (
              <>
                <Link href="/account" className="text-gray-900 hover:text-gray-600 font-medium">
                  账户
                </Link>
                <button onClick={handleLogout} className="text-gray-900 hover:text-gray-600 font-medium">
                  退出
                </button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-900 hover:text-gray-600"
            >
              {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link href="#features" className="block text-gray-900 hover:text-gray-600 px-3 py-2 font-medium">
              产品特点
            </Link>
            <Link href="#pricing" className="block text-gray-900 hover:text-gray-600 px-3 py-2 font-medium">
              定价方案
            </Link>
            <Link
              href="/login?next=/checkout"
              className="block bg-gray-900 hover:bg-gray-800 text-white px-3 py-2 rounded-lg font-medium mt-2 text-center"
            >
              开始使用
            </Link>

            {!userEmail ? (
              <>
                <Link href="/login?next=/checkout" className="block text-gray-900 hover:text-gray-600 px-3 py-2 font-medium">
                  登录
                </Link>
                <Link href="/register?next=/checkout" className="block text-gray-900 hover:text-gray-600 px-3 py-2 font-medium">
                  注册
                </Link>
              </>
            ) : (
              <>
                <Link href="/account" className="block text-gray-900 hover:text-gray-600 px-3 py-2 font-medium">
                  账户
                </Link>
                <button
                  onClick={handleLogout}
                  className="block text-left w-full text-gray-900 hover:text-gray-600 px-3 py-2 font-medium"
                >
                  退出
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
