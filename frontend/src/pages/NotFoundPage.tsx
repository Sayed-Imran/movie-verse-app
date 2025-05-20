import { Link } from 'react-router-dom';
import { Film, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-center px-4">
      <Film className="h-20 w-20 text-purple-500 mb-6" />
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-white mb-6">Page Not Found</h2>
      <p className="text-gray-400 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
      >
        <Home className="h-5 w-5 mr-2" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;