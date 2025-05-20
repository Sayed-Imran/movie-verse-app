import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';

interface Movie {
  id: number;
  title: string;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
}

interface HeroSectionProps {
  movie?: Movie;
  isLoading?: boolean;
}

const HeroSection = ({ movie, isLoading = false }: HeroSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Add a small delay for animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [movie]);

  if (isLoading) {
    return (
      <div className="relative w-full h-[70vh] bg-gray-800 animate-pulse">
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <div className="h-10 w-2/3 bg-gray-700 rounded-md animate-pulse mb-4"></div>
          <div className="h-4 w-1/3 bg-gray-700 rounded-md animate-pulse mb-4"></div>
          <div className="h-24 w-full md:w-2/3 bg-gray-700 rounded-md animate-pulse mb-6"></div>
          <div className="h-10 w-32 bg-gray-700 rounded-md animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return null;
  }

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : 'https://via.placeholder.com/1920x1080?text=No+Backdrop';
    
  return (
    <div className="relative w-full h-[70vh]">
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={backdropUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/30"></div>
      </div>
      
      <div 
        className={`absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">{movie.title}</h1>
        
        <div className="flex items-center mb-4">
          {movie.vote_average > 0 && (
            <div className="flex items-center mr-4">
              <Star className="h-5 w-5 text-yellow-400 mr-1" fill="currentColor" />
              <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-200 text-lg mb-6 max-w-2xl line-clamp-3 md:line-clamp-4">
          {movie.overview}
        </p>
        
        <Link 
          to={`/movie/${movie.id}`}
          className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
        >
          View Details
          <ChevronRight className="ml-1 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;