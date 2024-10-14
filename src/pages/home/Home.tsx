import { useEffect, useState } from "react";
import { Book } from "../../types/api.types";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("https://gutendex.com/books");
        const data = await response.json();
        setBooks(data.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books data:", error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Book List</h1>

      <form className="flex justify-center items-center gap-2 my-3 mx-2 lg:mx-40">
        <input
          type="search"
          name="search"
          placeholder="Search books..."
          className="p-2 rounded-md border border-slate-200 focus:outline-none focus:ring ring-indigo-300 w-full"
        />

        <select
          name=""
          id=""
          className="p-2 focus:outline-none rounded-md bg-slate-200"
        >
          <option defaultChecked>Genre</option>
          <option value="">Title</option>
        </select>

        <button className="bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-500 transition-colors text-slate-50 py-2 px-4 text-sm rounded">
          Search
        </button>
      </form>

      <ul className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-7 mx-2 lg:mx-40">
        {currentBooks.map((book) => (
          <li
            key={book.id}
            className="bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors rounded-lg p-3 flex flex-col justify-end relative"
          >
            <h4 className="absolute left-2 top-2 bg-indigo-200 text-xs rounded-lg px-2 py-1">
              #{book.id}
            </h4>
            <div className="flex flex-col items-center gap-3">
              <img
                src={book.formats["image/jpeg"]}
                alt={book.title}
                width={150}
                className="w-28"
              />
              <div className="text-center relative">
                {/* <Tooltip content={book.title}> */}
                <h3 className="text-xl font-bold text-slate-900 w-72 truncate">
                  {book.title}
                </h3>
                {/* </Tooltip> */}
                <p className="text-slate-500">{book.authors[0]?.name}</p>
              </div>
            </div>

            <div className="flex justify-center items-center flex-wrap gap-1 mt-5">
              <h3 className="text-slate-500">Genres:</h3>
              {book.bookshelves.length &&
                book.bookshelves
                  .slice(0, 4)
                  .map((subject) => (
                    <button className="bg-indigo-200 hover:bg-indigo-200/70 transition-colors text-slate-900 py-0.5 px-2 text-sm rounded-full">
                      {subject}
                    </button>
                  ))}
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center my-5">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-500 transition-colors text-slate-50 py-2 px-4 text-sm rounded"
        >
          Previous
        </button>
        <p className="">
          Page {currentPage} of {Math.ceil(books.length / booksPerPage)}
        </p>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastBook >= books.length}
          className="bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-500 transition-colors text-slate-50 py-2 px-4 text-sm rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
