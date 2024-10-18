import { useMemo } from "react";

import { useState } from "react";
import BookList from "../../components/BookList";
import Pagination from "../../components/Pagination";
import { Book } from "../../types/api.types";

export default function WishList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlistedBooks, setWishlistedBooks] = useState<Book[]>([]);

  const booksPerPage = 6;

  // get unique genres from books to filter by genres/topic
  const uniqueGenres = useMemo(() => {
    const uniqueGenres = new Set(
      wishlistedBooks.flatMap((book: Book) => book.bookshelves)
    );

    return [...uniqueGenres];
  }, [wishlistedBooks]);

  const indexOfLastBook = currentPage * booksPerPage;
  const currentBooks = useMemo(() => {
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const wishlistedLocalStorageBooks: Book[] = JSON.parse(
      localStorage.getItem("wishlistedBooks") || "[]"
    );

    setWishlistedBooks(wishlistedLocalStorageBooks);

    return wishlistedLocalStorageBooks.slice(indexOfFirstBook, indexOfLastBook);
  }, [indexOfLastBook]);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="mx-2 lg:mx-40">
      <form className="flex justify-center items-center gap-2 my-2">
        <input
          type="search"
          name="search"
          placeholder="Search books..."
          className="p-2 rounded-md border border-slate-200 focus:outline-none focus:ring ring-indigo-300 w-full"
        />

        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-500 transition-colors text-slate-50 py-2 px-4 text-sm rounded"
        >
          Search
        </button>
      </form>

      <select
        name=""
        id=""
        className="p-2 focus:outline-none rounded-md bg-slate-200 w-full mb-5"
      >
        <option defaultChecked value="genre">
          Genre/Topic
        </option>
        {uniqueGenres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>

      <BookList currentBooks={currentBooks} />

      {wishlistedBooks.length ? (
        <Pagination
          booksPerPage={booksPerPage}
          currentPage={currentPage}
          indexOfLastBook={indexOfLastBook}
          lengthOfBooks={wishlistedBooks.length}
          paginate={paginate}
        />
      ) : null}
    </div>
  );
}
