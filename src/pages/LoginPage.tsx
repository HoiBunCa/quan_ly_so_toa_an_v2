import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, LogIn, User, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <LogIn className="w-12 h-12 text-blue-600 mb-3" />
          <h2 className="text-2xl font-bold text-gray-900">Phần mềm quản lý sổ toà án</h2>
          <p className="text-gray-600 text-sm mt-1">Quản lý sổ án của bạn một cách dễ dàng</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Tên đăng nhập
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tên đăng nhập của bạn"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập mật khẩu của bạn"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Đang đăng nhập...
              </span>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Đăng nhập</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}