import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Clock, Calendar, Film, Tag, Play } from 'lucide-react';
import { fetchMovieDetails } from '../services/movieService';

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date: string;
  runtime: number;
  vote_average: number;
  genres: { id: number; name: string }[];
  credits: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
    }>;
  };
  videos: {
    results: Array<{
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }>;
  };
}

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedTrailerKey, setSelectedTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    const getMovieDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const movieData = await fetchMovieDetails(parseInt(id));
        setMovie(movieData);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    getMovieDetails();
    // Scroll to top when navigating to a new movie
    window.scrollTo(0, 0);
  }, [id]);

  const handlePlayTrailer = (key: string) => {
    setSelectedTrailerKey(key);
    setShowTrailer(true);
  };

  const closeTrailer = () => {
    setShowTrailer(false);
    setSelectedTrailerKey(null);
  };

  const getTrailer = () => {
    if (!movie?.videos?.results) return null;
    
    // Look for an official trailer first
    const officialTrailer = movie.videos.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube' && video.name.toLowerCase().includes('official')
    );
    
    // Otherwise get any trailer
    const anyTrailer = movie.videos.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    
    // As a fallback, get any video
    const anyVideo = movie.videos.results.find(
      video => video.site === 'YouTube'
    );
    
    return officialTrailer || anyTrailer || anyVideo;
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const trailer = movie ? getTrailer() : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-[400px] w-full bg-gray-800 animate-pulse rounded-xl mb-8"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <div className="h-[450px] bg-gray-800 animate-pulse rounded-lg"></div>
            </div>
            <div className="w-full md:w-2/3">
              <div className="h-12 bg-gray-800 animate-pulse rounded-md mb-4"></div>
              <div className="h-6 bg-gray-800 animate-pulse rounded-md w-1/3 mb-6"></div>
              <div className="h-24 bg-gray-800 animate-pulse rounded-md mb-6"></div>
              <div className="h-10 bg-gray-800 animate-pulse rounded-md w-1/4 mb-8"></div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-800 animate-pulse rounded-md"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return null;
  }

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;
    
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const director = movie.credits.crew.find(person => person.job === 'Director');
  const topCast = movie.credits.cast.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Backdrop */}
      {backdropUrl && (
        <div className="relative h-[400px] w-full">
          <div className="absolute inset-0">
            <img 
              src={backdropUrl} 
              alt={movie.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/50"></div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl transform md:-translate-y-16">
              <img 
                src={posterUrl} 
                alt={movie.title} 
                className="w-full h-auto"
              />
            </div>
          </div>
          
          {/* Movie Details */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
              {movie.release_date && (
                <div className="flex items-center text-gray-300">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(movie.release_date).getFullYear()}
                </div>
              )}
              
              {movie.runtime > 0 && (
                <div className="flex items-center text-gray-300">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatRuntime(movie.runtime)}
                </div>
              )}
              
              {movie.vote_average > 0 && (
                <div className="flex items-center text-yellow-400">
                  <Star className="h-4 w-4 mr-1" fill="currentColor" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            {movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map(genre => (
                  <span 
                    key={genre.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-200"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
            
            {movie.overview && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-white">Overview</h2>
                <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
              </div>
            )}
            
            {trailer && (
              <button
                onClick={() => handlePlayTrailer(trailer.key)}
                className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 mb-8"
              >
                <Play className="h-5 w-5 mr-2" fill="currentColor" />
                Watch Trailer
              </button>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {director && (
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-white">Director</h2>
                  <p className="text-gray-300">{director.name}</p>
                </div>
              )}
              
              {topCast.length > 0 && (
                <div className="md:col-span-2">
                  <h2 className="text-xl font-semibold mb-4 text-white">Cast</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {topCast.map(actor => (
                      <div key={actor.id} className="bg-gray-800 rounded-lg overflow-hidden">
                        {actor.profile_path ? (
                          <img 
                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} 
                            alt={actor.name}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                            <Film className="h-12 w-12 text-gray-500" />
                          </div>
                        )}
                        <div className="p-3">
                          <p className="font-medium text-white">{actor.name}</p>
                          <p className="text-sm text-gray-400">{actor.character}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Trailer Modal */}
      {showTrailer && selectedTrailerKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative w-full max-w-4xl">
            <button 
              onClick={closeTrailer}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <span className="text-2xl">&times;</span>
              <span className="sr-only">Close</span>
            </button>
            <div className="relative aspect-video">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${selectedTrailerKey}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailsPage;