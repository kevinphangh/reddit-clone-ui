// FORCE HTTPS - Updated 2025-07-14 18:30
const API_URL = 'https://via-forum-api.fly.dev';
console.log('API URL is:', API_URL); // Debug log to verify

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
    const baseUrl = API_URL.replace('http://', 'https://');
    const url = `${baseUrl}${endpoint}`;
    console.log('Making request to:', url); // Debug log
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

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
        window.location.href = '/login';
      }
      
      throw new ApiError(response.status, errorMessage);
    }

    return response.json();
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

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Network error' }));
      throw new ApiError(response.status, error.detail || 'Login failed');
    }

    const data: TokenResponse = await response.json();
    this.setToken(data.access_token);
    return data;
  }

  async getMe() {
    return this.request<ApiUser>('/api/auth/me');
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
      body: JSON.stringify({ title, content }),
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
    return this.request<{ score: number; user_vote: number | null }>(`/api/posts/${postId}/vote/?vote_value=${value}`, {
      method: 'POST',
    });
  }

  async toggleSavePost(postId: string) {
    return this.request<{ saved: boolean }>(`/api/posts/${postId}/save/`, {
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
}

export const api = new ApiClient();
export { ApiError };