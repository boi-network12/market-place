// components/ProtectedRoute.tsx
"use client";

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingBar from './ui/LoadingBar';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: Array<'user' | 'seller' | 'admin' | 'super_admin'>;
  requireSeller?: boolean;
  requireVerifiedEmail?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRoles = [],
  requireSeller = false,
  requireVerifiedEmail = false,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // Not authenticated
    if (!isAuthenticated || !user) {
      // Store the attempted URL for redirect after login
      sessionStorage.setItem('redirectAfterLogin', pathname);
      router.push(`${redirectTo}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Check email verification if required
    if (requireVerifiedEmail && !user.emailVerified) {
      router.push('/verify-email');
      return;
    }

    // Check seller status if required
    if (requireSeller && !user.isSeller) {
      router.push('/become-seller');
      return;
    }

    // Check role-based access
    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      router.push('/unauthorized');
      return;
    }

    // Check seller approval status
    if (user.isSeller && !user.sellerApproved && user.role === 'seller') {
      router.push('/seller-pending');
      return;
    }

  }, [user, isLoading, isAuthenticated, router, pathname, requiredRoles, requireSeller, requireVerifiedEmail, redirectTo]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingBar />;
  }

  // Don't render children if not authenticated or conditions not met
  if (!isAuthenticated || !user) {
    return null;
  }

  // Check email verification
  if (requireVerifiedEmail && !user.emailVerified) {
    return null;
  }

  // Check seller status
  if (requireSeller && !user.isSeller) {
    return null;
  }

  // Check role-based access
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return null;
  }

  // Check seller approval
  if (user.isSeller && !user.sellerApproved && user.role === 'seller') {
    return null;
  }

  return <>{children}</>;
}

// Optional: HOC version
export function withProtection<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}