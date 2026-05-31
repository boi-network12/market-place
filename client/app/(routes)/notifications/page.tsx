// app/notifications/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  Bell,
  Check,
  Trash2,
  CheckCheck,
  Settings,
  Eye,
  Mail,
  BellRing,
  Smartphone,
  Moon,
  X,
  AlertCircle,
  ShoppingBag,
  Shield,
  MessageSquare,
  CreditCard,
  Package,
  Users,
} from "lucide-react";
import Link from "next/link";
import { AppNotification } from "@/services/notification-api.service";

// Notification type icons mapping
const typeIcons: Record<string, React.ElementType> = {
  system: BellRing,
  security: Shield,
  order: ShoppingBag,
  payment: CreditCard,
  product: Package,
  seller: Users,
  message: MessageSquare,
};

// Priority colors mapping
const priorityColors: Record<string, string> = {
  low: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  medium: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  high: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  urgent: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

export default function NotificationsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    preferences,
    currentPage,
    totalNotifications,
  } = useNotifications();

  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/notifications");
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch notifications on mount and when filters change
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications(1);
    }
  }, [isAuthenticated, fetchNotifications]);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === "unread" && notification.isRead) return false;
    if (selectedFilter === "read" && !notification.isRead) return false;
    if (selectedType !== "all" && notification.type !== selectedType) return false;
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const handleNotificationClick = async (notification: AppNotification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
                >
                  <CheckCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Mark all as read</span>
                </button>
              )}
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg transition-colors ${
                  showSettings
                    ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                aria-label="Notification settings"
              >
                <Settings className="h-5 w-5" />
              </button>
              
              {notifications.length > 0 && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label="Delete all notifications"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 pb-4">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                selectedFilter === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedFilter("unread")}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                selectedFilter === "unread"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setSelectedFilter("read")}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                selectedFilter === "read"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Read
            </button>
            
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2 self-center" />
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 text-sm font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Filter by notification type"
            >
              <option value="all">All Types</option>
              <option value="system">System</option>
              <option value="security">Security</option>
              <option value="order">Orders</option>
              <option value="payment">Payments</option>
              <option value="product">Products</option>
              <option value="seller">Seller</option>
              <option value="message">Messages</option>
            </select>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <NotificationSettingsPanel onClose={() => setShowSettings(false)} />
      )}

      {/* Notifications List */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && notifications.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <EmptyState filter={selectedFilter} type={selectedType} />
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => {
              const IconComponent = typeIcons[notification.type] || Bell;
              const PriorityBadge = priorityColors[notification.priority] || priorityColors.medium;
              
              return (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`group relative bg-white dark:bg-gray-900 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                    notification.isRead
                      ? "border-gray-200 dark:border-gray-800"
                      : "border-l-4 border-l-indigo-500 border-gray-200 dark:border-gray-800"
                  }`}
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`flex-shrink-0 p-2 rounded-lg ${
                        notification.type === "security" 
                          ? "bg-red-100 dark:bg-red-900/30"
                          : notification.type === "order"
                          ? "bg-green-100 dark:bg-green-900/30"
                          : notification.type === "payment"
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}>
                        <IconComponent className={`h-5 w-5 ${
                          notification.type === "security"
                            ? "text-red-600 dark:text-red-400"
                            : notification.type === "order"
                            ? "text-green-600 dark:text-green-400"
                            : notification.type === "payment"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-400"
                        }`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className={`font-semibold ${
                              notification.isRead
                                ? "text-gray-700 dark:text-gray-300"
                                : "text-gray-900 dark:text-white"
                            }`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${PriorityBadge}`}>
                              {notification.priority}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                              {formatDate(notification.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-3 mt-3">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification._id);
                              }}
                              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                            >
                              <Check className="h-3 w-3" />
                              Mark as read
                            </button>
                          )}
                          
                          {notification.actionUrl && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              Click to view
                            </span>
                          )}
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification._id);
                            }}
                            className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load more */}
        {notifications.length > 0 && notifications.length < totalNotifications && (
          <div className="text-center mt-8">
            <button
              onClick={() => fetchNotifications(currentPage + 1)}
              className="px-6 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
            >
              Load more
            </button>
          </div>
        )}
      </div>

      {/* Delete All Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete all notifications?
              </h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This action cannot be undone. All your notifications will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteAllNotifications();
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Empty State Component
function EmptyState({ filter, type }: { filter: string; type: string }) {
  let message = "No notifications yet";
  let description = "When you receive notifications, they'll appear here.";
  
  if (filter === "unread") {
    message = "No unread notifications";
    description = "You've read all your notifications. Great job staying on top of things!";
  } else if (filter === "read") {
    message = "No read notifications";
    description = "You haven't read any notifications yet.";
  }
  
  if (type !== "all") {
    message = `No ${type} notifications`;
    description = `You don't have any ${type}-related notifications at the moment.`;
  }
  
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <Bell className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {message}
      </h3>
      <p className="text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

// Notification Settings Panel Component
function NotificationSettingsPanel({ onClose }: { onClose: () => void }) {
  const { preferences, updateEmailPreferences, updatePushPreferences, updateInAppPreferences, updateQuietHours, resetPreferences } = useNotifications();
  const [isSaving, setIsSaving] = useState(false);

  // Define proper type for updates
  type PreferenceUpdate = {
    email?: {
      enabled?: boolean;
      types?: Record<string, boolean>;
      digest?: {
        enabled?: boolean;
        frequency?: 'instant' | 'daily' | 'weekly';
      };
    };
    push?: {
      enabled?: boolean;
      types?: Record<string, boolean>;
    };
    inApp?: {
      enabled?: boolean;
      types?: Record<string, boolean>;
    };
    quietHours?: {
      enabled?: boolean;
      start?: string;
      end?: string;
      timezone?: string;
    };
  };

  const handleSave = async (updates: PreferenceUpdate ) => {
    setIsSaving(true);
    try {
      if (updates.email) await updateEmailPreferences(updates.email);
      if (updates.push) await updatePushPreferences(updates.push);
      if (updates.inApp) await updateInAppPreferences(updates.inApp);
      if (updates.quietHours) await updateQuietHours(updates.quietHours);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm("Reset all notification preferences to default?")) {
      setIsSaving(true);
      try {
        await resetPreferences();
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (!preferences) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notification Settings
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Email Notifications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-500" />
                <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications.enabled}
                  onChange={(e) => handleSave({ email: { enabled: e.target.checked } })}
                  className="sr-only peer"
                  aria-label="Toggle Email Notifications"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <div className="space-y-2 ml-7">
              {Object.entries(preferences.emailNotifications.types).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between py-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{key}</span>
                  <input
                    type="checkbox"
                    checked={value as boolean}
                    onChange={(e) => handleSave({ 
                      email: { types: { [key]: e.target.checked } } 
                    })}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Push Notifications */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-gray-500" />
                <h3 className="font-medium text-gray-900 dark:text-white">Push Notifications</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.pushNotifications.enabled}
                  onChange={(e) => handleSave({ push: { enabled: e.target.checked } })}
                  className="sr-only peer"
                    aria-label="Toggle Push Notifications"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <div className="space-y-2 ml-7">
              {Object.entries(preferences.pushNotifications.types).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between py-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{key}</span>
                  <input
                    type="checkbox"
                    checked={value as boolean}
                    onChange={(e) => handleSave({ 
                      push: { types: { [key]: e.target.checked } } 
                    })}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* In-App Notifications */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BellRing className="h-5 w-5 text-gray-500" />
                <h3 className="font-medium text-gray-900 dark:text-white">In-App Notifications</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.inAppNotifications.enabled}
                  onChange={(e) => handleSave({ inApp: { enabled: e.target.checked } })}
                  className="sr-only peer"
                    aria-label="Toggle In-App Notifications"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <div className="space-y-2 ml-7">
              {Object.entries(preferences.inAppNotifications.types).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between py-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{key}</span>
                  <input
                    type="checkbox"
                    checked={value as boolean}
                    onChange={(e) => handleSave({ 
                      inApp: { types: { [key]: e.target.checked } } 
                    })}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-gray-500" />
                <h3 className="font-medium text-gray-900 dark:text-white">Quiet Hours</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.quietHours.enabled}
                  onChange={(e) => handleSave({ quietHours: { enabled: e.target.checked } })}
                  className="sr-only peer"
                    aria-label="Toggle Quiet Hours"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            {preferences.quietHours.enabled && (
              <div className="ml-7 flex gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={preferences.quietHours.start}
                    onChange={(e) => handleSave({ quietHours: { start: e.target.value } })}
                    className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                    aria-label="Start Time"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">End Time</label>
                  <input
                    type="time"
                    value={preferences.quietHours.end}
                    onChange={(e) => handleSave({ quietHours: { end: e.target.value } })}
                    className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                    aria-label="End Time"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Reset Button */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
            <button
              onClick={handleReset}
              disabled={isSaving}
              className="w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors"
            >
              Reset to Default Settings
            </button>
          </div>
        </div>

        {isSaving && (
          <div className="absolute bottom-4 right-4 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
            Saving...
          </div>
        )}
      </div>
    </div>
  );
}