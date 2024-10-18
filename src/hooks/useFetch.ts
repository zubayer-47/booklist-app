import { useEffect, useMemo, useState } from "react";
import { Book } from "../types/api.types";
import { BookState } from "../types/appContext.types";
import useAppContext from "./useAppContext";

export default function useFetch(debouncedValue: string, genre: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedBookState, setSearchedBookState] = useState<
    Omit<BookState, "url">
  >({
    books: [],
    next: null,
    previous: null,
  });
  const { books, next, setBookState, url } = useAppContext();

  const booksPerPage = 6;

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const urlWithQueryParams = new URL("https://gutendex.com/books");
    urlWithQueryParams.searchParams.set("topic", genre);
    urlWithQueryParams.searchParams.set("search", debouncedValue);

    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch(url ?? urlWithQueryParams.toString(), {
          signal: controller.signal,
        });
        const data = await response.json();

        if (debouncedValue) {
          setSearchedBookState(() => ({
            next: data.next,
            previous: data.previous,
            books: data.results,
          }));
        } else {
          setBookState((prev) => ({
            ...prev,
            next: data.next,
            previous: data.previous,
            books: data.results,
          }));
        }
      } catch (error: any) {
        if ("detail" in error) {
          setError(error.detail);
        }

        // console.error("Error fetching books data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (debouncedValue || genre || !books.length) {
      fetchBooks();
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [url, debouncedValue, genre, books, setSearchedBookState, setBookState]);

  const indexOfLastBook = currentPage * booksPerPage;
  const currentBooks = useMemo(() => {
    let bookList = books;

    if (debouncedValue) {
      bookList = searchedBookState.books;
    }

    const indexOfFirstBook = indexOfLastBook - booksPerPage;

    const perPageBooks = bookList.slice(indexOfFirstBook, indexOfLastBook);

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
  }, [books, indexOfLastBook, debouncedValue, searchedBookState.books]);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return {
    loading,
    error,
    paginate,
    currentPage,
    currentBooks,
    booksPerPage,
    indexOfLastBook,
    searchedBooks: searchedBookState.books,
    next: searchedBookState.next ?? next,
  };
}
