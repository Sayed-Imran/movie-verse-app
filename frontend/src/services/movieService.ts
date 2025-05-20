import axios from 'axios';
import api from './apiInterceptor';

// Types
interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
}

interface MovieResponse {
  results: Movie[];
  total_results: number;
  total_pages: number;
  page: number;
}

// Additional type for genre information
interface Genre {
  id: number;
  name: string;
}

interface GenreWithMovies {
  id: number;
  name: string;
  movies: Movie[];
}

interface AllGenresResponse {
  genres: GenreWithMovies[];
}

// Helper function to handle API errors
const handleApiError = (error: unknown) => {
  console.error('API Error:', error);
  if (axios.isAxiosError(error)) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch data from API');
  } else {
    throw new Error('An unknown error occurred');
  }
};

// Genre-based movie fetching is the primary way to get movies now

// Fetch movie details
export const fetchMovieDetails = async (movieId: number) => {
  try {
    const response = await api.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Search for movies
export const searchMovies = async (
  query: string,
  page = 1,
  year?: string,
  genreIds: number[] = []
): Promise<MovieResponse> => {
  try {
    const response = await api.get(`/movies/search`, {
      params: {
        query,
        page,
        ...(year && { year })
      }
    });

    const results = response.data;

    if (genreIds.length > 0) {
      results.results = results.results.filter((movie: Movie) =>
        movie.genre_ids?.some((genreId: number) => genreIds.includes(genreId))
      );

      results.total_results = results.results.length;
    }

    return results;
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch all available genres
export const fetchGenres = async (): Promise<{ genres: Genre[] }> => {
  try {
    const response = await api.get(`/genres`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch movies by specific genre
export const fetchMoviesByGenre = async (
  genreId: number,
  page = 1
): Promise<MovieResponse> => {
  try {
    const response = await api.get(`/movies/genre/${genreId}`, {
      params: { page }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch a limited number of movies from all genres (for homepage)
export const fetchAllGenresWithMovies = async (
  limitPerGenre = 5
): Promise<AllGenresResponse> => {
  try {
    const response = await api.get(`/movies/all-genres`, {
      params: { limit_per_genre: limitPerGenre }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};