// services/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface AuthResponse {
  success: boolean;
  data?: {
    accessToken?: string;
    user?: {
      id: string;
      email: string;
    };
  };
  message?: string;
}

class ApiService {
  private baseURL: string;
  private isRefreshing = false;
  private accessToken: string | null = null;
  
  // Improved typing for failed queue
  private failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadTokenFromStorage();
  }

  private loadTokenFromStorage() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
    }
  }

  private saveTokenToStorage(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
    this.accessToken = token;
  }

  private clearTokenFromStorage() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    this.accessToken = null;
  }

  private isIOSDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  public async call<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, options);
  }

  // private async request<T>(
  //   endpoint: string,
  //   options: RequestInit = {}
  // ): Promise<T> {
  //   const url = `${this.baseURL}${endpoint}`;
  //   const isIOS = this.isIOSDevice();


  //   const headers: HeadersInit = {
  //     'Content-Type': 'application/json',
  //     ...options.headers,
  //   };

  //    // For iOS, use Authorization header
  //   if (isIOS && this.accessToken) {
  //     (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
  //   }

  //   const config: RequestInit = {
  //     credentials: isIOS ? 'omit' : 'include',
  //     headers,
  //     ...options,
  //   };

  //   // Auth endpoints should NOT trigger token refresh
  //   const isAuthEndpoint = endpoint.startsWith('/auth/');

  //   try {
  //     const response = await fetch(url, config);

  //     // Store token from login response for iOS
  //     if (isIOS && response.ok && endpoint === '/auth/login') {
  //       const data = await response.clone().json();
  //       if (data.data?.accessToken) {
  //         this.saveTokenToStorage(data.data.accessToken);
  //       }
  //     }

  //     if (response.status === 401) {
  //       if (isIOS && this.accessToken) {
  //         const refreshed = await this.refreshToken();
  //         if (refreshed) {
  //           (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
  //           const retryResponse = await fetch(url, { ...config, headers });
  //           if (retryResponse.ok) {
  //             return retryResponse.json();
  //           }
  //         }
  //       }
        
  //       if (isAuthEndpoint) {
  //         if (endpoint === '/auth/me') {
  //           return { success: false, data: null, message: 'Not authenticated' } as T;
  //         }
  //         throw new Error('Authentication failed');
  //       }
        
  //       return this.handleUnauthorizedRequest<T>(endpoint, options);
  //     }

  //     if (!response.ok) {
  //       const errorData = await response.json().catch(() => ({}));
  //       throw new Error(errorData.error?.message || `HTTP ${response.status}`);
  //     }

  //     const data = await response.json();
      
  //     if (data.data?.accessToken && isIOS) {
  //       this.saveTokenToStorage(data.data.accessToken);
  //     }
      
  //     return data;
  //   } catch (error: unknown) {
  //     if (endpoint === '/auth/me') {
  //       const message = error instanceof Error ? error.message : 'Backend not available';
  //       return { success: false, data: null, message } as T;
  //     }
  //     throw error;
  //   }
  // }

  private async request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${this.baseURL}${endpoint}`;
  const isIOS = this.isIOSDevice();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // For iOS, use Authorization header from localStorage
  if (isIOS && this.accessToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
  }

  const config: RequestInit = {
    // CRITICAL: Always use 'include' for credentials to send cookies
    credentials: 'include',
    headers,
    ...options,
  };

  try {
    const response = await fetch(url, config);

    // Store token from login response for iOS
    if (response.ok && (endpoint === '/auth/login' || endpoint === '/auth/refresh-token')) {
      const data = await response.clone().json();
      if (data.data?.accessToken) {
        this.saveTokenToStorage(data.data.accessToken);
      }
    }

    if (response.status === 401 && !endpoint.startsWith('/auth/')) {
      const refreshed = await this.refreshToken();
      if (refreshed && this.accessToken) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
        const retryResponse = await fetch(url, { ...config, headers });
        if (retryResponse.ok) {
          return retryResponse.json();
        }
      }
      throw new Error('Session expired');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (data.data?.accessToken) {
      this.saveTokenToStorage(data.data.accessToken);
    }
    
    return data;
  } catch (error: unknown) {
    if (endpoint === '/auth/me') {
      const message = error instanceof Error ? error.message : 'Backend not available';
      return { success: false, data: null, message } as T;
    }
    throw error;
  }
}

private async refreshToken(): Promise<boolean> {
  if (this.isRefreshing) {
    return new Promise((resolve) => {
      this.failedQueue.push({ 
        resolve: () => resolve(true),
        reject: () => resolve(false)
      });
    });
  }

  this.isRefreshing = true;

  try {
    const isIOS = this.isIOSDevice();
    
    const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include', // Always include for cookies
      headers: {
        'Content-Type': 'application/json',
        ...(isIOS && this.accessToken ? { 'Authorization': `Bearer ${this.accessToken}` } : {})
      },
    });
    
    if (response.ok) {
      const data = await response.json() as { data?: { accessToken?: string } };
      if (data.data?.accessToken) {
        this.saveTokenToStorage(data.data.accessToken);
        this.retryQueuedRequests();
        return true;
      }
    }
    
    this.clearTokenFromStorage();
    this.rejectQueuedRequests(new Error('Refresh failed'));
    return false;
  } catch {
    this.clearTokenFromStorage();
    this.rejectQueuedRequests(new Error('Refresh failed'));
    return false;
  } finally {
    this.isRefreshing = false;
  }
}

  private async handleUnauthorizedRequest<T>(
    endpoint: string,
    options: RequestInit
  ): Promise<T> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      try {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          this.retryQueuedRequests();
          return this.request(endpoint, options);
        } else {
          this.rejectQueuedRequests(new Error('Session expired'));
          throw new Error('Session expired');
        }
      } finally {
        this.isRefreshing = false;
      }
    }

    // Queue request while token is being refreshed
    return new Promise<T>((resolve, reject) => {
      this.failedQueue.push({
        resolve: (value: unknown) => resolve(value as T),
        reject: (reason?: unknown) => reject(reason),
      });
    });
  }

  // private async refreshToken(): Promise<boolean> {
  //   try {
  //     const isIOS = this.isIOSDevice();
      
  //     const refreshHeaders: HeadersInit = {};
      
  //     // Fix: Use bracket notation with type assertion for headers
  //     if (isIOS && this.accessToken) {
  //       (refreshHeaders as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
  //     }
      
  //     // FIX: Explicitly type the fetch response
  //     const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
  //       method: 'POST',
  //       credentials: isIOS ? 'omit' : 'include',
  //       headers: refreshHeaders,
  //     }) as Response;
      
  //     if (response.ok) {
  //       // Fix: Properly type the response parsing
  //       const data = await response.json() as { data?: { accessToken?: string } };
  //       if (data.data?.accessToken) {
  //         this.saveTokenToStorage(data.data.accessToken);
  //         return true;
  //       }
  //     }
      
  //     this.clearTokenFromStorage();
  //     return false;
  //   } catch {
  //     this.clearTokenFromStorage();
  //     return false;
  //   }
  // }

  private retryQueuedRequests() {
    this.failedQueue.forEach(({ resolve }) => resolve(null));
    this.failedQueue = [];
  }

  private rejectQueuedRequests(error: Error) {
    this.failedQueue.forEach(({ reject }) => reject(error));
    this.failedQueue = [];
  }

  // ==================== AUTH ENDPOINTS ====================

  async getMe() {
    return this.request('/auth/me');
  }

  async login(credentials: { email: string; password: string; rememberMe?: boolean }) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }) as {
      data?: {
        accessToken?: string;
      }
    };
    
    // Handle iOS token storage
    if (this.isIOSDevice() && response.data?.accessToken) {
      this.saveTokenToStorage(response.data.accessToken);
    }
    
    return response;
  }

  async register(userData: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    const isIOS = this.isIOSDevice();
    this.clearTokenFromStorage();
    
    return this.request('/auth/logout', {
      method: 'POST',
      credentials: isIOS ? 'omit' : 'include',
    });
  }

  async becomeSeller() {
    return this.request('/auth/become-seller', {
      method: 'POST',
    });
  }

  async verifyEmail(token: string) {
    return this.request(`/auth/verify-email/${token}`, {
      method: 'POST',
    });
  }

  async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyResetCode(email: string, code: string) {
    return this.request('/auth/verify-reset-code', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, newPassword }),
    });
  }

  async resendVerificationEmail(email: string) {
    return this.request('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }
}

export const api = new ApiService(API_BASE_URL);