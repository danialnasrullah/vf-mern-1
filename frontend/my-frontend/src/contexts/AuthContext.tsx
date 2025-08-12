import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  role: 'student' | 'teacher' | null;
  userId: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

function decodeJwt(token: string): { userId?: string; role?: 'student' | 'teacher' } | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return { userId: decoded.userId, role: decoded.role };
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<'student' | 'teacher' | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in on app start
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      const decoded = decodeJwt(storedToken);
      setRole(decoded?.role ?? null);
      setUserId(decoded?.userId ?? null);
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    const decoded = decodeJwt(newToken);
    setRole(decoded?.role ?? null);
    setUserId(decoded?.userId ?? null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setRole(null);
    setUserId(null);
  };

  const value = {
    isAuthenticated,
    token,
    role,
    userId,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 