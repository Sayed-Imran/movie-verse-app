import { ReactNode } from 'react';
import MovieCard from './MovieCard';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
}

interface MovieGridProps {
  movies: Movie[];
  isLoading?: boolean;
  title?: string;
  emptyMessage?: string;
  children?: ReactNode;
}

const MovieGrid = ({ movies, isLoading, title, emptyMessage, children }: MovieGridProps) => {
  return (
    <div className="mb-12">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          {children}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="rounded-lg overflow-hidden">
              <div className="bg-gray-700 animate-pulse aspect-[2/3]"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-700 animate-pulse rounded"></div>
                <div className="h-3 w-1/2 bg-gray-700 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              releaseDate={movie.release_date}
              voteAverage={movie.vote_average}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">{emptyMessage || 'No movies found'}</p>
        </div>
      )}
    </div>
  );
};

export default MovieGrid;