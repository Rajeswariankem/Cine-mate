import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ onSearch }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <nav className="fixed w-full bg-black/80 backdrop-blur-md text-white px-4 md:px-10 py-4 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0 z-50">
      {/* Left - Logo */}
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-bold text-red-500 cursor-pointer"
      >
        CineMate 🎬
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search movies..."
            className="px-4 py-2 rounded-lg bg-zinc-800 text-white focus:outline-none w-40 sm:w-56 md:w-60"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button
            type="submit"
            className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold border border-red-600 transition duration-300 hover:bg-white hover:text-red-600"
          >
            Search
          </button>
        </form>

        {/* Favorites Button */}
        <button
          type="button"
          onClick={() => navigate("/favorites")}
          className="group flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg font-semibold border border-red-600 transition duration-300 hover:bg-white hover:text-red-600"
        >
          <span className="text-white group-hover:text-red-600 transition duration-300">
            ♥
          </span>
          Favorites
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
