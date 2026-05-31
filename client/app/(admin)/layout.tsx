// app/(admin)/layout.tsx
'use client';

import { useAuth } from "@/contexts/AuthContext";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  Lock, 
  Home, 
  LogIn,
  ArrowLeft,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import AdminSidebar from "./_components/AdminSidebar";
import { AdminProvider } from "@/contexts/AdminContext";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    // Redirect non-admin users after a delay
    useEffect(() => {
        if (!isLoading && user && !user.role?.includes('admin')) {
            const timer = setTimeout(() => {
                router.push('/');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [user, isLoading, router]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6"></div>
                        <Shield className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-500 animate-pulse" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">Verifying access...</p>
                </div>
            </div>
        );
    }

    // Check if user is admin
    const isAdmin = user && user.role?.includes('admin');
    
    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-6">
                <div className="max-w-md w-full">
                    {/* Animated card */}
                    <div className="relative">
                        {/* Background glow effects */}
                        <div className="absolute -top-20 -left-20 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                        
                        {/* Main card */}
                        <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-red-500/30 shadow-2xl overflow-hidden">
                            {/* Top gradient bar */}
                            <div className="h-2 bg-gradient-to-r from-red-500 via-red-600 to-red-500 animate-gradient" />
                            
                            <div className="p-8 text-center">
                                {/* Animated icon */}
                                <div className="relative inline-block mb-6">
                                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-ping" />
                                    <div className="relative bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-full shadow-lg">
                                        <ShieldAlert className="w-12 h-12 text-white" />
                                    </div>
                                </div>
                                
                                {/* Title */}
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                                    Access Denied
                                </h1>
                                
                                {/* Subtitle */}
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full mb-4">
                                    <Lock className="w-3 h-3 text-red-400" />
                                    <span className="text-xs font-medium text-red-300">Administrators Only</span>
                                </div>
                                
                                {/* Message */}
                                <p className="text-slate-600 dark:text-slate-400 mb-6">
                                    This area is restricted to authorized administrators only.
                                    You don&apos;t have permission to access this page.
                                </p>
                                
                                {/* User info (if logged in but not admin) */}
                                {user && (
                                    <div className="mb-6 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Logged in as: <span className="text-slate-900 dark:text-white font-medium">{user.email}</span>
                                        </p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                            Role: <span className="text-amber-600 dark:text-amber-400 font-medium">{user.role || 'User'}</span>
                                        </p>
                                    </div>
                                )}
                                
                                {/* Action buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={() => router.push('/')}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                                    >
                                        <Home className="w-4 h-4" />
                                        Return to Home
                                    </button>
                                    
                                    {!user ? (
                                        <Link
                                            href="/login"
                                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-all duration-200"
                                        >
                                            <LogIn className="w-4 h-4" />
                                            Sign In
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => router.back()}
                                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-all duration-200"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Go Back
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {/* Bottom decorative pattern */}
                            <div className="border-t border-red-500/20 px-6 py-3 bg-black/20 dark:bg-black/10">
                                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                    <Shield className="w-3 h-3" />
                                    <span>Secure Admin Area • Restricted Access</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Auto-redirect timer */}
                        {user && (
                            <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
                                Redirecting to home in <span className="text-indigo-600 dark:text-indigo-400 font-mono">5</span> seconds...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Admin users see the layout with sidebar - the sidebar handles the spacing
    return (
        <AdminProvider>
            <div className="flex min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900" suppressHydrationWarning>
                <AdminSidebar />
                {/* Main content area - this will be pushed by the sidebar's width */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Admin header banner */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 text-center text-sm">
                        <div className="flex items-center justify-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span>Admin Dashboard • You have full administrative access</span>
                        </div>
                    </div>
                    <main className="flex-1 p-6 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </AdminProvider>
    );
}