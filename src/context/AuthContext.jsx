import React, { createContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check existing session on application boot / browser refresh
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const data = await api.getMe();
        if (isMounted && data.success) {
          setUser(data.user);
        }
      } catch (err) {
        // Not logged in or session expired
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const data = await api.login({ email, password });
      setUser(data.user);
      return data.user;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    setAuthError(null);
    try {
      const data = await api.register(userData);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.warn('Logout request completed with warning:', err.message);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    authError,
    setAuthError,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
