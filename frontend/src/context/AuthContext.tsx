import { createContext, useState, useEffect, ReactNode } from 'react';
import { CurrentUser } from '../api/types';
import { usersApi } from '../api/users';

interface AuthContextType {
  user: CurrentUser | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    usersApi.getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = () => {
    window.location.href = '/oauth2/authorization/google';
  };

  const logout = () => {
    window.location.href = '/api/v1/auth/logout';
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
