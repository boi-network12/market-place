// app/(admin)/admin/users/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Shield, 
  Ban, 
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User as UserIcon,
  Trash2,
  Edit2,
  Eye,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Clock,
  Smartphone,
  Globe,
  ShieldCheck,
  UserCheck,
  UserX,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  LucideIcon
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminUser } from '@/services/admin-api.service';

// Define the user type for this component


interface UserDetailsModalProps {
  user:  AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (status: "active" | "suspended" | "banned", reason?: string) => void;
  onUpdateRole: (role: "user" | "seller" | "admin") => void;
  onDelete: () => void;
}

const UserDetailsModal = ({ user, isOpen, onClose, onUpdateStatus, onUpdateRole, onDelete }: UserDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState<'info' | 'devices' | 'activity'>('info');
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [showConfirmBan, setShowConfirmBan] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!isOpen || !user) return null;

  const statusColors = {
    active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    suspended: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    banned: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  };

  const roleColors = {
    user: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    seller: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    admin: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    super_admin: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
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
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close Details"
              >
                <X className="h-5 w-5 text-white" />
              </button>
              <div className="flex items-center gap-4">
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.fullName} width={64} height={64} className="rounded-full border-4 border-white/20" />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                    {user.fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white">{user.fullName}</h2>
                  <p className="text-indigo-100">@{user.username}</p>
                  <p className="text-indigo-100 text-sm">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 px-6">
              {['info', 'devices', 'activity'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as 'info' | 'devices' | 'activity')}
                  className={`px-4 py-3 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem icon={Mail} label="Email" value={user.email} />
                    <InfoItem icon={Phone} label="Phone" value={user.phoneNumber || 'Not provided'} />
                    <InfoItem icon={Calendar} label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />
                    <InfoItem icon={Clock} label="Last Login" value={user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'} />
                    <InfoItem icon={Globe} label="Location" value={`${user.location?.city || 'Unknown'}, ${user.location?.country || 'Unknown'}`} />
                    <InfoItem icon={ShieldCheck} label="Email Verified" value={user.emailVerified ? 'Yes' : 'No'} />
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Account Status</h3>
                    <div className="flex flex-wrap gap-4">
                      <div className="relative">
                        <button
                          onClick={() => setShowStatusMenu(!showStatusMenu)}
                          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${statusColors[user.status as keyof typeof statusColors]}`}
                        >
                          <span className="capitalize">{user.status}</span>
                          <Edit2 className="h-3 w-3" />
                        </button>
                        {showStatusMenu && (
                          <div className="absolute top-full mt-2 left-0 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10 min-w-[150px]">
                            {(['active', 'suspended', 'banned'] as const).map((status) => (
                              <button
                                key={status}
                                onClick={() => {
                                  if (status === 'banned') {
                                    setShowConfirmBan(true);
                                  } else {
                                    onUpdateStatus(status);
                                  }
                                  setShowStatusMenu(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 capitalize"
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <button
                          onClick={() => setShowRoleMenu(!showRoleMenu)}
                          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${roleColors[user.role as keyof typeof roleColors]}`}
                        >
                          <span className="capitalize">{user.role}</span>
                          <Edit2 className="h-3 w-3" />
                        </button>
                        {showRoleMenu && (
                          <div className="absolute top-full mt-2 left-0 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50 min-w-[150px]">
                            {(['user', 'seller', 'admin'] as const).map((role) => (
                              <button
                                key={role}
                                onClick={() => {
                                  onUpdateRole(role);
                                  setShowRoleMenu(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 capitalize"
                              >
                                {role}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => setShowConfirmDelete(true)}
                        className="px-4 py-2 rounded-lg font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'devices' && (
                <div className="space-y-3">
                  {user?.devices && user.devices.length > 0 ? (
                    user?.devices.map((device, index: number) => (
                      <div key={device._id || index} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-5 w-5 text-slate-500" />
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 dark:text-white">{device.deviceName}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{device.deviceType} • {device.browser} • {device.os}</p>
                            <p className="text-xs text-slate-400">Last login: {new Date(device.lastLogin).toLocaleString()}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${device.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                            {device.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-500 py-8">No devices recorded</p>
                  )}
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-3">
                  {user?.loginHistory && user.loginHistory.length > 0 ? (
                     user.loginHistory.map((activity, index: number) => (
                      <div key={activity._id || index} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Globe className="h-4 w-4 text-slate-500" />
                            <div>
                              <p className="text-sm text-slate-900 dark:text-white">{activity.location}</p>
                              <p className="text-xs text-slate-500">{activity.device}</p>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400">{new Date(activity.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-500 py-8">No activity recorded</p>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Close
              </button>
            </div>

            {/* Confirm Ban Modal */}
            {showConfirmBan && (
              <ConfirmModal
                title="Ban User"
                message="Please provide a reason for banning this user:"
                onConfirm={() => {
                  onUpdateStatus('banned', banReason);
                  setShowConfirmBan(false);
                  setBanReason('');
                }}
                onCancel={() => {
                  setShowConfirmBan(false);
                  setBanReason('');
                }}
              >
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Enter ban reason..."
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 mt-2"
                  rows={3}
                />
              </ConfirmModal>
            )}

            {/* Confirm Delete Modal */}
            {showConfirmDelete && (
              <ConfirmModal
                title="Delete User"
                message={`Are you sure you want to delete ${user.fullName}'s account? This action cannot be undone.`}
                onConfirm={() => {
                  onDelete();
                  setShowConfirmDelete(false);
                }}
                onCancel={() => setShowConfirmDelete(false)}
                variant="danger"
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const InfoItem = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) => (
  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
    <Icon className="h-5 w-5 text-slate-500" />
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-900 dark:text-white">{value}</p>
    </div>
  </div>
);

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
  variant?: 'default' | 'danger';
}

const ConfirmModal = ({ title, message, onConfirm, onCancel, children, variant = 'default' }: ConfirmModalProps) => (
  <div className="fixed inset-0 flex items-center justify-center z-[60]">
    <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
    <div className="relative bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 mb-4">{message}</p>
      {children}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`px-4 py-2 rounded-lg transition-colors ${
            variant === 'danger'
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

const TrendIcon = ({ value }: { value: string }) => {
  if (value.includes('+')) return <TrendingUp className="h-3 w-3 text-green-500" />;
  if (value.includes('-')) return <TrendingDown className="h-3 w-3 text-red-500" />;
  return <Minus className="h-3 w-3 text-yellow-500" />;
};

export default function AdminUsersPage() {
  const { 
    users, 
    totalUsers, 
    isLoading, 
    currentPage,
    fetchUsers, 
    updateUserStatus, 
    updateUserRole, 
    deleteUser 
  } = useAdmin();
  const { user: currentUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch users when filters change
  useEffect(() => {
    fetchUsers({
      search: debouncedSearch || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      role: roleFilter !== 'all' ? roleFilter : undefined,
      page,
    });
  }, [fetchUsers, debouncedSearch, statusFilter, roleFilter, page]);

  const handleUpdateStatus = async (userId: string, status: "active" | "suspended" | "banned", reason?: string) => {
    await updateUserStatus(userId, status, reason);
    if (selectedUser?._id === userId) {
      setSelectedUser({ ...selectedUser, status });
    }
    setShowActionMenu(null);
  };

  const handleUpdateRole = async (userId: string, role: "user" | "seller" | "admin") => {
    await updateUserRole(userId, role);
    if (selectedUser?._id === userId) {
      setSelectedUser({ ...selectedUser, role });
    }
    setShowActionMenu(null);
  };

  const handleDeleteUser = async (userId: string) => {
    await deleteUser(userId);
    setSelectedUser(null);
    setShowActionMenu(null);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      suspended: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      banned: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    };
    return badges[status as keyof typeof badges] || badges.active;
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      user: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
      seller: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      admin: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
      super_admin: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    };
    return badges[role as keyof typeof badges] || badges.user;
  };

  const totalPages = Math.ceil(totalUsers / 20);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Users Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage all registered users on the platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchUsers({ page: 1 })}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            aria-label="Refresh"
          >
            <RefreshCw className={`h-4 w-4 text-slate-600 dark:text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Total: {totalUsers} users
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Filter by Status"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </select>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Filter by Role"
        >
          <option value="all">All Roles</option>
          <option value="user">Users</option>
          <option value="seller">Sellers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {isLoading && users.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Active</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <Image src={user.avatar} alt={user.fullName} width={40} height={40} className="rounded-full object-cover" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                              {user.fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{user.fullName}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                          {user.role}
                        </span>
                        {user.isSeller && user.role !== 'seller' && (
                          <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                            Seller
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                          {user.status}
                        </span>
                        {!user.emailVerified && (
                          <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === user._id ? null : user._id)}
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          aria-label="User Actions"
                        >
                          <MoreVertical className="h-4 w-4 text-slate-500" />
                        </button>
                        {showActionMenu === user?._id && (
                          <div className="fixed right-6 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-[100]">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowActionMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" /> View Details
                            </button>
                            <div className="border-t border-slate-200 dark:border-slate-700 my-1" />
                            <button
                              onClick={() => handleUpdateStatus(user._id, user.status === 'active' ? 'suspended' : 'active')}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                            >
                              <Shield className="h-4 w-4" /> 
                              {user.status === 'active' ? 'Suspend User' : 'Activate User'}
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(user._id, 'banned')}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                            >
                              <Ban className="h-4 w-4" /> Ban User
                            </button>
                            {currentUser?._id !== user._id && (
                              <>
                                <div className="border-t border-slate-200 dark:border-slate-700 my-1" />
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete ${user.fullName}?`)) {
                                      handleDeleteUser(user._id);
                                    }
                                    setShowActionMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                                >
                                  <Trash2 className="h-4 w-4" /> Delete User
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdateStatus={(status, reason) => handleUpdateStatus(selectedUser._id, status, reason)}
          onUpdateRole={(role) => handleUpdateRole(selectedUser._id, role)}
          onDelete={() => handleDeleteUser(selectedUser._id)}
        />
      )}
    </div>
  );
}