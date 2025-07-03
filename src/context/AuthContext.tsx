import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface UserData {
  name: string;
  user_id: number;
  role: string;
}

interface AuthContextType {
  user: UserData | null;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  useEffect(() => {
    // Load tokens from localStorage on initial render
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedUser = localStorage.getItem('user');

    if (storedAccessToken && storedRefreshToken && storedUser) {
      try {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user data:", e);
        // Clear invalid data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
    setLoadingInitial(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8003/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng nhập thất bại');
      }

      // Assuming the API response directly contains access, refresh, name, user_id, role
      const data = await response.json();
      const { access, refresh, name, user_id, role } = data; // Changed from data.data to data

      setAccessToken(access);
      setRefreshToken(refresh);
      setUser({ name, user_id, role });

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify({ name, user_id, role }));

      toast.success('Đăng nhập thành công!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra tên người dùng và mật khẩu.');
      throw error; // Re-throw to allow LoginPage to handle loading state
    }
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    toast.success('Đã đăng xuất.');
  };

  if (loadingInitial) {
    // Optionally render a loading spinner or splash screen here
    return <div className="flex items-center justify-center h-screen text-gray-600">Đang tải...</div>;
  }

  // Explicitly define the context value
  const contextValue: AuthContextType = { user, accessToken, login, logout };

  return (
    <AuthContext.Provider value={contextValue}>
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