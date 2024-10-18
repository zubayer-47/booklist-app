import { ChangeEvent, useCallback, useMemo, useState } from "react";
import BookList from "../../components/BookList";
import EllipsisIndicator from "../../components/EllipsisIndicator";
import Error from "../../components/Error";
import Pagination from "../../components/Pagination";
import useAppContext from "../../hooks/useAppContext";
import useDebounce from "../../hooks/useDebounce";
import useFetch from "../../hooks/useFetch";
import { Book } from "../../types/api.types";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedValue = useDebounce(searchTerm, 300);
  const { books } = useAppContext();
  const {
    currentBooks,
    error,
    loading,
    paginate,
    booksPerPage,
    indexOfLastBook,
    searchedBooks,
    next,
    currentPage,
  } = useFetch(debouncedValue || "", "");

  // get unique genres from books to filter by genres/topic
  const uniqueGenres = useMemo(() => {
    const uniqueGenres = new Set(
      books.flatMap((book: Book) => book.bookshelves)
    );

    return [...uniqueGenres];
  }, [books]);

  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchTerm(value);
  };

  const renderBookList = useCallback(() => {
    if (error) {
      return <Error error={error} />;
    }

    if (loading) {
      return (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-indigo-500">
            Books loading. Please wait...
          </h1>
          <EllipsisIndicator />
        </div>
      );
    }

    return <BookList currentBooks={currentBooks} />;
  }, [error, loading, currentBooks]);

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
    <div className="mx-2 lg:mx-40">
      {/* <form
        className="flex justify-center items-center gap-2 my-2"
      > */}
      <input
        type="search"
        name="search"
        placeholder="Search books..."
        onChange={handleSearchTermChange}
        value={searchTerm}
        className="p-2 rounded-md border border-slate-200 focus:outline-none focus:ring ring-indigo-300 w-full my-2"
      />

      {/* <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-500 transition-colors text-slate-50 py-2 px-4 text-sm rounded"
        >
          Search
        </button> */}
      {/* </form> */}

      <select
        name=""
        id=""
        className="p-2 focus:outline-none rounded-md bg-slate-200 w-full mb-5"
      >
        <option defaultChecked value="genre">
          Genre/Topic
        </option>
        {renderOptions()}
      </select>

      {renderBookList()}

      {books.length ? (
        <Pagination
          booksPerPage={booksPerPage}
          currentPage={currentPage}
          indexOfLastBook={indexOfLastBook}
          lengthOfBooks={debouncedValue ? searchedBooks.length : books.length}
          next={next}
          paginate={paginate}
        />
      ) : null}
    </div>
  );
}
