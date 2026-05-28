// services/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiService {
  private baseURL: string;
  private isRefreshing = false;
  
  // Improved typing for failed queue
  private failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Auth endpoints should NOT trigger token refresh
    const isAuthEndpoint = endpoint.startsWith('/auth/');

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        const data = await response.json().catch(() => ({}));

        if (isAuthEndpoint) {
          // Let auth endpoints handle their own 401s (login failed, etc.)
          if (endpoint === '/auth/me') {
            return { success: false, data: null, message: 'Not authenticated' } as T;
          }
          throw new Error(data.message || data.error?.message || 'Authentication failed');
        }

        return this.handleUnauthorizedRequest<T>(endpoint, options);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: unknown) {
      if (endpoint === '/auth/me') {
        const message = error instanceof Error ? error.message : 'Backend not available';
        return { success: false, data: null, message } as T;
      }
      throw error;
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
        resolve: (value: unknown) => resolve(value as T),   // <-- Key fix: type assertion
        reject: (reason?: unknown) => reject(reason),
      });
    });
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      });
      return response.ok;
    } catch {
      return false;
    }
  }

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
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
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
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async becomeSeller() {
    return this.request('/auth/become-seller', {
      method: 'POST',
    });
  }

  async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  async verifyEmail(token: string) {
    return this.request(`/auth/verify-email/${token}`, {
      method: 'POST',
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