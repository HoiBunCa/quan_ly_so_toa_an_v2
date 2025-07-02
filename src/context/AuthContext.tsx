import React, { createContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string; token: string } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string; token: string } | null>(null);

  useEffect(() => {
    // Check for token in localStorage on app load
    const storedToken = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('authUsername');
    if (storedToken && storedUsername) {
      setIsAuthenticated(true);
      setUser({ username: storedUsername, token: storedToken });
      console.log('AuthContext: User restored from localStorage.');
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8003/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.');
      }

      const data = await response.json();
      const token = data.token; // Assuming the API returns a 'token' field

      if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUsername', username);
        setIsAuthenticated(true);
        setUser({ username, token });
        toast.success('Đăng nhập thành công!');
        console.log('AuthContext: User logged in successfully.');
        return true;
      } else {
        throw new Error('Không nhận được token từ server.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Đã xảy ra lỗi trong quá trình đăng nhập.');
      console.error('AuthContext: Login error:', error);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUsername');
    setIsAuthenticated(false);
    setUser(null);
    toast.success('Đã đăng xuất.');
    console.log('AuthContext: User logged out.');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};