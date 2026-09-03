import { create } from 'zustand';
import Cookies from 'js-cookie';
import { User, LoginForm, RegisterForm, ApiResponse } from '@/types';
import { api } from './api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginForm) => Promise<void>;
  register: (data: RegisterForm) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  login: async (data: LoginForm) => {
    set({ isLoading: true });
    try {
      // Mock API call for now
      // const res = await api.post<ApiResponse<{user: User, token: string}>>('/auth/login', data);
      
      // MOCK
      const mockUser: User = { id: '1', name: 'Test User', email: data.email, phone: '+237600000000', role: 'USER', createdAt: new Date().toISOString() };
      const mockToken = 'mock_jwt_token';
      
      Cookies.set('token', mockToken);
      Cookies.set('user', JSON.stringify(mockUser));
      
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  register: async (data: RegisterForm) => {
    set({ isLoading: true });
    try {
       // Mock
      const mockUser: User = { id: '1', name: data.name, email: data.email, phone: data.phone, role: data.role, createdAt: new Date().toISOString() };
      const mockToken = 'mock_jwt_token';
      
      Cookies.set('token', mockToken);
      Cookies.set('user', JSON.stringify(mockUser));
      
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: () => {
    Cookies.remove('token');
    Cookies.remove('user');
    set({ user: null, isAuthenticated: false });
    if (typeof window !== 'undefined') {
       window.location.href = '/login';
    }
  },
  
  checkAuth: () => {
    const token = Cookies.get('token');
    const userStr = Cookies.get('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ user, isAuthenticated: true, isLoading: false });
      } catch (e) {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
