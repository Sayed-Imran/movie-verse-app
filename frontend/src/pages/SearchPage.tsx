import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import MovieGrid from '../components/movies/MovieGrid';
import { searchMovies, fetchGenres } from '../services/movieService';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
}

interface Genre {
  id: number;
  name: string;
}

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [yearFilter, setYearFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch genres on component mount
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genresData = await fetchGenres();
        setGenres(genresData.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    loadGenres();
  }, []);

  // Perform search when query parameter changes
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, 1);
    }
  }, [initialQuery]);

  const performSearch = async (query: string, page: number) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const results = await searchMovies(
        query,
        page,
        yearFilter,
        selectedGenres
      );

      setSearchResults(results.results);
      setTotalPages(results.total_pages);
      setCurrentPage(page);

      // Update URL params
      setSearchParams({
        query,
        ...(yearFilter && { year: yearFilter }),
        ...(selectedGenres.length > 0 && { genres: selectedGenres.join(',') })
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery, 1);
  };

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setYearFilter('');

    if (searchQuery) {
      performSearch(searchQuery, 1);
    }

    setShowFilters(false);
  };

  const loadMoreResults = () => {
    if (currentPage < totalPages) {
      performSearch(searchQuery, currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Search Movies</h1>

        <div className="mb-8">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies..."
              className="w-full bg-gray-800 text-white border-none rounded-lg py-4 px-6 pl-12 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search className="absolute left-4 top-4 text-gray-400" />

            <div className="absolute right-4 top-3 flex space-x-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md flex items-center transition-colors duration-300"
              >
                <Filter className="h-5 w-5" />
                <span className="ml-1 hidden sm:inline">Filters</span>
              </button>

              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-6 bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Release Year</h4>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="Enter year (e.g. 2023)"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="w-full bg-gray-700 text-white border-none rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() => handleGenreToggle(genre.id)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${selectedGenres.includes(genre.id)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => performSearch(searchQuery, 1)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors duration-300"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearFilters}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors duration-300"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Active filters display */}
          {(selectedGenres.length > 0 || yearFilter) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-gray-400">Active filters:</span>

              {yearFilter && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-600 text-white">
                  Year: {yearFilter}
                  <button
                    onClick={() => {
                      setYearFilter('');
                      performSearch(searchQuery, 1);
                    }}
                    className="ml-1 text-white focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {selectedGenres.map(genreId => {
                const genre = genres.find(g => g.id === genreId);
                return genre && (
                  <span
                    key={genreId}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-600 text-white"
                  >
                    {genre.name}
                    <button
                      onClick={() => {
                        handleGenreToggle(genreId);
                        performSearch(searchQuery, 1);
                      }}
                      className="ml-1 text-white focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}

              <button
                onClick={clearFilters}
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Search Results */}
        {initialQuery && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">
              {searchResults.length > 0
                ? `Search results for "${initialQuery}"`
                : isLoading
                  ? "Searching..."
                  : `No results found for "${initialQuery}"`
              }
            </h2>

            <MovieGrid
              movies={searchResults}
              isLoading={isLoading}
              emptyMessage={initialQuery ? `No results found for "${initialQuery}"` : "Start by searching for a movie"}
            />

            {searchResults.length > 0 && currentPage < totalPages && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMoreResults}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
                >
                  Load More Results
                </button>
              </div>
            )}
          </div>
        )}

        {!initialQuery && !isLoading && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Search for Movies</h2>
            <p className="text-gray-400">Enter a movie title to start searching</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;