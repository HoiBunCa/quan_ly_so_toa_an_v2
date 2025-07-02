import React from 'react';
import Dashboard from './components/Dashboard';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Toaster />
      {isAuthenticated ? <Dashboard /> : <LoginPage />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;