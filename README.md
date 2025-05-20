# MovieVerse - Full-Stack Movie Application with Istio Traffic Management

A beautiful movie browsing application with multi-version backends supporting traffic management:
- **Backend**: Python FastAPI (with Bollywood and Hollywood movie data variants)
- **Frontend**: React with TypeScript and Tailwind CSS
- **Data Source**: TMDB API
- **Deployment**: Kubernetes with Istio for traffic management

## Features

- Browse movies by genre (Bollywood and Hollywood variants)
- Detailed movie information
- Search functionality with filters
- Genre-based movie exploration
- Traffic splitting based on user headers
- Responsive design with Tailwind CSS
- Kubernetes & Istio deployment ready

## Project Structure

```
project/
├── backend/                # FastAPI backend
│   ├── app/                # Main application code
│   │   ├── bollywood-data/ # Bollywood movie data by genre
│   │   └── hollywood-data/ # Hollywood movie data by genre
│   ├── Dockerfile          # Backend container image
│   └── req.txt             # Python dependencies
├── frontend/               # React frontend
│   ├── src/                # React components and hooks
│   │   ├── components/     # UI components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Application pages
│   │   └── services/       # API service integrations
│   ├── Dockerfile          # Frontend container image
│   └── package.json        # Node dependencies
└── manifests/              # Kubernetes deployment manifests
    ├── backend.yaml        # Backend deployment with Istio config
    └── frontend.yaml       # Frontend deployment with Istio config
```

## Setup Instructions

### Local Development Setup

#### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r req.txt`
5. Start the server: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`

#### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### Docker & Kubernetes Setup

#### Building Docker Images
1. Build the backend image:
   ```bash
   docker build -t your-registry/movie-backend:v1.0.0 ./backend
   ```

2. Build the frontend image:
   ```bash
   docker build -t your-registry/movie-frontend:v1.0.0 ./frontend
   ```

3. Push images to your registry:
   ```bash
   docker push your-registry/movie-backend:v1.0.0
   docker push your-registry/movie-frontend:v1.0.0
   ```

#### Kubernetes Deployment
1. Create the TMDB API key secret (replace `<your-api-key>` with your actual TMDB API key):
   ```bash
   kubectl create secret generic tmdb-api-key --from-literal=TMDB_API_KEY=<your-api-key>
   ```

2. Apply the manifests:
   ```bash
   kubectl apply -f manifests/backend.yaml
   kubectl apply -f manifests/frontend.yaml
   ```

3. If using Istio for the first time:
   ```bash
   kubectl label namespace default istio-injection=enabled
   ```

4. Get the Istio ingress gateway IP:
   ```bash
   kubectl get svc istio-ingressgateway -n istio-system
   ```

## API Endpoints

- `GET /` - API welcome message
- `GET /genres` - Get list of all movie genres
- `GET /movies/genre/{genre_id}` - Get movies by specific genre
- `GET /movies/all-genres` - Get limited movies from each genre
- `GET /movies/search` - Search for movies by title or keyword
- `GET /movie/{movie_id}` - Get detailed information about a specific movie

## Traffic Management

The application demonstrates Istio traffic management capabilities:

### Backend Variants
- **V1 (Default)**: Serves Bollywood movie data
- **V2**: Serves Hollywood movie data

### Traffic Rules
- Requests with header `X-username: Imran` are routed to backend V2 (Hollywood)
- All other requests are routed to backend V1 (Bollywood)

### Testing Request Routing
```bash
# Route to V1 (Bollywood)
curl -H "Host: example.com" http://$INGRESS_HOST/api/genres

# Route to V2 (Hollywood)
curl -H "Host: example.com" -H "X-username: Imran" http://$INGRESS_HOST/api/genres
```

## Architecture

### Frontend
- React with TypeScript for type safety
- Tailwind CSS for responsive UI components
- Context API for state management
- React Router for navigation
- Axios for API requests with interceptors

### Backend
- FastAPI (Python) for high-performance API endpoints
- Pre-fetched movie data organized by genre
- Dual data sources (Bollywood and Hollywood variants)
- Environment variable configuration
- CORS enabled for frontend communication

### Kubernetes & Istio
- Multiple backend versions (V1/V2) for different content
- Istio VirtualService for intelligent traffic routing
- Request header-based routing rules
- Gateway configuration for external access
- Resource limits and container configuration

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request