import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProfile } from '../types/index.ts';
import { apiRequest } from '../lib/api.ts';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (updated: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('codemate_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const savedToken = localStorage.getItem('codemate_token');
    if (!savedToken) {
      setUser(null);
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiRequest<{ user: User; profile: UserProfile }>('/api/auth/me');
      setUser(data.user);
      setProfile(data.profile);
    } catch (err) {
      console.warn('Session check failed, clearing token:', err);
      localStorage.removeItem('codemate_token');
      setToken(null);
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await apiRequest<{ token: string; user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('codemate_token', data.token);
      setToken(data.token);
      setUser(data.user);
      await refreshUser();
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async () => {
    setIsLoading(true);
    try {
      const data = await apiRequest<{ token: string; user: User }>('/api/auth/demo-login', {
        method: 'POST',
      });
      localStorage.setItem('codemate_token', data.token);
      setToken(data.token);
      setUser(data.user);
      await refreshUser();
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (formData: any) => {
    setIsLoading(true);
    try {
      const data = await apiRequest<{ token: string; user: User }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      localStorage.setItem('codemate_token', data.token);
      setToken(data.token);
      setUser(data.user);
      await refreshUser();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('codemate_token');
    setToken(null);
    setUser(null);
    setProfile(null);
    apiRequest('/api/auth/logout', { method: 'POST' }).catch(() => {});
  };

  const updateUser = (updated: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isLoading,
        login,
        demoLogin,
        signup,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
