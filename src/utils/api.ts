import toast from 'react-hot-toast';

// This function now creates and returns the authenticated fetch function.
// It takes accessToken and logout as arguments, which must be obtained from useAuth
// inside a React component or custom hook.
export const createAuthenticatedFetch = (accessToken: string | null, logout: () => void) => {
  return async (url: string, options?: RequestInit) => {
    if (!accessToken) {
      // If token is null, it means user is not logged in or token was cleared.
      // Force logout and throw error.
      logout();
      throw new Error('Không có token truy cập. Vui lòng đăng nhập lại.');
    }

    const headers = {
      ...options?.headers,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
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
};