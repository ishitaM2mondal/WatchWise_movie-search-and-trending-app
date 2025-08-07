// import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// const Card = ({title}) =>{
//   const[count, setCount] = useState(0);
//   const [hasLiked, setHasLiked] = useState(false);

//   useEffect(() => {
//     console.log(`${title} has been liked: ${hasLiked}`);
//   }, [hasLiked]);

//   return(
//     <div className="card" onClick={() => setCount(count + 1)}>
//       <h2>{title} <br /> {count || null}</h2>
//       <button onClick={() => setHasLiked(!hasLiked)}>
//         {hasLiked ? '💓' : '💔'}
//       </button>
//     </div>
//     )
//   }
//  const App = () => {
//   return(
//     <div className="card-container">
//       <Card title="Star Wars" rating={5} isCool={true}  />
//       <Card title="Avatar" />
//       <Card title="The Lion King" />
//     </div>
//   )
// }
// export default App


import { useState, useEffect } from 'react'
import './App.css'
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
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');


  //debounce the search term to prevent making too many API requests
  //by waiting for the user to stop typing for 500ms

  useDebounce(() => {
    console.log(searchTerm, "debounce");
    setDebouncedSearchTerm(searchTerm);
  }, 1000, [searchTerm]);


  const fetchMovies = async (query) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` //ternary operator in js ? and :
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`; //$ is for string
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      console.log("Fetched data:", data);
      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        const cleanedQuery = query.trim().toLowerCase();

        const exactMatch = data.results.find((movie) =>
          movie.title?.trim().toLowerCase() === cleanedQuery
        );

        if (exactMatch) {
          await updateSearchCount(cleanedQuery, exactMatch);
          setMovieList([exactMatch]); // Only show the matched movie
        } else {
          setMovieList([]); // No match — show nothing
        }
      }

    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later. ');
      setMovieList([]);
    } finally {
      setIsLoading(false)
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.log(`Error fetching trending movies: ${error}`);
    }
  }
  useEffect(() => {
    console.log(searchTerm, debouncedSearchTerm, "how how")
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);


  const headerImages = [
    './image/head.avif',
    './image/head1.avif',
    './image/head2.avif',
    './image/head3.jpg'
  ];
  const randomHeaderImage = headerImages[Math.floor(Math.random() * headerImages.length)];

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src={randomHeaderImage} alt="Header Banner" className="header-image" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        {/* under the search bar the trending movies show accodring to their count */}
        {trendingMovies.length > 0 && (
          <section className='trending-movies'>
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.id || index}>
                  <p>{index + 1}</p>
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


        <section className='all-movies'>
          <h2>All Movies</h2>
          {<p className='text-red-500'>{errorMessage}</p>}
          {isLoading ? (
            <p className='text-white'>Loading...</p>
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App