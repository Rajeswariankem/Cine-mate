import { useRef } from "react";
import MovieCard from "./MovieCard";

function MovieRow({ title, movies, onSelect }) {
  const rowRef = useRef(null);

  const scrollAmount = 220;

  const scrollLeft = () => {
    rowRef.current?.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    rowRef.current?.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 mb-12">
      <h2 className="text-2xl text-white font-bold mb-4">{title}</h2>

      {/* ROW WRAPPER */}
      <div className="relative">
        {/* LEFT BUTTON */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2
                   z-30 w-10 h-10 flex items-center justify-center
                   bg-black/70 text-white rounded-full
                   hover:bg-red-600 transition-all shadow-xl"
        >
          <span className="text-3xl leading-none mb-1.5 ">‹</span>
        </button>

        {/* MOVIE ROW */}
        <div
          ref={rowRef}
          className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory"
        >
          {movies.map((movie) => (
            <div
              className="min-w-[130px] sm:min-w-[160px] md:min-w-[200px]"
              key={movie.id}
            >
              <MovieCard movie={movie} onSelect={onSelect} />
            </div>
          ))}
        </div>

        {/* RIGHT BUTTON */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2
                   z-30 w-10 h-10 flex items-center justify-center
                   bg-black/70 text-white rounded-full
                   hover:bg-red-600 transition-all shadow-xl"
        >
          <span className="text-3xl leading-none mb-1.5">›</span>
        </button>
      </div>
    </div>
  );
}

export default MovieRow;
