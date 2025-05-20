import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import HeroSection from '../components/movies/HeroSection';
import MovieGrid from '../components/movies/MovieGrid';
import { fetchAllGenresWithMovies } from '../services/movieService';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
}

interface Genre {
  id: number;
  name: string;
  movies: Movie[];
}

// No need for AllGenresResponse interface here as we're using Genre[] directly

const HomePage = () => {
  const [heroMovie, setHeroMovie] = useState<Movie | undefined>(undefined);
  const [genreMovies, setGenreMovies] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      try {
        // Fetch all genres with movies
        const genreData = await fetchAllGenresWithMovies();
        setGenreMovies(genreData.genres);

        // Set a random hero movie from one of the genre movies
        if (genreData.genres.length > 0) {
          const randomGenreIndex = Math.floor(Math.random() * genreData.genres.length);
          const genreMovies = genreData.genres[randomGenreIndex].movies;

          if (genreMovies.length > 0) {
            const randomMovieIndex = Math.floor(Math.random() * genreMovies.length);
            setHeroMovie(genreMovies[randomMovieIndex]);
          }
        }
      } catch (err) {
        console.error("Failed to load movies:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <HeroSection movie={heroMovie} isLoading={isLoading} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Movie type selector removed */}

        {isLoading ? (
          <p className="text-center">Loading genres and movies...</p>
        ) : (
          genreMovies.map(genre => (
            <MovieGrid
              key={genre.id}
              movies={genre.movies}
              title={genre.name}
              isLoading={isLoading}
            >
              <Link
                to={`/genre/${genre.id}`}
                className="flex items-center text-blue-500 hover:text-blue-600"
              >
                View all <ChevronRight size={16} />
              </Link>
            </MovieGrid>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;