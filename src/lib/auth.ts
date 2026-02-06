const AUTH_URL = 'https://functions.poehali.dev/b1d4b2b5-cc9f-4029-86b6-b5a6fe639456';

export interface User {
  id: number;
  email: string;
  full_name: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface VerifyResponse {
  valid: boolean;
  user: User;
}

export const authService = {
  async register(email: string, password: string, full_name: string, phone?: string): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_URL}?action=register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, full_name, phone }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Ошибка регистрации');
    }

    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_URL}?action=login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Ошибка входа');
    }

    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  },

  async verify(): Promise<VerifyResponse | null> {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${AUTH_URL}?action=verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        this.logout();
        return null;
      }

      return data;
    } catch {
      this.logout();
      return null;
    }
  },

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },

  saveToken(token: string) {
    localStorage.setItem('auth_token', token);
  },

  saveUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  },
};