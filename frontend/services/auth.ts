import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

// Ensure we're using the correct backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = Cookies.get('hakim_auth_token') || null;
    }
  }

  async login(email: string, password: string, role: 'ADMIN' | 'STAFF' | 'CUSTOMER'): Promise<LoginResponse> {
    try {
      console.log('Attempting login with:', { email, role });
      console.log('Using API URL:', `${API_URL}/auth/login/${role.toLowerCase()}`);
      
      const response = await axios.post<LoginResponse>(`${API_URL}/auth/login/${role.toLowerCase()}`, {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Login response:', response.data);

      if (response.data.access_token) {
        this.token = response.data.access_token;
        // Set cookie with 7 days expiration
        Cookies.set('hakim_auth_token', response.data.access_token, { expires: 7 });
        
        // Store user data in cookies for consistency
        Cookies.set('admin_user', JSON.stringify(response.data.user), { expires: 7 });
        
        // Also store in localStorage for backward compatibility
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
        localStorage.setItem('adminToken', response.data.access_token);
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof AxiosError) {
        console.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          config: error.config,
        });

        if (error.response?.status === 401) {
          throw new Error('Invalid email or password');
        }
        if (error.response?.status === 403) {
          throw new Error('You do not have permission to access this area');
        }
        if (error.response?.status === 404) {
          throw new Error('User not found');
        }
        if (error.response?.status === 500) {
          throw new Error('Server error. Please try again later');
        }
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        if (!error.response) {
          throw new Error('Network error. Please check your connection');
        }
      }
      throw new Error('An unexpected error occurred');
    }
  }

  logout() {
    this.token = null;
    Cookies.remove('hakim_auth_token');
    Cookies.remove('admin_user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const authService = new AuthService(); 