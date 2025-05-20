import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await register(username, email, password, fullName || undefined);
        navigate('/');
      } catch (error) {
        console.error('Registration error:', error);
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Create an Account</h1>
          <p className="mt-2 text-gray-400">Join MovieVerse to track and discover movies</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username *
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  errors.username ? 'border-red-500' : 'border-gray-600'
                } bg-gray-700 text-white rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10`}
                placeholder="Choose a username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  errors.email ? 'border-red-500' : 'border-gray-600'
                } bg-gray-700 text-white rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name (Optional)
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  errors.password ? 'border-red-500' : 'border-gray-600'
                } bg-gray-700 text-white rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10`}
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                } bg-gray-700 text-white rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {isLoading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                </span>
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <UserPlus className="h-5 w-5 text-purple-300 group-hover:text-purple-200" />
                </span>
              )}
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
          
          <div className="text-center text-sm">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;