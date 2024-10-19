import { useState } from "react";
import useAppContext from "../hooks/useAppContext";
import useQueryParams from "../hooks/useQueryParams";

type Props = {
  booksPerPage: number;
};

export default function Pagination({ booksPerPage }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const { count, next, previous, loading } = useAppContext();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_queryParams, setQueryParams] = useQueryParams();

  const numberOfPages = Math.ceil(count / booksPerPage);

  const handleNext = () => {
    setQueryParams();

    setQueryParams((prev) => ({
      ...Object.fromEntries(prev),
      page: (currentPage + 1).toString(),
    }));

    setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    setQueryParams((prev) => ({
      ...Object.fromEntries(prev),
      page: (currentPage > 1 ? currentPage - 1 : 1).toString(),
    }));

    setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="flex justify-between items-center my-5">
      <button
        // onClick={() => paginate(currentPage - 1)}
        onClick={handlePrev}
        disabled={loading || !previous}
        className="bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-500 transition-colors text-slate-50 py-2 px-4 text-sm rounded"
      >
        Previous
      </button>
      <p className="">
        Page {currentPage} of {numberOfPages}
      </p>
      <button
        onClick={handleNext}
        disabled={loading || !next}
        className="bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-500 transition-colors text-slate-50 py-2 px-4 text-sm rounded"
      >
        Next
      </button>
    </div>
  );
}
