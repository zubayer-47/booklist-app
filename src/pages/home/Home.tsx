import { useCallback, useEffect, useMemo, useState } from "react";
import EllipsisIndicator from "../../components/EllipsisIndicator";
import { Book } from "../../types/api.types";
import BookList from "./partials/BookList";
import Error from "./partials/Error";
import Pagination from "./partials/Pagination";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;

  useEffect(() => {
    const controller = new AbortController();

    const fetchBooks = async () => {
      try {
        const response = await fetch("https://gutendex.com/books", {
          signal: controller.signal,
        });
        const data = await response.json();
        setBooks(data.results);

        setLoading(false);
      } catch (error: any) {
        if ("detail" in error) {
          setError(error.detail);
        }

        console.error("Error fetching books data:", error);
      }
    };

    fetchBooks();

    return () => {
      controller.abort();
    };
  }, []);

  const uniqueGenres = useMemo(() => {
    const uniqueGenres = new Set(
      books.flatMap((book: Book) => book.bookshelves)
    );

    return [...uniqueGenres];
  }, [books]);

  const indexOfLastBook = currentPage * booksPerPage;
  const currentBooks = useMemo(() => {
    const indexOfFirstBook = indexOfLastBook - booksPerPage;

    console.log("currentBooks");
    return books.slice(indexOfFirstBook, indexOfLastBook);
  }, [books, indexOfLastBook]);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const addWishList = useCallback(
    (id: number) => {
      const clonedBooks = [...books];
      const book = clonedBooks.find((b) => b.id === id);

      if (book) {
        book.wishlisted = !book.wishlisted;
      }

      setBooks(clonedBooks);
    },
    [books]
  );

  const renderBookList = useCallback(() => {
    if (error) {
      return <Error error={error} />;
    }

    if (loading && !books.length) {
      return (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-indigo-500">
            Server is slow. Please wait...
          </h1>
          <EllipsisIndicator />
        </div>
      );
    }

    return <BookList currentBooks={currentBooks} addWishList={addWishList} />;
  }, [error, loading, currentBooks, books, addWishList]);

  const renderOptions = useCallback(() => {
    if (loading && !uniqueGenres.length) {
      return <option>Loading...</option>;
    }

    return uniqueGenres.map((genre) => (
      <option key={genre} value={genre}>
        {genre}
      </option>
    ));
  }, [loading, uniqueGenres]);

  return (
    <div className="mx-2 lg:mx-40 flex flex-col h-full">
      <h1>Book List</h1>

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
          Genre
        </option>
        {renderOptions()}
      </select>

      {renderBookList()}

      {books.length ? (
        <Pagination
          booksPerPage={booksPerPage}
          currentPage={currentPage}
          indexOfLastBook={indexOfLastBook}
          lengthOfBooks={books.length}
          paginate={paginate}
        />
      ) : null}
    </div>
  );
}
