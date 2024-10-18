import { useEffect, useMemo, useState } from "react";
import { Book } from "../types/api.types";
import useAppContext from "./useAppContext";

export default function useFetch(debouncedValue: string, genre: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedBooks, setSearchedBooks] = useState<Book[]>([]);
  const { books, setBooks } = useAppContext();

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
          setSearchedBooks(data.results);
        } else {
          setBooks(data.results);
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
  }, [url, debouncedValue, genre, books, setSearchedBooks, setBooks]);

  const indexOfLastBook = currentPage * booksPerPage;
  const currentBooks = useMemo(() => {
    let bookList = books;

    if (debouncedValue) {
      bookList = searchedBooks;
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
  }, [books, indexOfLastBook, debouncedValue, searchedBooks]);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const reqOnNewUrl = (url: string) => {
    setUrl(url);
  };

  return {
    loading,
    error,
    reqOnNewUrl,
    paginate,
    currentPage,
    currentBooks,
    booksPerPage,
    indexOfLastBook,
    searchedBooks,
  };
}
