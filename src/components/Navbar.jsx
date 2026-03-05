import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ onSearch }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);

    const section = document.getElementById("movies-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed w-full bg-black/80 backdrop-blur-md text-white px-4 md:px-10 py-2 flex flex-col md:flex-row justify-between items-center gap-3 z-50">
      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-bold text-red-500 cursor-pointer"
      >
        CineMate 🎬
      </h1>

      {/* Right Section */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex w-full sm:w-auto items-center gap-3"
        >
          <input
            type="text"
            placeholder="Search movies..."
            className="px-4 py-2 rounded-lg bg-zinc-800 text-white focus:outline-none w-full sm:w-56 md:w-60"
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
          className="group flex items-center justify-center gap-2 w-full sm:w-auto bg-red-600 text-white px-5 py-2 rounded-lg font-semibold border border-red-600 transition duration-300 hover:bg-white hover:text-red-600"
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
