// app/verify-email-pending/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPendingPage() {
  const { user, resendVerificationEmail, isLoading } = useAuth();
  const router = useRouter();

  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [resendMessage, setResendMessage] = useState('');
  const [countdown, setCountdown] = useState(0);

  // ✅ Fixed: Use lazy initializer instead of setState in useEffect
  const [email, setEmail] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('pendingVerificationEmail');
    }
    return null;
  });

  const userEmail = user?.email || email;

  // Redirect if already verified
  useEffect(() => {
    if (user?.emailVerified) {
      router.push('/');
    }
  }, [user?.emailVerified, router]);

  const handleResendEmail = async () => {
    if (countdown > 0) return;

    setResendStatus('sending');
    try {
      await resendVerificationEmail();
      setResendStatus('sent');
      setResendMessage('Verification email sent! Please check your inbox.');
      setCountdown(60);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: unknown) {
      const err = error as { message?: string };
      setResendStatus('error');
      setResendMessage(err.message || 'Failed to resend verification email');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            We&apos;ve sent a verification link to
          </p>
          <p className="font-medium text-indigo-600 dark:text-indigo-400 mt-1">
            {userEmail || 'your email address'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                📧 Please check your email inbox and click the verification link to activate your account.
                Don&apos;t forget to check your spam folder!
              </p>
            </div>

            {resendMessage && (
              <div className={`p-3 rounded-lg text-sm ${
                resendStatus === 'sent'
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
              }`}>
                {resendMessage}
              </div>
            )}

            <button
              onClick={handleResendEmail}
              disabled={isLoading || resendStatus === 'sending' || countdown > 0}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-indigo-600 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendStatus === 'sending' ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : countdown > 0 ? (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Resend in {countdown}s
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Resend Verification Email
                </>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Already verified?
                </span>
              </div>
            </div>

            <Link
              href="/login"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}