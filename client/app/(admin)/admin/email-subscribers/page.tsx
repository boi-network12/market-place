// app/(admin)/admin/email-subscribers/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Mail,
  Send,
  Users,
  Search,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  Trash2,
  Download,
  AlertCircle,
  Plus,
  X,
  UserCheck,
  Send as SendIcon,
  Save,
  FileText,
  Eye as EyeIcon,
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { emailCampaignService, EmailCampaign, CreateCampaignData } from '@/services/email-campaign.service';
import { AdminUser } from '@/services/admin-api.service';
import SubscriberDetailsModal from '../../_components/SubscriberDetailsModal';

// ==================== TYPES ====================

export interface Subscriber {
  _id: string;
  email: string;
  interests: string[];
  source: string;
  isVerified: boolean;
  verifiedAt?: string;
  unsubscribedAt?: string;
  metadata: {
    ip?: string;
    userAgent?: string;
    location?: string;
    subscribedAt: string;
  };
  createdAt: string;
}

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (subject: string, content: string, htmlContent: string) => Promise<void>;
  title: string;
  recipientType: 'subscribers' | 'users' | 'specific';
  specificUsers?: AdminUser[];
}

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateCampaignData) => Promise<void>;
  campaign?: EmailCampaign;
}

// ==================== SEND EMAIL MODAL ====================

const SendEmailModal = ({ isOpen, onClose, onSend, title, recipientType, specificUsers }: SendEmailModalProps) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'plain' | 'html'>('plain');
  const [preview, setPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setError('Subject is required');
      return;
    }
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await onSend(subject, content, mode === 'html' ? htmlContent : `<p>${content.replace(/\n/g, '<br>')}</p>`);
      onClose();
      setSubject('');
      setContent('');
      setHtmlContent('');
    } catch (err: unknown) {
      const error = err as { message: string };
      setError(error.message || 'Failed to send email');
    } finally {
      setIsLoading(false);
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
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SendIcon className="h-5 w-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">{title}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label="Close modal"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
              {specificUsers && specificUsers.length > 0 && (
                <p className="text-indigo-100 text-sm mt-1">
                  Sending to {specificUsers.length} specific user{specificUsers.length !== 1 ? 's' : ''}
                </p>
              )}
              {recipientType === 'subscribers' && (
                <p className="text-indigo-100 text-sm mt-1">Sending to all newsletter subscribers</p>
              )}
              {recipientType === 'users' && (
                <p className="text-indigo-100 text-sm mt-1">Sending to all registered users</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              {/* Mode Toggle */}
              <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setMode('plain')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    mode === 'plain'
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Plain Text
                </button>
                <button
                  type="button"
                  onClick={() => setMode('html')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    mode === 'html'
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  HTML
                </button>
                <button
                  type="button"
                  onClick={() => setPreview(!preview)}
                  className="ml-auto px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1"
                >
                  <EyeIcon className="h-4 w-4" />
                  Preview
                </button>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Content *
                </label>
                {mode === 'plain' ? (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your email content here..."
                    rows={10}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                  />
                ) : (
                  <textarea
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    placeholder="<p>Write your HTML content here...</p>"
                    rows={10}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                  />
                )}
              </div>

              {/* Preview */}
              {preview && (
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-900/50">
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Preview:</h3>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <strong>Subject: {subject}</strong>
                    <div className="mt-2">
                      {mode === 'plain' ? (
                        <p className="whitespace-pre-wrap">{content}</p>
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <SendIcon className="h-4 w-4" />
                  )}
                  Send Email
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ==================== CAMPAIGN MODAL ====================

const CampaignModal = ({ isOpen, onClose, onSave, campaign }: CampaignModalProps) => {
  const [subject, setSubject] = useState(campaign?.subject || '');
  const [content, setContent] = useState(campaign?.content || '');
  const [htmlContent, setHtmlContent] = useState(campaign?.htmlContent || '');
  const [recipientType, setRecipientType] = useState<CreateCampaignData['recipientType']>(
    campaign?.recipientType || 'subscribers'
  );
  const [type, setType] = useState<CreateCampaignData['type']>(campaign?.type || 'newsletter');
  const [scheduledFor, setScheduledFor] = useState(campaign?.scheduledFor?.split('T')[0] || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'plain' | 'html'>('plain');
  const [preview, setPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setError('Subject is required');
      return;
    }
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await onSave({
        subject,
        content,
        htmlContent: mode === 'html' ? htmlContent : `<p>${content.replace(/\n/g, '<br>')}</p>`,
        recipientType,
        type,
        scheduledFor: scheduledFor || undefined,
      });
      onClose();
    } catch (err: unknown) {
      const error = err as { message: string };
      setError(error.message || 'Failed to save campaign');
    } finally {
      setIsLoading(false);
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
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Save className="h-5 w-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">
                    {campaign ? 'Edit Campaign' : 'Create Campaign'}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              {/* Campaign Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Campaign Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['newsletter', 'announcement', 'promotion', 'custom'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                        type === t
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-700'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Recipients
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['subscribers', 'users', 'all'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRecipientType(r)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                        recipientType === r
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-700'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {r === 'all' ? 'All (Users + Subscribers)' : r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setMode('plain')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    mode === 'plain'
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Plain Text
                </button>
                <button
                  type="button"
                  onClick={() => setMode('html')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    mode === 'html'
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  HTML
                </button>
                <button
                  type="button"
                  onClick={() => setPreview(!preview)}
                  className="ml-auto px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1"
                >
                  <EyeIcon className="h-4 w-4" />
                  Preview
                </button>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Content *
                </label>
                {mode === 'plain' ? (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your email content here... You can use {{name}} and {{email}} as placeholders"
                    rows={8}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                  />
                ) : (
                  <textarea
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    placeholder='<div><h1>Hello {{name}}!</h1><p>Your email is {{email}}</p></div>'
                    rows={8}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                  />
                )}
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Schedule (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Schedule campaign for later"
                />
                <p className="text-xs text-slate-500 mt-1">Leave empty to send immediately</p>
              </div>

              {/* Preview */}
              {preview && (
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-900/50">
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Preview:</h3>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <strong>Subject: {subject}</strong>
                    <div className="mt-2">
                      {mode === 'plain' ? (
                        <p className="whitespace-pre-wrap">{content}</p>
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {campaign ? 'Update Campaign' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ==================== CAMPAIGN CARD ====================

const CampaignCard = ({ campaign, onView, onDelete, onSend }: { 
  campaign: EmailCampaign; 
  onView: () => void; 
  onDelete: () => void;
  onSend: () => void;
}) => {
  const statusColors = {
    draft: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
    scheduled: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    sending: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    sent: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    failed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  };

  const typeColors = {
    newsletter: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    announcement: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
    promotion: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400',
    custom: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[campaign.type]}`}>
              {campaign.type}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[campaign.status]}`}>
              {campaign.status}
            </span>
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
            {campaign.subject}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {campaign.content}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
        <div className="flex items-center gap-2">
          <Users className="h-3 w-3" />
          <span>{campaign.statistics.total} recipients</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3" />
          <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {campaign.status === 'sent' && (
        <div className="flex items-center gap-4 text-xs mb-3">
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="h-3 w-3" />
            <span>{campaign.statistics.sent} sent</span>
          </div>
          {campaign.statistics.failed > 0 && (
            <div className="flex items-center gap-1 text-red-600">
              <XCircle className="h-3 w-3" />
              <span>{campaign.statistics.failed} failed</span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={onView}
          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors text-sm flex items-center justify-center gap-1"
        >
          <Eye className="h-3 w-3" />
          View
        </button>
        {campaign.status === 'draft' && (
          <button
            onClick={onSend}
            className="flex-1 px-3 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 transition-colors text-sm flex items-center justify-center gap-1"
          >
            <Send className="h-3 w-3" />
            Send
          </button>
        )}
        <button
          onClick={onDelete}
          className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 transition-colors text-sm flex items-center justify-center gap-1"
          aria-label={`Delete campaign ${campaign.subject}`}
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

export default function EmailSubscribersPage() {
  const { 
    emailSubscribers, 
    fetchEmailSubscribers, 
    sendEmailToSubscribers,
    exportSubscribers,
    isLoading 
  } = useAdmin();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showSendModal, setShowSendModal] = useState<'subscribers' | 'users' | 'specific' | null>(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<AdminUser[]>([]);
  const [activeTab, setActiveTab] = useState<'subscribers' | 'campaigns'>('subscribers');
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);
  const [showSubscriberDetails, setShowSubscriberDetails] = useState(false);

  // Fetch subscribers
  useEffect(() => {
    fetchEmailSubscribers({ search: searchTerm || undefined });
  }, [fetchEmailSubscribers, searchTerm]);

  // Fetch campaigns
  const loadCampaigns = useCallback(async () => {
    setIsLoadingCampaigns(true);
    try {
      const result = await emailCampaignService.getCampaigns();
      setCampaigns(result.campaigns);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setIsLoadingCampaigns(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'campaigns') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
      loadCampaigns();
    }
  }, [activeTab, loadCampaigns]);

  const handleSendToSubscribers = async (subject: string, content: string, htmlContent: string) => {
    await sendEmailToSubscribers(subject, htmlContent);
  };

  const handleSendToUsers = async (subject: string, content: string, htmlContent: string) => {
   await emailCampaignService.sendToAllUsers(subject, content, htmlContent);
  };

  const handleSendToSpecificUsers = async (subject: string, content: string, htmlContent: string) => {
    const userIds = selectedUsers.map(u => u._id);
    await emailCampaignService.sendToSpecificUsers({
      subject,
      content,
      htmlContent,
      userIds,
    });
    setSelectedUsers([]);
  };

  const handleCreateCampaign = async (data: CreateCampaignData) => {
    await emailCampaignService.createCampaign(data);
    await loadCampaigns();
  };

  const handleSendCampaign = async (campaign: EmailCampaign) => {
    if (confirm(`Send "${campaign.subject}" to ${campaign.statistics.total} recipients?`)) {
      await emailCampaignService.sendCampaign(campaign._id);
      await loadCampaigns();
    }
  };

  const handleDeleteCampaign = async (campaign: EmailCampaign) => {
    if (confirm(`Delete campaign "${campaign.subject}"?`)) {
      await emailCampaignService.deleteCampaign(campaign._id);
      await loadCampaigns();
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    await exportSubscribers(format);
  };

  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Email Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage newsletter subscribers and send email campaigns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={() => handleExport('json')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'subscribers'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Subscribers ({emailSubscribers.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'campaigns'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Campaigns ({campaigns.length})
          </div>
        </button>
      </div>

      {/* Subscribers Tab */}
      {activeTab === 'subscribers' && (
        <>
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowSendModal('subscribers')}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send to All Subscribers
            </button>
            <button
              onClick={() => setShowSendModal('users')}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center gap-2"
            >
              <UserCheck className="h-4 w-4" />
              Send to All Users
            </button>
            <button
              onClick={() => setShowCampaignModal(true)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 transition-all flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Create Campaign
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search subscribers by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Subscribers List */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
              </div>
            ) : emailSubscribers.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No subscribers yet</p>
                <p className="text-sm text-slate-400 mt-1">Subscribers will appear here once they sign up</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {emailSubscribers.map((subscriber) => (
                  <div key={subscriber._id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900 dark:text-white">{subscriber.email}</p>
                          {subscriber.unsubscribedAt ? (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                              Unsubscribed
                            </span>
                          ) : subscriber.isVerified ? (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                              Verified
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                              Pending
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {subscriber.interests.slice(0, 3).map(interest => (
                            <span key={interest} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full text-xs text-slate-600 dark:text-slate-400">
                              {interest}
                            </span>
                          ))}
                          {subscriber.interests.length > 3 && (
                            <span className="px-2 py-0.5 text-xs text-slate-500">+{subscriber.interests.length - 3}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(subscriber.createdAt).toLocaleDateString()}
                          </span>
                          <span>{subscriber.source}</span>
                          {subscriber.metadata?.location && (
                            <span>{subscriber.metadata.location}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedSubscriber(subscriber as unknown as Subscriber);
                          setShowSubscriberDetails(true);
                        }}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        aria-label={`View details for ${subscriber.email}`}
                      >
                        <Eye className="h-4 w-4 text-slate-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setSelectedCampaign(null);
                setShowCampaignModal(true);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Campaign
            </button>
          </div>

          {isLoadingCampaigns ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <Send className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No campaigns yet</p>
              <p className="text-sm text-slate-400 mt-1">Create your first email campaign</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign._id}
                  campaign={campaign}
                  onView={() => {
                    setSelectedCampaign(campaign);
                    setShowCampaignModal(true);
                  }}
                  onDelete={() => handleDeleteCampaign(campaign)}
                  onSend={() => handleSendCampaign(campaign)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <SendEmailModal
        isOpen={showSendModal === 'subscribers'}
        onClose={() => setShowSendModal(null)}
        onSend={handleSendToSubscribers}
        title="Send Newsletter to Subscribers"
        recipientType="subscribers"
      />

      <SendEmailModal
        isOpen={showSendModal === 'users'}
        onClose={() => setShowSendModal(null)}
        onSend={handleSendToUsers}
        title="Send Announcement to All Users"
        recipientType="users"
      />

      <SendEmailModal
        isOpen={showSendModal === 'specific'}
        onClose={() => setShowSendModal(null)}
        onSend={handleSendToSpecificUsers}
        title={`Send Email to Selected Users (${selectedUsers.length})`}
        recipientType="specific"
        specificUsers={selectedUsers}
      />

      <CampaignModal
        isOpen={showCampaignModal}
        onClose={() => {
          setShowCampaignModal(false);
          setSelectedCampaign(null);
        }}
        onSave={handleCreateCampaign}
        campaign={selectedCampaign || undefined}
      />

      <SubscriberDetailsModal
        subscriber={selectedSubscriber}
        onClose={() => {
          setShowSubscriberDetails(false);
          setSelectedSubscriber(null);
        }}
      />
    </div>
  );
}