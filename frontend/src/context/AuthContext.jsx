import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const TOKEN_KEY = 'bloggg_token';
const USER_KEY = 'bloggg_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // loading until auth state is initialized

  // Initialize auth state from localStorage on app start
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Verify token is still valid by fetching current user
          const res = await authAPI.getMe();
          const freshUser = res.data.data.user;
          setUser(freshUser);
          localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
        } catch (error) {
          // Token expired or invalid — clear storage
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const saveAuth = useCallback((userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem(TOKEN_KEY, jwtToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }, []);

  const register = useCallback(async (formData) => {
    const res = await authAPI.register(formData);
    const { user: userData, token: jwtToken } = res.data.data;
    saveAuth(userData, jwtToken);
    toast.success('Account created successfully! Welcome 🎉');
    return res.data;
  }, [saveAuth]);

  const login = useCallback(async (credentials) => {
    const res = await authAPI.login(credentials);
    const { user: userData, token: jwtToken } = res.data.data;
    saveAuth(userData, jwtToken);
    toast.success(`Welcome back, ${userData.name}!`);
    return res.data;
  }, [saveAuth]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    toast.success('Logged out successfully');
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
