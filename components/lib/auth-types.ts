export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  phone?: string;
  company?: string;
  createdAt: string;
  lastLogin: string;
  settings: UserSettings;
}

export interface UserSettings {
  emailNotifications: boolean;
  saveHistory: boolean;
  defaultFontSize: number;
  theme: 'light' | 'dark';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  company?: string;
}

export interface ResetPasswordData {
  email: string;
}

