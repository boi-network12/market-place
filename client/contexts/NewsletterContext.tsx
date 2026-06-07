// contexts/NewsletterContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { NewsletterService, NewsletterSubscriber, SubscribeData } from '@/services/newsletter.service';
import { useAuth } from './AuthContext';

interface NewsletterContextType {
  // State
  isLoading: boolean;
  subscribers: NewsletterSubscriber[];
  totalSubscribers: number;
  currentPage: number;
  
  // Subscription Actions
  subscribe: (data: SubscribeData) => Promise<{ success: boolean; message: string }>;
  unsubscribe: (email: string) => Promise<{ success: boolean; message: string }>;
  
  // Admin Actions
  fetchSubscribers: (filters?: { search?: string; isActive?: boolean; page?: number }) => Promise<void>;
  exportSubscribers: (format: 'csv' | 'json') => Promise<void>;
  sendNewsletter: (subject: string, content: string, subscriberIds?: string[]) => Promise<{ sent: number; failed: number }>;
  
  // UI State
  subscriptionStatus: 'idle' | 'loading' | 'success' | 'error';
  subscriptionMessage: string;
  clearSubscriptionStatus: () => void;
}

const NewsletterContext = createContext<NewsletterContextType | undefined>(undefined);

export function NewsletterProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  
  const [isLoading, setIsLoading] = useState(false);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  /**
   * Subscribe to newsletter
   */
  const subscribe = useCallback(async (data: SubscribeData): Promise<{ success: boolean; message: string }> => {
    setSubscriptionStatus('loading');
    setSubscriptionMessage('');
    
    try {
      const result = await NewsletterService.subscribe(data);
      
      setSubscriptionStatus(result.success ? 'success' : 'error');
      setSubscriptionMessage(result.message);
      
      return result;
    } catch (err: unknown) {
      const error = err as { message: string };
      const message = error.message || 'Failed to subscribe';
      setSubscriptionStatus('error');
      setSubscriptionMessage(message);
      return { success: false, message };
    }
  }, []);

  /**
   * Unsubscribe from newsletter
   */
  const unsubscribe = useCallback(async (email: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    try {
      const result = await NewsletterService.unsubscribe(email);
      return result;
    } catch (err: unknown) {
        const error = err as { message: string };
      return {
        success: false,
        message: error.message || 'Failed to unsubscribe',
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch subscribers (Admin only)
   */
  const fetchSubscribers = useCallback(async (filters?: {
    search?: string;
    isActive?: boolean;
    page?: number;
  }) => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      const result = await NewsletterService.getSubscribers(filters);
      setSubscribers(result.subscribers);
      setTotalSubscribers(result.total);
      setCurrentPage(result.page);
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  /**
   * Export subscribers (Admin only)
   */
  const exportSubscribers = useCallback(async (format: 'csv' | 'json') => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      await NewsletterService.exportSubscribers(format);
    } catch (error) {
      console.error('Failed to export subscribers:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  /**
   * Send newsletter (Admin only)
   */
  const sendNewsletter = useCallback(async (subject: string, content: string, subscriberIds?: string[]) => {
    if (!isAdmin) return { sent: 0, failed: 0 };
    
    setIsLoading(true);
    try {
      const result = await NewsletterService.sendNewsletter(subject, content, subscriberIds);
      return result;
    } catch (error) {
      console.error('Failed to send newsletter:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  /**
   * Clear subscription status
   */
  const clearSubscriptionStatus = useCallback(() => {
    setSubscriptionStatus('idle');
    setSubscriptionMessage('');
  }, []);

  const value: NewsletterContextType = {
    isLoading,
    subscribers,
    totalSubscribers,
    currentPage,
    subscribe,
    unsubscribe,
    fetchSubscribers,
    exportSubscribers,
    sendNewsletter,
    subscriptionStatus,
    subscriptionMessage,
    clearSubscriptionStatus,
  };

  return (
    <NewsletterContext.Provider value={value}>
      {children}
    </NewsletterContext.Provider>
  );
}

export function useNewsletter() {
  const context = useContext(NewsletterContext);
  if (context === undefined) {
    throw new Error('useNewsletter must be used within a NewsletterProvider');
  }
  return context;
}