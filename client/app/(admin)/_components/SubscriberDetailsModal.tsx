import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X } from 'lucide-react';
import { Subscriber } from '../admin/email-subscribers/page';

const SubscriberDetailsModal = ({ subscriber, onClose }: { subscriber: Subscriber | null; onClose: () => void }) => {
    if (!subscriber) return null;
    
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-50"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-white" />
                <h2 className="text-lg font-semibold text-white">Subscriber Details</h2>
              </div>
              <button onClick={onClose} className="p-1 rounded-lg bg-white/10 hover:bg-white/20" aria-label="Close modal">
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{subscriber.email}</p>
                <p className="text-sm text-slate-500">Subscribed: {new Date(subscriber.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Interests</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {subscriber.interests.length > 0 ? (
                      subscriber.interests.map((interest: string) => (
                        <span key={interest} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-xs">
                          {interest}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">No interests selected</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Source</p>
                  <p className="text-sm text-slate-900 dark:text-white mt-1">{subscriber.source}</p>
                </div>
                
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Location</p>
                  <p className="text-sm text-slate-900 dark:text-white mt-1">{subscriber.metadata?.location || 'Unknown'}</p>
                </div>
                
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Status</p>
                  <div className="mt-1">
                    {subscriber.unsubscribedAt ? (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 rounded-full text-xs">Unsubscribed</span>
                    ) : subscriber.isVerified ? (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 rounded-full text-xs">Verified</span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 rounded-full text-xs">Pending Verification</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

export default SubscriberDetailsModal