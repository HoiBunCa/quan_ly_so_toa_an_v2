import { useAuth } from '../context/AuthContext';

// This function should be used within a React component or custom hook
// that is wrapped by AuthProvider, as it uses useAuth.
export const authenticatedFetch = async (url: string, options?: RequestInit) => {
  const { accessToken, logout } = useAuth(); // Get accessToken and logout from context

  if (!accessToken) {
    // If no access token, it means the user is not authenticated.
    // We should log them out or redirect to login.
    logout(); // Force logout if token is missing
    throw new Error('Không có token truy cập. Vui lòng đăng nhập lại.');
  }

  const headers = {
    ...options?.headers,
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json', // Default to JSON content type
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (response.status === 401) { // Unauthorized
    toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    logout(); // Log out the user
    throw new Error('Unauthorized: Token expired or invalid.');
  }

  return response;
};