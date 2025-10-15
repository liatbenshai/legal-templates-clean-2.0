'use client';

import { useState, useEffect } from 'react';
import { AuthService } from '@/lib/auth';
import { User } from '@/lib/auth-types';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await AuthService.login({ email, password });
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  const register = async (data: any) => {
    const result = await AuthService.register(data);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
    router.push('/');
  };

  const updateProfile = async (updatedUser: User) => {
    const success = await AuthService.updateUser(updatedUser);
    if (success) {
      setUser(updatedUser);
    }
    return success;
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  };
}
