
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, UserRole } from '../types';
import { findUserByLoginId, saveUser } from '../services/dataStore';

interface AuthContextType extends AuthState {
  login: (loginId: string, password: string) => Promise<User>;
  logout: () => void;
  updatePassword: (newPassword: string) => void;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('odoo_current_session');
    if (savedUser) {
      setState({ user: JSON.parse(savedUser), isAuthenticated: true, loading: false });
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (loginId: string, password: string): Promise<User> => {
    const user = findUserByLoginId(loginId);
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }
    if (user.status === 'INACTIVE') {
      throw new Error('Account is deactivated. Contact HR.');
    }

    setState({ user, isAuthenticated: true, loading: false });
    localStorage.setItem('odoo_current_session', JSON.stringify(user));
    return user;
  };

  const logout = () => {
    setState({ user: null, isAuthenticated: false, loading: false });
    localStorage.removeItem('odoo_current_session');
  };

  const updatePassword = (newPassword: string) => {
    if (!state.user) return;
    const updatedUser = { ...state.user, password: newPassword, isFirstLogin: false };
    saveUser(updatedUser);
    setState(prev => ({ ...prev, user: updatedUser }));
    localStorage.setItem('odoo_current_session', JSON.stringify(updatedUser));
  };

  const refreshSession = () => {
    if (!state.user) return;
    const updatedUser = findUserByLoginId(state.user.loginId);
    if (updatedUser) {
      setState(prev => ({ ...prev, user: updatedUser }));
      localStorage.setItem('odoo_current_session', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updatePassword, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
