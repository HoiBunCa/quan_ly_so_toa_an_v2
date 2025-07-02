import React from 'react';
import Dashboard from './components/Dashboard';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthProvider and useAuth
import LoginPage from './pages/LoginPage'; // Import LoginPage

function AppContent() {
  const { user, accessToken } = useAuth();

  // Check if user is logged in (has user data and access token)
  const isLoggedIn = !!user && !!accessToken;

  return (
    <>
      <Toaster />
      {isLoggedIn ? <Dashboard /> : <LoginPage />}
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