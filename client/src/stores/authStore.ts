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

function loadStoredUser(): User | null {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

const storedToken = localStorage.getItem('token');
const storedUser = loadStoredUser();


const initialValid = !!storedToken && !!storedUser;

export const useAuthStore = create<AuthStore>((set) => ({
  user: initialValid ? storedUser : null,
  token: initialValid ? storedToken : null,
  isAuthenticated: initialValid,

  setAuth: (user: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));