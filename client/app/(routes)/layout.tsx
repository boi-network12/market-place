// app/(routes)/layout.tsx
"use client";

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import PageLoader from '@/components/ui/PageLoader';

interface RoutesLayoutProps {
  children: ReactNode;
}

export default function RoutesLayout({ children }: RoutesLayoutProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      // Store the attempted URL for redirect after login
      sessionStorage.setItem('redirectAfterLogin', pathname);
      router.replace('/login');
      return;
    }

    // Check if email is verified (optional - remove if you allow unverified users in routes)
    if (!user.emailVerified) {
      router.replace('/verify-email-pending');
      return;
    }

  }, [user, isLoading, isAuthenticated, router, pathname]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <PageLoader />;
  }

  // Don't render children if not authenticated or conditions not met
  if (!isAuthenticated || !user) {
    return null;
  }

  // Optional: Check email verification before rendering
  if (!user.emailVerified) {
    return null;
  }

  return <>{children}</>;
}