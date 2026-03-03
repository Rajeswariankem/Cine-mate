import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Hero() {
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`)
      .then((res) => {
        const randomMovie =
          res.data.results[Math.floor(Math.random() * res.data.results.length)];
        setMovie(randomMovie);
      });
  }, [apiKey]);

  if (!movie) return null;

  return (
    <div className="relative h-screen text-white">
      {/* Background Image */}
      <img
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        alt={movie.title}
        className="absolute w-full h-full object-cover opacity-40"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-10">
        <h1 className="text-6xl font-bold mb-4">{movie.title}</h1>

        <p className="max-w-xl text-gray-300 mb-6 line-clamp-3">
          {movie.overview}
        </p>

        <button
          onClick={() => navigate(`/movie/${movie.id}`)}
          className="bg-red-600 px-6 py-3 rounded-lg hover:scale-105 transition duration-300 w-fit"
        >
          Watch Now
        </button>
      </div>
    </div>
  );
}

export default Hero;
