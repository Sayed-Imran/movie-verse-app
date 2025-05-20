import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  username: string;
  email: string;
  full_name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in on initial load
    const storedUser = localStorage.getItem('user');
    const username = localStorage.getItem('username');

    if (storedUser && username) {
      setUser(JSON.parse(storedUser));
      // Ensure username is always available for API calls
      if (!localStorage.getItem('username')) {
        localStorage.setItem('username', JSON.parse(storedUser).username);
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (username: string, _password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create a mock user object with the provided username
      const mockUser: User = {
        username,
        email: `${username}@example.com`, // Dummy email
        full_name: username // Using username as full name for simplicity
      };

      // Store username in localStorage for API calls
      localStorage.setItem('username', username);

      // Set the user in state
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));

      // No need for a real token, but we'll store a dummy one to maintain compatibility
      localStorage.setItem('token', 'mock-token');

      console.log('Mock login successful for user:', username);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, _password: string, fullName?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create a mock user with the registration information
      const mockUser: User = {
        username,
        email,
        full_name: fullName || username
      };

      // Store username in localStorage for API calls
      localStorage.setItem('username', username);

      // Set the user in state
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));

      // Store a dummy token
      localStorage.setItem('token', 'mock-token');

      console.log('Mock registration successful for user:', username);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    setUser(null);

    // Refresh the page to ensure application state is completely reset
    window.location.reload();
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};