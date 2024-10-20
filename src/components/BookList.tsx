import { useCallback } from "react";
import { Link } from "react-router-dom";
import Heart from "../assets/Heart";
import useAppContext from "../hooks/useAppContext";
import { Book } from "../types/api.types";

type Props = {
  currentBooks: Book[];
  books: Book[];
  // updateBooks: (books: Book[]) => void;
};

export default function BookList({
  currentBooks,
  books,
}: // queryBooks,
// debouncedValue,
Props) {
  const { updateBooks } = useAppContext();

  const handleWishListToggle = useCallback(
    (id: number) => {
      const clonedBooks = [...books];
      const book = clonedBooks.find((b) => b.id === id);

      if (book) {
        book.wishlisted = !book.wishlisted;
      }

      updateBooks(clonedBooks);

      // doing this because if the operation is too large then the globalState will update later
      // in this case, I just want to update the wishlistedBooks into the global state at first then update the localStorage as wishes. So, now I don't have any problem with UI peformance.
      const prevWishlistedBooks: Book[] | any[] = JSON.parse(
        localStorage.getItem("wishlistedBooks") || "[]"
      );

      const wishlistedMap = new Map(prevWishlistedBooks.map((b) => [b.id, b]));

      if (book || wishlistedMap.has(id)) {
        if (wishlistedMap.has(id)) {
          wishlistedMap.delete(id);
        } else {
          wishlistedMap.set(id, { ...book, wishlisted: true });
        }

        localStorage.setItem(
          "wishlistedBooks",
          JSON.stringify([...wishlistedMap.values()])
        );

        dispatchEvent(new Event("storage"));
      }
    },
    [books, updateBooks]
  );

  return (
    <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-7 text-center">
      {currentBooks.length ? (
        currentBooks.map((book) => (
          <li
            key={book.id}
            className="bg-slate-100 hover:bg-slate-200 group border border-slate-200 transition-colors rounded-lg p-3 flex flex-col justify-end relative"
          >
            <h4 className="absolute left-2 top-2 bg-slate-200 text-xs rounded-lg px-2 py-1">
              #{book.id}
            </h4>

            <button
              type="button"
              className="absolute right-2 top-2"
              onClick={() => handleWishListToggle(book.id)}
            >
              <Heart fill={!!book.wishlisted} />
            </button>
            <div className="flex flex-col items-center gap-3">
              <img
                src={book.formats["image/jpeg"]}
                alt={book.title}
                width={150}
                className="w-28"
              />
              <div className="text-center relative">
                <Link
                  to={`/${book.id}`}
                  className="text-xl font-bold text-slate-900 w-72 truncate block"
                  // target="_blank"
                >
                  {book.title}
                </Link>
                <p className="text-slate-500">
                  {book.authors.length ? book.authors[0]?.name : "Unknown"}
                </p>
              </div>
            </div>

            <div className="flex justify-center items-center flex-wrap gap-1 mt-5">
              <h3 className="text-slate-500">Genres:</h3>
              {book.bookshelves.length
                ? book.bookshelves.slice(0, 4).map((subject) => (
                    <button
                      key={subject}
                      className="bg-slate-200 group-hover:bg-slate-300 hover:!bg-slate-300/50 transition-colors text-slate-900 py-0.5 px-2 text-sm rounded-full"
                    >
                      {subject}
                    </button>
                  ))
                : null}

              <h4 className="text-muted text-sm">
                {book.bookshelves.length > 4
                  ? `+${book.bookshelves.length}`
                  : null}
              </h4>
            </div>
          </li>
        ))
      ) : (
        <h1 className="text-sm font-bold text-slate-300 text-center col-span-full">
          No books found
        </h1>
      )}
    </ul>
  );
}
