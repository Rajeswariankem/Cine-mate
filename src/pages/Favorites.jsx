import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
  }, []);

  return (
    <div className="bg-black min-h-screen text-white px-10 py-10">
      {/* Back Button */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 border border-gray-400 px-5 py-2 rounded-lg text-gray-300 transition duration-300 hover:bg-red-600 hover:text-white hover:border-transparent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </button>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-10">❤️ Your Favorites</h1>

      {/* Favorites Grid */}
      {favorites.length === 0 ? (
        <p className="text-gray-400">No favorite movies yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {favorites.map((movie) => (
            <div
              key={movie.id}
              className="relative cursor-pointer group"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="rounded-lg hover:scale-105 transition"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();

                  const updated = favorites.filter((m) => m.id !== movie.id);
                  setFavorites(updated);
                  localStorage.setItem("favorites", JSON.stringify(updated));
                }}
                className="absolute top-2 right-2
                   w-8 h-8 flex items-center justify-center
                   bg-black/70 text-white rounded-full
                   opacity-0 group-hover:opacity-100
                   hover:bg-red-600 transition duration-300"
              >
                <span className="text-lg leading-none">✕</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
