import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import BookList from "../../components/BookList";
import EllipsisIndicator from "../../components/EllipsisIndicator";
import Error from "../../components/Error";
import Pagination from "../../components/Pagination";
import useAppContext from "../../hooks/useAppContext";
import useDebounce from "../../hooks/useDebounce";
import { Book } from "../../types/api.types";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const debouncedValue = useDebounce(searchTerm, 300);
  const { books, error, loading, setBooks } = useAppContext();

  const booksPerPage = 6;

  useEffect(() => {
    const controller = new AbortController();

    const fetchBooks = async () => {
      setLocalLoading(true);
      try {
        const response = await fetch(
          `https://gutendex.com/books?search=${debouncedValue}`,
          {
            signal: controller.signal,
          }
        );
        const data = await response.json();

        setBooks((prev) => ({
          ...prev,
          loading: false,
          books: data.results,
        }));

        setLocalLoading(false);
      } catch (error: any) {
        if ("detail" in error) {
          setBooks((prev) => ({
            ...prev,
            error: error.detail,
          }));
        }

        setLocalLoading(false);
        console.error("Error fetching books data:", error);
      }
    };

    if (debouncedValue) {
      fetchBooks();
    } else {
      setBooks((prev) => prev);
    }

    return () => {
      controller.abort();
    };
  }, [debouncedValue, setBooks]);

  // get unique genres from books to filter by genres/topic
  const uniqueGenres = useMemo(() => {
    const uniqueGenres = new Set(
      books.flatMap((book: Book) => book.bookshelves)
    );

    return [...uniqueGenres];
  }, [books]);

  const indexOfLastBook = currentPage * booksPerPage;
  const currentBooks = useMemo(() => {
    const indexOfFirstBook = indexOfLastBook - booksPerPage;

    const perPageBooks = books.slice(indexOfFirstBook, indexOfLastBook);

    const wishlistedBooks: Book[] = JSON.parse(
      localStorage.getItem("wishlistedBooks") || "[]"
    );

    const perPageBooksWithWishlisted = perPageBooks.map((book) => {
      const isWishlisted = wishlistedBooks.some(
        (wishListedbook) => wishListedbook.id === book.id
      );

      return { ...book, wishlisted: isWishlisted };
    });

    return perPageBooksWithWishlisted;
  }, [books, indexOfLastBook]);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const filteredBooks = useMemo(() => {
    if (!debouncedValue) {
      return books;
    }

    const booksBySearchTerm = books.filter((book) => {
      console.log(book.title.toLowerCase().indexOf(debouncedValue));
      return book.title.toLowerCase().indexOf(debouncedValue) !== -1;
    });

    console.log(booksBySearchTerm, debouncedValue);

    return booksBySearchTerm;
  }, [books, debouncedValue]);

  // const SearchTermUpdate = (searchTerm: string) => {
  //   debouncedSearchTerm(searchTerm);
  // };

  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchTerm(value);
  };

  const renderBookList = useCallback(() => {
    if (error) {
      return <Error error={error} />;
    }

    if (localLoading || loading) {
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
  }, [error, loading, currentBooks, localLoading]);

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
          lengthOfBooks={books.length}
          paginate={paginate}
        />
      ) : null}
    </div>
  );
}
