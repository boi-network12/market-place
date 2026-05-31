// app/(admin)/_components/AdminSidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  LogOut,
  Menu,
  X,
  Home,
  Plus,
  Search,
  Mail,
  Package,
  ChartBar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Sellers', href: '/admin/sellers', icon: FolderKanban },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'categories', href: '/admin/categories', icon: FileText },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Email sub', href: '/admin/email-subscribers', icon: Mail, badge: 12 },
  { name: 'Budgets', href: '/admin/budgets', icon: ChartBar, badge: 3 },
  { name: 'Seller Request', href: '/admin/seller-requests', icon: Users, badge: 5 }
];

const secondaryNavigation: NavItem[] = [
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface Team {
  id: string;
  name: string;
  logo: string;
  href: string;
}

const teams: Team[] = [
  { id: '1', name: 'Henry', logo: 'H', href: '/admin/teams/heroicons' },
  { id: '2', name: 'Tailwind Labs', logo: 'T', href: '/admin/teams/tailwind-labs' },
  { id: '3', name: 'Workcation', logo: 'W', href: '/admin/teams/workcation' },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  // Save collapsed state to localStorage
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState.toString());
  };

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  const isActive = (href: string) => pathname === href;

  const NavLink = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href);
    return (
      <Link href={item.href} onClick={() => setIsMobileOpen(false)}>
        <motion.div
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          className={`
            group flex items-center gap-3 px-3 py-2.5 rounded-lg
            transition-all duration-200 cursor-pointer
            ${active 
              ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
            }
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <item.icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
          {!isCollapsed && (
            <span className="font-medium text-sm flex-1">{item.name}</span>
          )}
          {!isCollapsed && item.badge && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
              {item.badge}
            </span>
          )}
        </motion.div>
      </Link>
    );
  };

  const TeamLink = ({ team }: { team: Team }) => (
    <Link href={team.href} onClick={() => setIsMobileOpen(false)}>
      <motion.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={`
          group flex items-center gap-3 px-3 py-2 rounded-lg
          transition-all duration-200 cursor-pointer
          text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white
          ${isCollapsed ? 'justify-center' : ''}
        `}
      >
        <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {team.logo}
        </div>
        {!isCollapsed && (
          <span className="font-medium text-sm">{team.name}</span>
        )}
      </motion.div>
    </Link>
  );

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-72';

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700"
        aria-label="Toggle Menu"
      >
        <Menu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
      </button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobile}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? '80px' : '280px',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`
          fixed left-0 top-0 h-full bg-white dark:bg-slate-900/95 backdrop-blur-sm
          border-r border-slate-200 dark:border-slate-800
          flex flex-col z-40
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 lg:transition-none
        `}
        style={{ width: isCollapsed ? '80px' : '280px' }}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Portal
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Secure Dashboard</p>
              </div>
            </motion.div>
          )}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-auto"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-slate-500" />
            )}
          </button>
          {isMobileOpen && (
            <button
              onClick={toggleMobile}
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close Menu"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>
          )}
        </div>

        {/* Search Bar */}
        {!isCollapsed && (
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Main
              </p>
            )}
            {navigation.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>

          {/* Your Teams Section */}
          <div className="mt-8 px-3">
            {!isCollapsed && (
              <div className="flex items-center justify-between mb-2 px-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Your Teams
                </p>
                <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Add Team">
                  <Plus className="h-3 w-3 text-slate-400" />
                </button>
              </div>
            )}
            <div className="space-y-1">
              {teams.map((team) => (
                <TeamLink key={team.id} team={team} />
              ))}
            </div>
          </div>

          {/* Secondary Navigation */}
          <div className="mt-8 px-3">
            {!isCollapsed && (
              <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                System
              </p>
            )}
            <div className="space-y-1">
              {secondaryNavigation.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {user?.email?.split('@')[0] || 'Admin User'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user?.email || 'admin@example.com'}
                </p>
              </div>
              <button
                onClick={() => logout()}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-900" />
              </div>
              <button
                onClick={() => logout()}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Spacer div to push content - using margin-left based on sidebar state */}
      <div 
        className="hidden lg:block transition-all duration-300 flex-shrink-0"
        style={{ width: isCollapsed ? '80px' : '280px' }}
      />
    </>
  );
}