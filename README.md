# MovieVerse - Full-Stack Movie Application

A beautiful movie browsing application built with:
- **Backend**: Python FastAPI
- **Frontend**: React with TypeScript and Tailwind CSS
- **Data Source**: TMDB API

## Features

- User authentication (login/register)
- Browse trending, popular, and top-rated movies
- Detailed movie information
- Search functionality with filters
- Responsive design for all devices

## Project Structure

```
movieverse/
├── backend/         # FastAPI backend
│   ├── app/         # Main application code
│   ├── requirements.txt
│   └── .env.example
└── frontend/        # React frontend
    ├── src/         # React components and hooks
    └── public/      # Static assets
```

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Rename `.env.example` to `.env` and add your TMDB API key
6. Start the server: `uvicorn app.main:app --reload`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Start the development server: `npm run dev`

## API Endpoints

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /movies/trending` - Get trending movies
- `GET /movies/popular` - Get popular movies
- `GET /movies/top_rated` - Get top-rated movies
- `GET /movies/{movie_id}` - Get movie details
- `GET /movies/search` - Search for movies