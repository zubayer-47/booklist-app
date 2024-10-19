import { ChangeEvent, useCallback, useMemo, useState } from "react";
import BookList from "../../components/BookList";
import EllipsisIndicator from "../../components/EllipsisIndicator";
import Error from "../../components/Error";
import Pagination from "../../components/Pagination";
import useAppContext from "../../hooks/useAppContext";
import useSearchDebounce from "../../hooks/useSearchDebounce";
import { Book } from "../../types/api.types";

import useQueryParams from "../../hooks/useQueryParams";
export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  useSearchDebounce(searchTerm, 300);
  const { books, loading, error } = useAppContext();
  const booksPerPage = 32;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_queryParams, setQueryParams] = useQueryParams();

  // get unique genres from books to filter by genres/topic
  const uniqueGenres = useMemo(() => {
    const uniqueGenres = new Set(
      books.flatMap((book: Book) => book.bookshelves)
    );

    return [...uniqueGenres];
  }, [books]);

  const currentBooks = useMemo(() => {
    const wishlistedBooks: Book[] = JSON.parse(
      localStorage.getItem("wishlistedBooks") || "[]"
    );

    const perPageBooksWithWishlisted = books.map((book) => {
      const isWishlisted = wishlistedBooks.some(
        (wishListedbook) => wishListedbook.id === book.id
      );

      return { ...book, wishlisted: isWishlisted };
    });

    return perPageBooksWithWishlisted;
  }, [books]);

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    // const topicQuery = value.replace(/ /g, "%20");

    // console.log(topicQuery);
    setQueryParams((prev) => ({
      ...Object.fromEntries(prev),
      topic: value,
    }));
  };

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
      return <option value="">Loading...</option>;
    }

    return uniqueGenres.map((genre) => (
      <option key={genre} value={genre}>
        {genre}
      </option>
    ));
  }, [loading, uniqueGenres]);

  return (
    <div className="mx-2 lg:mx-40">
      <input
        type="search"
        name="search"
        placeholder="Search books..."
        onChange={handleSearchTermChange}
        value={searchTerm}
        className="p-2 rounded-md border border-slate-200 focus:outline-none focus:ring ring-indigo-300 w-full my-2"
      />

      <select
        name="genre"
        className="p-2 focus:outline-none rounded-md bg-slate-200 w-full mb-5"
        onChange={handleSelect}
      >
        <option defaultChecked value="">
          Genre/Topic
        </option>
        {renderOptions()}
      </select>

      {renderBookList()}

      {books.length ? <Pagination booksPerPage={booksPerPage} /> : null}
    </div>
  );
}
