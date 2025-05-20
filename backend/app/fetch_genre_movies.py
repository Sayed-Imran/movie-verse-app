#!/usr/bin/env python3
"""
Script to fetch 20 movies from each genre and store them in JSON files.
This reduces the need to query the TMDB API repeatedly.
"""
import json
import os
import sys
import httpx
import asyncio
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# TMDB API Configuration
TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_API_BASE_URL = os.getenv("TMDB_API_BASE_URL", "https://api.themoviedb.org/3")

# Directory to store genre-specific JSON files
DATA_DIR = Path(os.path.dirname(os.path.abspath(__file__))) / "data"

# Create data directory if it doesn't exist
os.makedirs(DATA_DIR, exist_ok=True)

# Path to the genres.json file
GENRES_FILE = Path(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))) / "genres.json"

async def fetch_from_tmdb(endpoint: str, params: dict = None):
    """Helper function to fetch data from TMDB API with Bollywood parameters."""
    if params is None:
        params = {}
    
    # Add parameters for Indian/Hindi movies
    params.update({
        "api_key": TMDB_API_KEY,
        "with_original_language": "hi",  # Hindi language
        "with_origin_country": "IN",     # India region
    })
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{TMDB_API_BASE_URL}{endpoint}", params=params)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as e:
        print(f"Error fetching data for {endpoint}: {str(e)}")
        return None

async def fetch_genre_movies(genre_id: int, genre_name: str, page: int = 1, results_per_genre: int = 20):
    """Fetch movies for a specific genre and save them to a JSON file."""
    print(f"Fetching {results_per_genre} movies for genre: {genre_name} (ID: {genre_id})")
    
    # Fetch movie data from TMDB
    data = await fetch_from_tmdb("/discover/movie", {
        "page": page,
        "with_genres": str(genre_id),
        "sort_by": "popularity.desc", 
        "with_origin_country": "IN", 
        
    })
    
    if not data or "results" not in data:
        print(f"No data found for genre {genre_name}")
        return
    
    # Limit results to the specified number
    if len(data["results"]) > results_per_genre:
        data["results"] = data["results"][:results_per_genre]
    data["total_results"] = len(data["results"])
    data["total_pages"] = 1
    
    # Save to JSON file
    output_file = DATA_DIR / f"genre_{genre_id}_{genre_name.lower().replace(' ', '_')}.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    
    print(f"Saved {len(data['results'])} movies to {output_file}")

async def fetch_all_genres_movies():
    """Fetch movies for all genres."""
    try:
        # Load genres from file
        with open(GENRES_FILE, "r") as f:
            genres_data = json.load(f)
        
        genres = genres_data["genres"]
        print(f"Found {len(genres)} genres. Starting to fetch movies...")
        
        # Process each genre
        tasks = []
        for genre in genres:
            task = fetch_genre_movies(genre["id"], genre["name"])
            tasks.append(task)
        
        # Execute all tasks concurrently
        await asyncio.gather(*tasks)
        
        print("\nAll genre data has been successfully fetched and stored!")
        
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error loading genres file: {str(e)}")
        sys.exit(1)
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    if not TMDB_API_KEY:
        print("Error: TMDB_API_KEY is not set in environment variables.")
        sys.exit(1)
    
    print("Starting to fetch movies by genre...")
    asyncio.run(fetch_all_genres_movies())
    print("Done!")
