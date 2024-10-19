type Props = {
  currentPage: number;
  numberOfPages: number;
  loading: boolean;
  next: boolean;
  previous: boolean;
  handleNext: () => void;
  handlePrev: () => void;
};

export default function Pagination({
  currentPage,
  numberOfPages,
  loading,
  next,
  previous,
  handleNext,
  handlePrev,
}: Props) {
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
