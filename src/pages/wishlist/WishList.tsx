import { ChangeEvent, useEffect, useMemo } from "react";

import { useState } from "react";
import BookList from "../../components/BookList";
import Pagination from "../../components/Pagination";
import { Book } from "../../types/api.types";

export default function WishList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlistedBooks, setWishlistedBooks] = useState<Book[]>(() => {
    const storedBooks = localStorage.getItem("wishlistedBooks");
    return storedBooks ? JSON.parse(storedBooks) : [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const booksPerPage = 6;

  useEffect(() => {
    const handleStorageChange = () => {
      const wishlisted: Book[] = JSON.parse(
        localStorage.getItem("wishlistedBooks") || "[]"
      );

      setWishlistedBooks(wishlisted);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // get unique genres from books to filter by genres/topic
  const uniqueGenres = useMemo(() => {
    const uniqueGenres = new Set(
      wishlistedBooks.flatMap((book: Book) => book.bookshelves)
    );

    return [...uniqueGenres];
  }, [wishlistedBooks]);

  const indexOfLastBook = currentPage * booksPerPage;
  const { currentBooks, filteredBooksLength, numberOfPages } = useMemo(() => {
    const indexOfFirstBook = indexOfLastBook - booksPerPage;

    let books = wishlistedBooks;

    if (selectedGenre !== "all") {
      books = books.filter((book) => book.bookshelves.includes(selectedGenre));
    }

    if (searchTerm) {
      books = books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return {
      currentBooks: books.slice(indexOfFirstBook, indexOfLastBook),
      filteredBooksLength: books.length,
      numberOfPages: Math.ceil(books.length / booksPerPage),
    };
  }, [indexOfLastBook, wishlistedBooks, selectedGenre, searchTerm]);

  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchTerm(value);
  };

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setSelectedGenre(value);
  };

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="mx-2 lg:mx-40">
      <form className="flex justify-center items-center gap-2 my-2">
        <input
          type="search"
          name="search"
          placeholder="Search books..."
          value={searchTerm}
          onChange={handleSearchTermChange}
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
        className="p-2 focus:outline-none rounded-md bg-slate-200 w-full mb-5"
        onChange={handleSelect}
      >
        <option defaultChecked value="all">
          Genre/Topic - All
        </option>
        {uniqueGenres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>

      <BookList currentBooks={currentBooks} books={wishlistedBooks} />

      {wishlistedBooks.length ? (
        <Pagination
          currentPage={currentPage}
          numberOfPages={numberOfPages}
          loading={false}
          next={indexOfLastBook < filteredBooksLength}
          previous={currentPage > 1}
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
      ) : null}
    </div>
  );
}
