import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import BookList from "../../components/BookList";
import EllipsisIndicator from "../../components/EllipsisIndicator";
import Error from "../../components/Error";
import Pagination from "../../components/Pagination";
import useAppContext from "../../hooks/useAppContext";
import useSearchDebounce from "../../hooks/useSearchDebounce";
import decodeURI from "../../lib/decodeURI";
import { Book } from "../../types/api.types";

export default function Home() {
  const { books, next, previous, count, setBookState, fetchBooks } =
    useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedValue = useSearchDebounce(searchTerm, 300);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const booksPerPage = 32;
  const numberOfPages = Math.ceil(count / booksPerPage);

  useEffect(() => {
    const page = parseInt(localStorage.getItem("persist_page") || "1", 10);
    let search = localStorage.getItem("persist_search") || "";
    let topic = localStorage.getItem("persist_genre") || "";

    search = search == "null" || search === "undefined" ? "" : search;
    topic = topic == "null" || topic === "undefined" ? "" : topic;

    setCurrentPage(page);
    setSearchTerm(search);
    setSelectedGenre(topic);
  }, [debouncedValue]);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    (async () => {
      try {
        setLoading(true);
        const ErrResponse = await fetchBooks(
          currentPage,
          debouncedValue,
          selectedGenre,
          controller.signal
        );
        if (ErrResponse) {
          setError(ErrResponse);
        }
      } catch (error: any) {
        setError(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      controller.abort();
      isMounted = false;
    };
  }, [currentPage, debouncedValue, selectedGenre, fetchBooks, setBookState]);

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

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);

    localStorage.setItem("persist_page", (currentPage + 1).toString());
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));
    localStorage.setItem("persist_page", (currentPage - 1).toString());
  };

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    let persist_genre = localStorage.getItem("persist_genre");

    persist_genre = decodeURI(persist_genre || "");

    if (value !== persist_genre) {
      localStorage.setItem("persist_page", "1");
      setCurrentPage(1);
    }

    setSelectedGenre(value);

    localStorage.setItem("persist_genre", value);
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

    return <BookList currentBooks={currentBooks} books={books} />;
  }, [error, loading, currentBooks, books]);

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
        value={selectedGenre}
      >
        <option defaultChecked value="">
          Genre/Topic - all
        </option>
        {renderOptions()}
      </select>

      {renderBookList()}

      {books.length ? (
        <Pagination
          currentPage={currentPage}
          numberOfPages={numberOfPages}
          loading={loading}
          next={!!next}
          previous={!!previous}
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
      ) : null}
    </div>
  );
}
