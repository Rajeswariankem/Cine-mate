import { useEffect, useState } from "react";
import axios from "axios";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import MovieRow from "../components/MovieRow";

function Home() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`)
      .then((res) => setTrending(res.data.results));

    axios
      .get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`)
      .then((res) => setTopRated(res.data.results));

    axios
      .get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=28`,
      )
      .then((res) => setActionMovies(res.data.results));
  }, [apiKey]);

  const searchMovies = (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    axios
      .get(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
      )
      .then((res) => {
        setSearchResults(res.data.results);
      });
  };

  return (
    <div className="bg-black min-h-screen overflow-x-hidden">
      <Navbar onSearch={searchMovies} />
      <Hero />

      <div id="movies-section" className="mt-20 scroll-mt-24">
        {searchResults.length > 0 ? (
          <MovieRow title="🔎 Search Results" movies={searchResults} />
        ) : (
          <>
            <MovieRow title="🔥 Trending" movies={trending} />

            <MovieRow title="⭐ Top Rated" movies={topRated} />

            <MovieRow title="💥 Action" movies={actionMovies} />
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
