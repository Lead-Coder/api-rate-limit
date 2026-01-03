import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  apiKey: string | null;
  role: 'admin' | 'client' | null;
  isAuthenticated: boolean;
  login: (apiKey: string, role: 'admin' | 'client') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [role, setRole] = useState<'admin' | 'client' | null>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('apiKey');
    const storedRole = localStorage.getItem('role') as 'admin' | 'client' | null;
    if (storedApiKey && storedRole) {
      setApiKey(storedApiKey);
      setRole(storedRole);
    }
  }, []);

  const login = (newApiKey: string, newRole: 'admin' | 'client') => {
    setApiKey(newApiKey);
    setRole(newRole);
    localStorage.setItem('apiKey', newApiKey);
    localStorage.setItem('role', newRole);
  };

  const logout = () => {
    setApiKey(null);
    setRole(null);
    localStorage.removeItem('apiKey');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ apiKey, role, isAuthenticated: !!apiKey, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
