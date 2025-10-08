import { useState, useEffect } from 'react';
import './App.css';
import Search from './Search';
import MovieCard from './MovieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Debounce search term
  useDebounce(
    () => setDebouncedSearchTerm(searchTerm),
    1000,
    [searchTerm]
  );

  // Fetch movies from TMDB
  const fetchMovies = async (query) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) throw new Error('Failed to fetch movies');

      const data = await response.json();
      setMovieList(data.results || []);

      // Update search count if searching and results found
      if (query && data.results.length > 0) {
        await updateSearchCount(query.trim().toLowerCase(), data.results[0]);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error fetching movies. Please try again later.');
      setMovieList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load trending movies from Appwrite
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.log(`Error fetching trending movies: ${error}`);
    }
  }
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);


  // Header images from public folder
  const headerImages = [
    './image/head.avif',
    './image/movie2.avif',
    './image/movie1.jpg',
    './image/head3.jpg',
  ];
  const randomHeaderImage =
    headerImages[Math.floor(Math.random() * headerImages.length)];

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img
            src={randomHeaderImage}
            alt="Header Banner"
            className="header-image"
          />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* Trending Movies Section */}
        {trendingMovies.length > 0 && (
          <section className='trending-movies'>
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.id || index}>
                  <img src={movie.poster_url || './image/placeholder.jpg'}
                    alt={movie.title || 'Movie'}
                    onError={(e) => (e.target.src = './image/placeholder.jpg')}
                  />
                  <p>{movie.title}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* All Movies Section */}
        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <p className="text-white">Loading...</p>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul className="movies-grid">
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
