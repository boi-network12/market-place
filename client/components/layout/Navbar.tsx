"use client";

import { useTheme } from "@/contexts/ThemeContext";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, User, Bell, Mail, HelpCircle, LogOut, Settings, ChevronDown, UserCircle, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AnimatedLogo from "../ui/AnimatedLogo";
import { useNotifications } from "@/contexts/NotificationContext";

export default function Navbar() {
  const { theme, toggleTheme, mounted } = useTheme();
  const { unreadCount } = useNotifications();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3); // This would come from your cart context/store
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleCartClick = () => {
    router.push("/cart");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 min-w-0">
            <AnimatedLogo />
            <span className="truncate text-base sm:text-xl font-bold text-gray-900 dark:text-white">
              Market
              <span className="text-indigo-600 dark:text-indigo-400">.Kamdi</span>
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Cart Icon - Only show when user is logged in and email verified */}
            {user && user.emailVerified && (
              <button
                onClick={handleCartClick}
                className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {user && user.emailVerified ? (
              <>
                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                  >
                    {/* Avatar */}
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.fullName}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium">
                        {getInitials(user.fullName)}
                      </div>
                    )}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <Image
                              src={user.avatar}
                              alt={user.fullName}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium">
                              {getInitials(user.fullName)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {user.fullName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {user.email}
                            </p>
                            {user.isSeller && (
                              <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                                Seller
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {/* Profile Link */}
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <UserCircle className="h-5 w-5 text-gray-400" />
                          <span>My Profile</span>
                        </Link>

                        {/* Settings Link */}
                        {user && user?.role === "admin" && (
                          <Link
                            href="/admin-dashboard"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <LayoutDashboard className="h-5 w-5 text-gray-400" />
                            <span>Admin Dashboard</span>
                          </Link>
                          )}

                        {/* Notifications */}
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            router.push("/notifications");
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Bell className="h-5 w-5 text-gray-400" />
                          <span>Notifications</span>
                          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        </button>


                        {/* FAQ */}
                        <Link
                          href="/faq"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <HelpCircle className="h-5 w-5 text-gray-400" />
                          <span>Help & FAQ</span>
                        </Link>

                        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                        {/* Logout Button */}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                >
                  Log in
                </Link>

                <Link
                  href="/register"
                  className="rounded-lg bg-indigo-600 px-3 sm:px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors whitespace-nowrap"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}