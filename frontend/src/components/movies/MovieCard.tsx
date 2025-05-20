import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  releaseDate?: string;
  voteAverage?: number;
}

const MovieCard = ({ id, title, posterPath, releaseDate, voteAverage }: MovieCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = posterPath 
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const formattedDate = releaseDate 
    ? new Date(releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'Unknown date';

  return (
    <Link 
      to={`/movie/${id}`}
      className="group bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:-translate-y-2 hover:shadow-xl"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
            <span className="sr-only">Loading...</span>
          </div>
        )}
        
        {imageError ? (
          <div className="absolute inset-0 bg-gray-700 flex items-center justify-center text-gray-500">
            <span className="text-sm font-medium">No Image</span>
          </div>
        ) : (
          <img 
            src={imageUrl}
            alt={title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {voteAverage !== undefined && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-400" fill="currentColor" />
            <span className="text-xs font-bold">{voteAverage.toFixed(1)}</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-bold line-clamp-1 group-hover:text-purple-400 transition-colors duration-300">
          {title}
        </h3>
        {releaseDate && (
          <p className="text-gray-400 text-sm mt-1">{formattedDate}</p>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;