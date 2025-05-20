import { Film, Github, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Film className="h-6 w-6 text-purple-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                MovieVerse
              </span>
            </Link>
            <p className="text-sm">
              Discover the universe of movies. Browse films by genre from both Bollywood and Hollywood.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-300">Home</Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-white transition-colors duration-300">Search</Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-white transition-colors duration-300">Profile</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/genre/28?type=hollywood" className="text-gray-400 hover:text-white transition-colors duration-300">Action</Link>
              </li>
              <li>
                <Link to="/genre/35?type=hollywood" className="text-gray-400 hover:text-white transition-colors duration-300">Comedy</Link>
              </li>
              <li>
                <Link to="/genre/18?type=hollywood" className="text-gray-400 hover:text-white transition-colors duration-300">Drama</Link>
              </li>
              <li>
                <Link to="/genre/53?type=hollywood" className="text-gray-400 hover:text-white transition-colors duration-300">Thriller</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-400 text-center">
          <p>
            &copy; {new Date().getFullYear()} MovieVerse. All rights reserved.
          </p>
          <p className="mt-2">
            Powered by TMDB API. This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;