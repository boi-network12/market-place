"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { api } from '@/services/api';

// ==================== TYPES ====================

export interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  username: string;
  phoneNumber?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  company?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  notificationPreferences?: {
    email: {
      marketing: boolean;
      security: boolean;
      updates: boolean;
    };
  };
  role: string;
  isSeller: boolean;
  emailVerified: boolean;
  createdAt: string;
}

interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
  updateProfile: () => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  deleteAvatar: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateNotificationPreferences: (prefs: unknown) => Promise<void>;
}

export interface ProfileFormData {
  fullName: string;
  phoneNumber: string;
  bio: string;
  website: string;
  company: string;
  socialLinks: {
    twitter: string;
    linkedin: string;
    github: string;
  };
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: '',
    phoneNumber: '',
    bio: '',
    website: '',
    company: '',
    socialLinks: {
      twitter: '',
      linkedin: '',
      github: '',
    },
  });

  const isLoadingRef = useRef(false);
  const mountedRef = useRef(true);

  // Load profile data
  const loadProfile = useCallback(async () => {
    if (isLoadingRef.current) return;
    if (!mountedRef.current) return;
    if (!user) return;

    try {
      isLoadingRef.current = true;
      setIsLoading(true);

      const response = await api.getProfile() as { success: boolean; data: { user: UserProfile } };
      
      if (response.success && response.data?.user) {
        const userData = response.data.user;
        setProfile(userData);
        
        // Update form data with profile values
        setFormData({
          fullName: userData.fullName || '',
          phoneNumber: userData.phoneNumber || '',
          bio: userData.bio || '',
          website: userData.website || '',
          company: userData.company || '',
          socialLinks: {
            twitter: userData.socialLinks?.twitter || '',
            linkedin: userData.socialLinks?.linkedin || '',
            github: userData.socialLinks?.github || '',
          },
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [user]);

  // Refresh profile
  const refreshProfile = useCallback(async () => {
    await loadProfile();
    await refreshUser();
  }, [loadProfile, refreshUser]);

  // Update profile
  const updateProfile = useCallback(async () => {
    if (!profile) return;

    try {
      setIsLoading(true);
      
      // Send data exactly as the backend expects
      const updateData: {
        fullName?: string;
        phoneNumber?: string;
        bio?: string;
        website?: string;
        company?: string;
        socialLinks?: {
          twitter?: string;
          linkedin?: string;
          github?: string;
        };
      } = {
        fullName: formData.fullName || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        bio: formData.bio || undefined,
        website: formData.website || undefined,
        company: formData.company || undefined,
        socialLinks: {
          twitter: formData.socialLinks.twitter || undefined,
          linkedin: formData.socialLinks.linkedin || undefined,
          github: formData.socialLinks.github || undefined,
        }
      };
      
      // Remove undefined values - using explicit key checking instead of string indexing
      if (updateData.fullName === undefined) delete updateData.fullName;
      if (updateData.phoneNumber === undefined) delete updateData.phoneNumber;
      if (updateData.bio === undefined) delete updateData.bio;
      if (updateData.website === undefined) delete updateData.website;
      if (updateData.company === undefined) delete updateData.company;
      
      // Handle socialLinks specially
      if (updateData.socialLinks) {
        if (updateData.socialLinks.twitter === undefined) delete updateData.socialLinks.twitter;
        if (updateData.socialLinks.linkedin === undefined) delete updateData.socialLinks.linkedin;
        if (updateData.socialLinks.github === undefined) delete updateData.socialLinks.github;
        
        if (Object.keys(updateData.socialLinks).length === 0) {
          delete updateData.socialLinks;
        }
      }
      
      const response = await api.updateProfile(updateData) as { success: boolean; data: { user: UserProfile } };

      if (response.success && response.data?.user) {
        setProfile(response.data.user);
        await refreshUser();
        setIsEditing(false);
        console.log('Profile updated successfully');
        return;
      }
      throw new Error('Failed to update profile');
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [formData, profile, refreshUser]);

    // Upload avatar
    const uploadAvatar = useCallback(async (file: File) => {
      if (!profile) return;

      try {
        setIsLoading(true);
        const response = await api.uploadAvatar(file);
        
        if (response.success) {
          await refreshProfile();
          console.log('Avatar uploaded successfully');
          return;
        }
        throw new Error(response.message || 'Failed to upload avatar');
      } catch (error) {
        console.error('Failed to upload avatar:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }, [profile, refreshProfile]);

  // Delete avatar
  const deleteAvatar = useCallback(async () => {
    if (!profile) return;

    try {
      setIsLoading(true);
      const response = await api.deleteAvatar();

      if (response.success) {
        await refreshProfile();
        console.log('Avatar deleted successfully');
        return;
      }
      throw new Error('Failed to delete avatar');
    } catch (error) {
      console.error('Failed to delete avatar:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [profile, refreshProfile]);

  // Change password
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      const response = await api.changePassword(currentPassword, newPassword) as { success: boolean; message?: string };

      if (response.success) {
        console.log('Password changed successfully');
        return;
      }
      throw new Error(response.message || 'Failed to change password');
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update notification preferences
  const updateNotificationPreferences = useCallback(async (prefs: unknown) => {
    if (!profile) return;

    try {
      setIsLoading(true);
      const response = await api.updateProfile({ notificationPreferences: prefs }) as { success: boolean; data: { user: UserProfile } };

      if (response.success && response.data?.user) {
        setProfile(response.data.user);
        console.log('Notification preferences updated');
        return;
      }
      throw new Error('Failed to update preferences');
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  // Load profile on mount and when user changes
  useEffect(() => {
    mountedRef.current = true;
    
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadProfile();
    } else {
      setProfile(null);
      setIsLoading(false);
    }

    return () => {
      mountedRef.current = false;
    };
  }, [user, loadProfile]);

  const value: ProfileContextType = {
    profile,
    isLoading,
    isEditing,
    setIsEditing,
    formData,
    setFormData,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    changePassword,
    refreshProfile,
    updateNotificationPreferences,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}