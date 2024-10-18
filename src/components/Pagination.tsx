import { useMemo } from "react";
import useAppContext from "../hooks/useAppContext";

type Props = {
  currentPage: number;
  indexOfLastBook: number;
  lengthOfBooks: number;
  booksPerPage: number;
  next: string | null;
  paginate(pageNumber: number): void;
};

export default function Pagination({
  currentPage,
  indexOfLastBook,
  lengthOfBooks,
  booksPerPage,
  next,
  paginate,
}: Props) {
  const { reqOnNewUrl } = useAppContext();

  const numberOfPages = Math.ceil(lengthOfBooks / booksPerPage);

  useMemo(() => {
    console.log(numberOfPages - 2 === currentPage);
    if (numberOfPages - 2 === currentPage && next) {
      reqOnNewUrl(next);
    }
  }, [next, reqOnNewUrl, numberOfPages, currentPage]);

  return (
    <div className="flex justify-between items-center my-5">
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-500 transition-colors text-slate-50 py-2 px-4 text-sm rounded"
      >
        Previous
      </button>
      <p className="">
        Page {currentPage} of {numberOfPages}
      </p>
      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={indexOfLastBook >= lengthOfBooks}
        className="bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-500 transition-colors text-slate-50 py-2 px-4 text-sm rounded"
      >
        Next
      </button>
    </div>
  );
}
