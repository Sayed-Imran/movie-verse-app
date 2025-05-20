# filepath: /home/imran/projects/kubernetes/traffic-management/request-response/project/backend-bollywood/app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import httpx
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Load environment variables

class Config(BaseSettings):
    TMDB_API_KEY: str
    TMDB_API_BASE_URL: str = "https://api.themoviedb.org/3"
    DATA_DIR: str = os.path.join(os.path.dirname(__file__), "bollywood-data")
    GENRES_FILE: str = os.path.join(os.path.dirname(__file__), "genres.json")

config = Config()

load_dotenv()

app = FastAPI(title="BollywoodVerse API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Welcome to BollywoodVerse API"}

@app.get("/genres")
def get_genres():
    """Get list of all movie genres"""
    try:
        if not os.path.exists(config.GENRES_FILE):
            raise FileNotFoundError(f"Genre file not found at {config.GENRES_FILE}")
            
        with open(config.GENRES_FILE, "r") as f:
            genres_data = json.load(f)
        return genres_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load genres: {str(e)}")

@app.get("/movies/genre/{genre_id}")
def get_movies_by_genre(genre_id: int, page: int = 1, per_page: int = 20):
    """Get movies by genre ID"""
    try:
        # Construct the file path for the genre
        genre_name = get_genre_name(genre_id)
        file_path = f"{config.DATA_DIR}/genre_{genre_id}_{'_'.join(genre_name.lower().split())}.json"
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"No movies found for genre ID {genre_id}")
        
        with open(file_path, "r") as f:
            movies_data = json.load(f)
        
        # Simple pagination
        total_movies = len(movies_data.get("results", []))
        total_pages = (total_movies + per_page - 1) // per_page
        
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        
        paginated_results = movies_data.get("results", [])[start_idx:end_idx]
        
        return {
            "results": paginated_results,
            "page": page,
            "total_pages": total_pages,
            "total_results": total_movies
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load movies for genre {genre_id}: {str(e)}")

@app.get("/movies/all-genres")
def get_all_genres_with_movies(limit_per_genre: int = 5):
    """Get a limited number of movies from each genre"""
    try:
        all_genres = []
        
        with open(config.GENRES_FILE, "r") as f:
            genres_data = json.load(f)
            
        for genre in genres_data.get("genres", []):
            genre_id = genre.get("id")
            genre_name = genre.get("name")
            
            file_path = f"{config.DATA_DIR}/genre_{genre_id}_{'_'.join(genre_name.lower().split())}.json"
            
            if os.path.exists(file_path):
                with open(file_path, "r") as f:
                    movies_data = json.load(f)
                
                # Get limited movies for this genre
                limited_movies = movies_data.get("results", [])[:limit_per_genre]
                
                all_genres.append({
                    "id": genre_id,
                    "name": genre_name,
                    "movies": limited_movies
                })
        
        return {"genres": all_genres}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load all genres with movies: {str(e)}")

@app.get("/movies/search")
def search_movies(query: str, page: int = 1, per_page: int = 20):
    """Search for movies by title or keyword"""
    try:
        # Load all movie data from genre files
        all_movies = []
        
        # Check if data directory exists
        if not os.path.exists(config.DATA_DIR):
            raise HTTPException(status_code=500, detail=f"Data directory not found: {config.DATA_DIR}")
            
        # Get list of genre files
        genre_files = [f for f in os.listdir(config.DATA_DIR) if f.startswith("genre_") and f.endswith(".json")]
        
        # Extract movies from each genre file
        for genre_file in genre_files:
            file_path = os.path.join(config.DATA_DIR, genre_file)
            with open(file_path, "r") as f:
                genre_data = json.load(f)
                all_movies.extend(genre_data.get("results", []))
        
        # Remove duplicates by movie ID
        unique_movies = {movie["id"]: movie for movie in all_movies}.values()
        
        # Filter movies by search query (case-insensitive)
        query = query.lower()
        filtered_movies = [
            movie for movie in unique_movies 
            if query in movie.get("title", "").lower() or 
               query in movie.get("overview", "").lower()
        ]
        
        # Sort by popularity or relevance
        filtered_movies.sort(key=lambda x: x.get("popularity", 0), reverse=True)
        
        # Implement pagination
        total_results = len(filtered_movies)
        total_pages = (total_results + per_page - 1) // per_page
        
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        
        paginated_results = filtered_movies[start_idx:end_idx]
        
        return {
            "results": paginated_results,
            "page": page,
            "total_pages": total_pages,
            "total_results": total_results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to search movies: {str(e)}")

@app.get("/movie/{movie_id}")
async def get_movie_details(movie_id: str):
    """Get details of a specific movie by ID directly from TMDB API"""
    try:
        # Convert movie_id to integer to ensure it's a valid format
        movie_id_int = int(movie_id)
        
        # Append additional movie information like credits and videos
        data = await fetch_from_tmdb(f"/movie/{movie_id_int}", {"append_to_response": "credits,videos"})
        
        return data
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail=f"Movie with ID {movie_id} not found")
        else:
            raise HTTPException(status_code=e.response.status_code, detail=f"TMDB API error: {str(e)}")
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid movie ID format: {movie_id}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load movie details: {str(e)}")

def get_genre_name(genre_id: int) -> str:
    """Helper function to get genre name from ID"""
    try:
        if not os.path.exists(config.GENRES_FILE):
            return "Unknown"
            
        with open(config.GENRES_FILE, "r") as f:
            genres_data = json.load(f)
            
        for genre in genres_data.get("genres", []):
            if genre.get("id") == genre_id:
                return genre.get("name", "Unknown")
        
        return "Unknown"
    except Exception:
        return "Unknown"

async def fetch_from_tmdb(endpoint: str, params: dict = None):
    """Helper function to fetch data from TMDB API with Bollywood parameters."""
    if params is None:
        params = {}
    
    # Add parameters for Indian/Hindi movies
    params.update({
        "api_key": config.TMDB_API_KEY,
        "with_original_language": "hi",  # Hindi language
        "with_origin_country": "IN",     # India region
    })
    
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{config.TMDB_API_BASE_URL}{endpoint}", params=params)
        response.raise_for_status()
        return response.json()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)