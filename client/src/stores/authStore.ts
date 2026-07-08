import { create } from 'zustand';

export type UserRole = 'adopter' | 'shelter_staff' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  
  setAuth: (user: User, token: string) => {
    localStorage.setItem('token', token);
    set({
      user,
      token,
      isAuthenticated: true,
    });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));