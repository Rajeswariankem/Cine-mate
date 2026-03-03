import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function MovieCard({ movie }) {
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorite(stored.some((m) => m.id === movie.id));
  }, [movie.id]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    let stored = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorite) {
      stored = stored.filter((m) => m.id !== movie.id);
    } else {
      stored.push(movie);
    }

    localStorage.setItem("favorites", JSON.stringify(stored));
    setFavorite(!favorite);
  };

  return (
    <div
      className="relative group cursor-pointer transition duration-300"
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <div className="overflow-hidden rounded-xl">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
        />
      </div>

      {/* ❤️ Heart Button */}
      <button
        onClick={toggleFavorite}
        className="absolute top-3 right-3 z-20
                 text-2xl transition duration-300"
      >
        {favorite ? (
          <span className="text-red-600">♥</span>
        ) : (
          <span className="text-white">♡</span>
        )}
      </button>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 rounded-xl"></div>

      {/* Title */}
      <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition duration-300">
        <h3 className="text-lg font-semibold">{movie.title}</h3>
      </div>
    </div>
  );
}

export default MovieCard;
