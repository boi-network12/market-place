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
  ChartBar,
  UserPlus,
  XCircle,
  Loader2,
  CheckCircle,
  AlertCircle,
  UserCheck,
  Star,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import Image from 'next/image';

// ============ Type Definitions ============
interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface TeamMember {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'moderator' | 'support';
  avatar?: string;
}

interface SearchUserResult {
  _id: string;
  email: string;
  fullName: string;
  avatar?: string;
}

// ============ Navigation Data ============
const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Sellers', href: '/admin/sellers', icon: FolderKanban },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: FileText },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Email Sub', href: '/admin/email-subscribers', icon: Mail, badge: 12 },
  { name: 'Budgets', href: '/admin/budgets', icon: ChartBar, badge: 3 },
  { name: 'Seller Request', href: '/admin/seller-requests', icon: Users, badge: 5 }
];

const secondaryNavigation: NavItem[] = [
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

// ============ Helper Components ============

// TeamSection component moved outside to avoid recreation during render
interface TeamSectionProps {
  isCollapsed: boolean;
  teamMembers: TeamMember[];
  onViewMembers: () => void;
  onAddMember: () => void;
}

const TeamSection = ({ isCollapsed, teamMembers, onViewMembers, onAddMember }: TeamSectionProps) => (
  <div className="mt-8 px-3">
    {!isCollapsed && (
      <div className="flex items-center justify-between mb-2 px-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Team Members
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={onViewMembers}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="View Team Members"
          >
            <Users className="h-3 w-3 text-slate-400" />
          </button>
          <button
            onClick={onAddMember}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Add Team Member"
          >
            <Plus className="h-3 w-3 text-slate-400" />
          </button>
        </div>
      </div>
    )}
    <div className="space-y-1">
      {teamMembers.slice(0, isCollapsed ? 3 : 5).map((member) => (
        <div
          key={member._id}
          className={`
            group flex items-center gap-3 px-3 py-2 rounded-lg
            transition-all duration-200
            text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {member.name?.charAt(0).toUpperCase() || member.email?.charAt(0).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{member.name}</p>
              <p className="text-xs text-slate-400 truncate capitalize">{member.role}</p>
            </div>
          )}
        </div>
      ))}
      {teamMembers.length === 0 && !isCollapsed && (
        <div className="px-3 py-2 text-xs text-slate-400 text-center">
          No team members yet
        </div>
      )}
    </div>
  </div>
);

// Add Team Member Modal Component
interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (userId: string, email: string, name: string, role: 'admin' | 'moderator' | 'support') => Promise<void>;
  searchUsers: (searchTerm: string) => Promise<SearchUserResult[]>;
  isLoading: boolean;
}

const AddTeamMemberModal = ({ 
  isOpen, 
  onClose, 
  onAddMember,
  searchUsers,
  isLoading 
}: AddTeamMemberModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUserResult[]>([]);
  const [selectedUser, setSelectedUser] = useState<SearchUserResult | null>(null);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'moderator' | 'support'>('moderator');
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Debounced search
  useEffect(() => {
    const search = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }
      
      setIsSearching(true);
      try {
        const results = await searchUsers(searchTerm);
        setSearchResults(results);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsSearching(false);
      }
    };
    
    const timer = setTimeout(search, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, searchUsers]);

  const handleAddMember = async () => {
    if (!selectedUser) {
      setError('Please select a user');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await onAddMember(selectedUser._id, selectedUser.email, selectedUser.fullName, selectedRole);
      setSuccess(`${selectedUser.fullName} added as ${selectedRole}`);
      setTimeout(() => {
        onClose();
        setSelectedUser(null);
        setSearchTerm('');
        setSuccess('');
      }, 1500);
    } catch (err: unknown) {
      const error = err as { message: string }
      setError(error.message || 'Failed to add team member');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">Add Team Member</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Close Modal"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
              <p className="text-indigo-100 text-sm mt-1">Add a new member to your admin team</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Search User */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Search User
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 animate-spin" />
                  )}
                </div>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg max-h-48 overflow-y-auto">
                  {searchResults.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => setSelectedUser(user)}
                      className={`w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                        selectedUser?._id === user._id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                      }`}
                    >
                      {user.avatar ? (
                        <Image src={user.avatar} alt={user.fullName} width={32} height={32} className="rounded-full" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{user.fullName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                      </div>
                      {selectedUser?._id === user._id && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Selected User */}
              {selectedUser && (
                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {selectedUser.avatar ? (
                      <Image src={selectedUser.avatar} alt={selectedUser.fullName} width={40} height={40} className="rounded-full" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {selectedUser.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">{selectedUser.fullName}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{selectedUser.email}</p>
                    </div>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      aria-label="Deselect User"
                    >
                      <XCircle className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Team Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: 'admin' as const, label: 'Admin', description: 'Full access', icon: Shield, color: 'purple' },
                    { value: 'moderator' as const, label: 'Moderator', description: 'Manage users & content', icon: UserCheck, color: 'blue' },
                    { value: 'support' as const, label: 'Support', description: 'Limited access', icon: Star, color: 'green' }
                  ]).map((role) => (
                    <button
                      key={role.value}
                      onClick={() => setSelectedRole(role.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedRole === role.value
                          ? `border-${role.color}-500 bg-${role.color}-50 dark:bg-${role.color}-900/20`
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <role.icon className={`h-5 w-5 mx-auto mb-1 ${
                        selectedRole === role.value 
                          ? `text-${role.color}-500` 
                          : 'text-slate-400'
                      }`} />
                      <p className={`text-xs font-medium ${
                        selectedRole === role.value
                          ? `text-${role.color}-600 dark:text-${role.color}-400`
                          : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {role.label}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{role.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  {success}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMember}
                  disabled={!selectedUser || isSubmitting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                  Add Member
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Team Member List Modal
interface TeamMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamMembers: TeamMember[];
  onRemoveMember: (memberId: string) => Promise<void>;
  isLoading: boolean;
}

const TeamMembersModal = ({ 
  isOpen, 
  onClose, 
  teamMembers, 
  onRemoveMember,
  isLoading 
}: TeamMembersModalProps) => {
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = async (memberId: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      setRemovingId(memberId);
      await onRemoveMember(memberId);
      setRemovingId(null);
    }
  };

  if (!isOpen) return null;

  const roleColors = {
    admin: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    moderator: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    support: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">Team Members</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Close Modal"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
              <p className="text-indigo-100 text-sm mt-1">Manage your admin team</p>
            </div>

            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
                </div>
              ) : teamMembers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">No team members yet</p>
                  <p className="text-sm text-slate-400 mt-1">Click the + button to add members</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {teamMembers.map((member) => (
                    <div key={member._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {member.name?.charAt(0).toUpperCase() || member.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{member.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{member.email}</p>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${roleColors[member.role]}`}>
                            {member.role}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemove(member._id)}
                        disabled={removingId === member._id}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                      >
                        {removingId === member._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// NavLink component
interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
  onNavigate: () => void;
}

const NavLink = ({ item, isActive, isCollapsed, onNavigate }: NavLinkProps) => (
  <Link href={item.href} onClick={onNavigate}>
    <motion.div
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className={`
        group flex items-center gap-3 px-3 py-2.5 rounded-lg
        transition-all duration-200 cursor-pointer
        ${isActive 
          ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
        }
        ${isCollapsed ? 'justify-center' : ''}
      `}
    >
      <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
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

// ============ Main Component ============
export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showTeamMembersModal, setShowTeamMembersModal] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { 
    teamMembers, 
    fetchTeamMembers, 
    addTeamMember, 
    removeTeamMember,
    searchUsersForTeam,
    isLoading 
  } = useAdmin();

  // Load team members
  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

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
              <NavLink 
                key={item.name} 
                item={item} 
                isActive={isActive(item.href)}
                isCollapsed={isCollapsed}
                onNavigate={() => setIsMobileOpen(false)}
              />
            ))}
          </div>

          {/* Team Section - Using the extracted component */}
          <TeamSection 
            isCollapsed={isCollapsed}
            teamMembers={teamMembers as TeamMember[]}
            onViewMembers={() => setShowTeamMembersModal(true)}
            onAddMember={() => setShowAddMemberModal(true)}
          />

          {/* Secondary Navigation */}
          <div className="mt-8 px-3">
            {!isCollapsed && (
              <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                System
              </p>
            )}
            <div className="space-y-1">
              {secondaryNavigation.map((item) => (
                <NavLink 
                  key={item.name} 
                  item={item} 
                  isActive={isActive(item.href)}
                  isCollapsed={isCollapsed}
                  onNavigate={() => setIsMobileOpen(false)}
                />
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

      {/* Modals */}
      <AddTeamMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onAddMember={addTeamMember}
        searchUsers={searchUsersForTeam}
        isLoading={isLoading}
      />

      <TeamMembersModal
        isOpen={showTeamMembersModal}
        onClose={() => setShowTeamMembersModal(false)}
        teamMembers={teamMembers as TeamMember[]}
        onRemoveMember={removeTeamMember}
        isLoading={isLoading}
      />

      {/* Spacer div to push content */}
      <div 
        className="hidden lg:block transition-all duration-300 flex-shrink-0"
        style={{ width: isCollapsed ? '80px' : '280px' }}
      />
    </>
  );
}