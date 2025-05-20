import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MovieGrid from '../components/movies/MovieGrid';
import { fetchMoviesByGenre, fetchGenres } from '../services/movieService';

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
}

const GenrePage = () => {
    const { id } = useParams<{ id: string }>();
    
    const [movies, setMovies] = useState<Movie[]>([]);
    const [genreName, setGenreName] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        const fetchGenreName = async () => {
            try {
                const genresData = await fetchGenres();
                const genre = genresData.genres.find(g => g.id === parseInt(id as string));
                if (genre) {
                    setGenreName(genre.name);
                }
            } catch (error) {
                console.error('Failed to fetch genre name:', error);
            }
        };

        fetchGenreName();
    }, [id]);

    useEffect(() => {
        const loadMovies = async () => {
            setIsLoading(true);
            try {
                const genreId = parseInt(id as string);
                const data = await fetchMoviesByGenre(genreId, currentPage);
                setMovies(data.results);
                setTotalPages(data.total_pages);
            } catch (error) {
                console.error('Failed to fetch movies:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            loadMovies();
        }
    }, [id, currentPage]);

    // Handle page change
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold">{genreName} Movies</h1>
                </div>
            </div>

            <MovieGrid
                movies={movies}
                isLoading={isLoading}
                emptyMessage={`No ${genreName} movies found.`}
            />

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 bg-gray-100 rounded-md">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default GenrePage;
