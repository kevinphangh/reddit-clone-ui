// FORCE HTTPS - Updated 2025-07-14 18:30
const API_URL = import.meta.env.VITE_API_URL || 'https://via-forum-api.fly.dev';

// PERMANENT FIX: Always ensure HTTPS
const ensureHttps = (url: string): string => {
  if (url.startsWith('http://')) {
    // Convert HTTP to HTTPS silently
    return url.replace('http://', 'https://');
  }
  return url;
};


// API Response types
interface ApiUser {
  id: number;
  username: string;
  email: string;
  created_at: string;
  is_active: boolean;
  is_verified: boolean;
  points: { post: number; comment: number };
}

interface ApiPost {
  id: number;
  title: string;
  content: string | null;
  author: ApiUser;
  created_at: string;
  updated_at: string;
  edited_at: string | null;
  score: number;
  comment_count: number;
  is_locked: boolean;
  type: string;
  user_vote: number | null;
  saved: boolean;
}

interface ApiComment {
  id: number;
  body: string;
  author: ApiUser;
  post: { id: number; title: string };
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  edited_at: string | null;
  score: number;
  depth: number;
  is_deleted: boolean;
  replies?: ApiComment[];
  user_vote: number | null;
  saved: boolean;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on init
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // FORCE HTTPS - Remove any accidental HTTP
    const baseUrl = ensureHttps(API_URL);
    const url = ensureHttps(`${baseUrl}${endpoint}`);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = 'API Error';
        try {
          const error = await response.json();
          errorMessage = error.detail || error.message || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        if (response.status === 401) {
          // Unauthorized - clear token
          this.setToken(null);
          // Only redirect if not already on login/register page
          const currentPath = window.location.pathname;
          if (!currentPath.startsWith('/login') && !currentPath.startsWith('/register')) {
            window.location.href = '/login?from=' + encodeURIComponent(currentPath);
          }
        }
        
        throw new ApiError(response.status, errorMessage);
      }

      return response.json();
    } catch (error) {
      // Handle network errors
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(0, 'Netværksfejl - kunne ikke oprette forbindelse til serveren');
      }
      throw new ApiError(0, 'Der opstod en uventet fejl');
    }
  }

  // Auth endpoints
  async register(username: string, email: string, password: string) {
    return this.request<{ message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  }

  async login(username: string, password: string) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    // FORCE HTTPS - same as in request method
    const baseUrl = ensureHttps(API_URL);
    const url = ensureHttps(`${baseUrl}/api/auth/login`);
    
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Network error' }));
      // Login error: status code and details logged server-side
      throw new ApiError(response.status, error.detail || 'Login failed');
    }

    const data: TokenResponse = await response.json();
    this.setToken(data.access_token);
    return data;
  }

  async getMe() {
    return this.request<ApiUser>('/api/auth/me');
  }
  
  async verifyEmail(token: string) {
    return this.request<{ message: string }>(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
      method: 'POST'
    });
  }

  // Posts endpoints
  async getPosts(params?: { skip?: number; limit?: number; sort?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    
    return this.request<ApiPost[]>(`/api/posts/?${queryParams}`);
  }

  async getPost(postId: string) {
    return this.request<ApiPost>(`/api/posts/${postId}/`);
  }

  async createPost(title: string, content: string) {
    return this.request<ApiPost>('/api/posts/', {
      method: 'POST',
      body: JSON.stringify({ title, content, type: 'text' }),
    });
  }

  async updatePost(postId: string, updates: { title?: string; content?: string }) {
    return this.request<ApiPost>(`/api/posts/${postId}/`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deletePost(postId: string) {
    return this.request<{ message: string }>(`/api/posts/${postId}/`, {
      method: 'DELETE',
    });
  }

  async votePost(postId: string, value: number) {
    return this.request<{ score: number; user_vote: number | null }>(`/api/posts/${postId}/vote?vote_value=${value}`, {
      method: 'POST',
    });
  }

  async toggleSavePost(postId: string) {
    return this.request<{ saved: boolean }>(`/api/posts/${postId}/save`, {
      method: 'POST',
    });
  }

  // Comments endpoints
  async getComments(postId: string) {
    return this.request<ApiComment[]>(`/api/comments/post/${postId}`);
  }

  async createComment(postId: string, body: string, parentId?: string | null) {
    return this.request<ApiComment>(`/api/comments/post/${postId}`, {
      method: 'POST',
      body: JSON.stringify({ 
        body, 
        parent_id: parentId ? parseInt(parentId) : null 
      }),
    });
  }

  async updateComment(commentId: string, body: string) {
    return this.request<ApiComment>(`/api/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ body }),
    });
  }

  async deleteComment(commentId: string) {
    return this.request<{ message: string }>(`/api/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  async voteComment(commentId: string, value: number) {
    return this.request<{ score: number; user_vote: number | null }>(`/api/comments/${commentId}/vote?vote_value=${value}`, {
      method: 'POST',
    });
  }

  // Users endpoints
  async getUser(username: string) {
    return this.request<ApiUser>(`/api/users/${username}`);
  }

  async getUserPosts(username: string) {
    return this.request<ApiPost[]>(`/api/users/${username}/posts`);
  }

  async getUserComments(username: string) {
    return this.request<ApiComment[]>(`/api/users/${username}/comments`);
  }

  async getUserCount() {
    try {
      return await this.request<{ count: number }>(`/api/users/count`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        // Expected - endpoint not implemented yet
        throw new ApiError(404, 'User count endpoint not available');
      }
      throw error;
    }
  }
}

export const api = new ApiClient();
export { ApiError };