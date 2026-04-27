import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const { success, data } = await apiClient.get('/auth/me');
    if (success) {
      setUser(data);
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { success, data, error } = await apiClient.post('/auth/login', { email, password });
    
    if (success && data?.token) {
      localStorage.setItem('token', data.token);
      await fetchUser();
      return { success: true, data };
    }
    return { success: false, error };
  };

  const register = async (userData) => {
    return await apiClient.post('/auth/register', userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  // Role & Capability Utilities
  const role = user?.role || 'USER';
  const isAdmin = role === 'ADMIN';
  const isUser = role === 'USER';

  const hasRole = (allowedRoles) => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.map(r => r.toUpperCase()).includes(role.toUpperCase());
  };

  const hasCapability = (capability) => {
    const capabilities = {
      ADMIN: ['view_analytics', 'manage_jira', 'manage_rewards', 'manage_users', 'view_admin_dashboard'],
      USER: ['earn_xp', 'redeem_rewards', 'view_user_dashboard']
    };
    return (capabilities[role.toUpperCase()] || []).includes(capability);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout,
      role, isAdmin, isUser, hasRole, hasCapability
    }}>
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
