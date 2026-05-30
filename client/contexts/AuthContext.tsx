// contexts/AuthContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/services/api';

// ==================== TYPES ====================

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'user' | 'seller' | 'admin' | 'super_admin';
  isSeller: boolean;
  sellerApproved: boolean;
  emailVerified: boolean;
  avatar?: string;
  createdAt: string;
}

interface Device {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  browser: string;
  os: string;
  lastLogin: Date;
  isActive: boolean;
}

interface Session {
  deviceInfo: {
    name: string;
    type: string;
    browser: string;
    os: string;
  };
  ipAddress: string;
  location: {
    country: string;
    city: string;
  };
  lastActivity: Date;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

interface LoginResponse {
  user: User;
  device?: Device;
  location?: { city: string };
}

interface MeResponse {
  user: User;
  devices?: Device[];
  activeSessions?: Session[];
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: User | null;
  devices: Device[];
  sessions: Session[];
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  login: (email: string, password: string, rememberMe?: boolean, redirectTo?: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  becomeSeller: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
}

// ==================== CONTEXT ====================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const isLoadingRef = useRef(false);  
  const mountedRef = useRef(false);
  const isInitialMount = useRef(true);

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/'];
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];


  // const loadUser = useCallback(async () => {
  //   if (isLoadingRef.current) return;
  //   if (!mountedRef.current) return;

  //   try {
  //     isLoadingRef.current = true;
  //     setIsLoading(true);

  //     const response = await api.getMe() as ApiResponse<MeResponse>;

  //     if (response.success && response.data?.user) {
  //       setUser(response.data.user);
  //       setDevices(response.data.devices || []);
  //       setSessions(response.data.activeSessions || []);
  //       setIsAuthenticated(true);
        
  //       // ✅ Only redirect from auth pages if email is verified
  //       // Allow unverified users to stay on verification pending page
  //       if (authRoutes.includes(pathname) && response.data.user.emailVerified) {
  //         router.replace('/');
  //       }
        
  //       // ✅ If user is on verification pending page but email is now verified, redirect to home
  //       if (pathname === '/verify-email-pending' && response.data.user.emailVerified) {
  //         router.replace('/');
  //       }
  //     } else {
  //       setUser(null);
  //       setIsAuthenticated(false);
  //       setDevices([]);
  //       setSessions([]);
        
  //       // Redirect to login if trying to access protected route (excluding verification pending)
  //       if (!publicRoutes.includes(pathname) && pathname !== '/') {
  //         router.replace('/login');
  //       }
  //     }
  //   } catch (error: unknown) {
  //     console.error('Failed to load user:', error);
  //     setUser(null);
  //     setIsAuthenticated(false);
      
  //     if (!publicRoutes.includes(pathname) && pathname !== '/') {
  //       router.replace('/login');
  //     }
  //   } finally {
  //     isLoadingRef.current = false;
  //     setIsLoading(false);
  //   }
  // }, [pathname, router]);

  const loadUser = useCallback(async () => {
    if (isLoadingRef.current) return;
    if (!mountedRef.current) return;

    try {
      isLoadingRef.current = true;
      setIsLoading(true);

      const response = await api.getMe() as ApiResponse<MeResponse>;

      if (response.success && response.data?.user) {
        setUser(response.data.user);
        setDevices(response.data.devices || []);
        setSessions(response.data.activeSessions || []);
        setIsAuthenticated(true);
        
        // ✅ Check if user is on verify-email-pending page but email is verified
        if (pathname === '/verify-email-pending' && response.data.user.emailVerified) {
          router.replace('/');
          return;
        }
        
        // ✅ Redirect authenticated users away from auth pages
        // BUT allow them to stay on verify-email-pending if email not verified
        if (authRoutes.includes(pathname)) {
          router.replace('/');
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setDevices([]);
        setSessions([]);
        
        // ✅ Don't redirect from verify-email-pending if we have a pending email
        const hasPendingEmail = sessionStorage.getItem('pendingVerificationEmail');
        if (!publicRoutes.includes(pathname) && pathname !== '/' && pathname !== '/verify-email-pending') {
          router.replace('/login');
        }
      }
    } catch (error: unknown) {
      console.error('Failed to load user:', error);
      setUser(null);
      setIsAuthenticated(false);
      
      // ✅ Don't redirect from verify-email-pending
      if (!publicRoutes.includes(pathname) && pathname !== '/' && pathname !== '/verify-email-pending') {
        router.replace('/login');
      }
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [pathname, router]);


  // Load user data on initial mount only
  useEffect(() => {
    mountedRef.current = true;
    
    if (isInitialMount.current) {
      isInitialMount.current = false;
      loadUser();
    }

    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  // In AuthContext.tsx - login function
  const login = async (email: string, password: string, rememberMe = false, redirectTo?: string) => {
    try {
      setIsLoading(true);
      const response = await api.login({ email, password, rememberMe }) as ApiResponse<LoginResponse>;

      console.log('🔐 Login Response:', response); // ADD THIS

      if (response.success && response.data) {
        
        setUser(response.data.user);
        setIsAuthenticated(true);

        // DON'T redirect immediately - wait for cookie to be set
        setTimeout(() => {
          const destination = redirectTo || sessionStorage.getItem('redirectAfterLogin') || '/';
          sessionStorage.removeItem('redirectAfterLogin');
          
          if (!response.data?.user.emailVerified) {
            router.replace('/verify-email-pending');
          } else {
            console.log('🚀 Redirecting to:', destination);
            router.replace(destination);
          }
        }, 100);
      }
    } catch (error: unknown) {
      console.error('❌ Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await api.register(data) as ApiResponse<{ user: User; verificationToken?: string }>;

      if (response.success) {
        // Store email for verification resend
        sessionStorage.setItem('pendingVerificationEmail', data.email);

        // ✅ Clear any existing auth state
        setUser(null);
        setIsAuthenticated(false);
        
        // Redirect to verification pending page
        router.replace('/verify-email-pending');
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      console.error('Registration error:', error);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      setIsLoading(true);
      const response = await api.verifyEmail(token) as ApiResponse;

      if (response.success) {
        // ✅ Clear pending email from session storage
        sessionStorage.removeItem('pendingVerificationEmail');
        
        // ✅ Update user state if they were somehow logged in
        if (user) {
          setUser({ ...user, emailVerified: true });
        }
        
        // ✅ Don't auto-login, just redirect to login page with success message
        router.replace('/login?verified=true');
      } else {
        throw new Error(response.message || 'Verification failed');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Invalid or expired verification link';
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    try {
      setIsLoading(true);
      const email = sessionStorage.getItem('pendingVerificationEmail') || user?.email;
      
      if (!email) {
        throw new Error('No email found for verification');
      }
      
      const response = await api.resendVerificationEmail(email) as ApiResponse;
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to resend verification email');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to resend verification email';
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setDevices([]);
      setSessions([]);
      setIsAuthenticated(false);
      router.replace('/');
    }
  };

  const becomeSeller = async () => {
    try {
      const response = await api.becomeSeller() as ApiResponse;

      if (response.success) {
        await refreshUser();
      } else {
        throw new Error(response.message || 'Failed to become seller');
      }
    } catch (error: unknown) {
      const message = error instanceof Error 
        ? error.message 
        : 'Please subscribe to a seller plan first';
      throw new Error(message);
    }
  };

  const refreshUser = async () => {
    await loadUser();
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const isEmailVerified = user?.emailVerified || false;

  const value: AuthContextType = {
    user,
    devices,
    sessions,
    isLoading,
    isAuthenticated,
    isEmailVerified,
    login,
    register,
    logout,
    becomeSeller,
    refreshUser,
    updateUser,
    verifyEmail,
    resendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}