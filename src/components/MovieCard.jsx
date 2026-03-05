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
      className="relative group cursor-pointer transition duration-300
                 w-[140px] sm:w-[160px] md:w-[200px]"
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <div className="overflow-hidden rounded-xl">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-[210px] sm:h-[240px] md:h-[300px]
                     object-cover transform group-hover:scale-110 transition duration-500"
        />
      </div>

      {/* ❤️ Heart Button */}
      <button
        onClick={toggleFavorite}
        className="absolute top-2 right-2 z-20 text-lg sm:text-xl md:text-2xl
                   transition duration-300"
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
      <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition duration-300">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold line-clamp-2">
          {movie.title}
        </h3>
      </div>
    </div>
  );
}

export default MovieCard;
