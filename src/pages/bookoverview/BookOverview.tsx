import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EllipsisIndicator from "../../components/EllipsisIndicator";
import Error from "../../components/Error";
import useAppContext from "../../hooks/useAppContext";
import { Book } from "../../types/api.types";

type SingleBookState = {
  book: Book | null;
  loading: boolean;
  error: string | null;
};

export default function BookOverview() {
  const [singleBookState, setSingleBookState] = useState<SingleBookState>({
    book: null,
    loading: true,
    error: null,
  });

  const { loading, error } = useAppContext();
  const { id } = useParams();

  useEffect(() => {
    const controller = new AbortController();

    const fetchBook = async () => {
      try {
        const response = await fetch(`https://gutendex.com/books/${id}`, {
          signal: controller.signal,
        });
        const data = await response.json();

        console.log({ data });

        setSingleBookState((prev) => ({
          ...prev,
          loading: false,
          book: data,
        }));
      } catch (error: any) {
        if ("detail" in error) {
          setSingleBookState((prev) => ({
            ...prev,
            loading: false,
            error: error.detail,
          }));
        }

        setSingleBookState((prev) => ({
          ...prev,
          loading: false,
        }));

        console.error("Error fetching books data:", error);
      }
    };

    fetchBook();

    return () => {
      controller.abort();
    };
  }, [id]);

  return (
    <div className="mx-2 lg:mx-40 flex flex-col justify-center items-center gap-3 my-10">
      {!singleBookState.book && loading ? (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-indigo-500">
            Books loading. Please wait...
          </h1>
          <EllipsisIndicator />
        </div>
      ) : !singleBookState.book ? (
        <Error error={error ?? "Book not found"} />
      ) : (
        <>
          <h1 className="text-2xl font-bold text-indigo-500">
            {singleBookState.book?.title}
          </h1>
          <img
            src={singleBookState.book.formats["image/jpeg"]}
            alt={singleBookState.book.title}
            className="w-1/3"
          />

          <div className="text-center relative">
            <p className="text-muted">
              {singleBookState.book.authors.length
                ? singleBookState.book.authors[0]?.name +
                  " (" +
                  singleBookState.book.authors[0].birth_year +
                  "-" +
                  singleBookState.book.authors[0]?.death_year +
                  ")"
                : "Unknown"}
            </p>
          </div>

          <div className="flex justify-center items-center flex-wrap gap-1">
            <h3 className="text-muted">Languages:</h3>
            {singleBookState.book.languages.length
              ? singleBookState.book.languages.map((subject) => (
                  <button
                    key={subject}
                    className="bg-slate-200 hover:bg-slate-300 transition-colors text-slate-900 py-0.5 px-4 uppercase text-sm rounded-full"
                  >
                    {subject}
                  </button>
                ))
              : null}
          </div>

          <div className="flex justify-center items-center flex-wrap gap-1">
            <h3 className="text-muted">Genres:</h3>
            {singleBookState.book.bookshelves.length
              ? singleBookState.book.bookshelves.map((subject) => (
                  <button
                    key={subject}
                    className="bg-slate-200 hover:bg-slate-300 transition-colors text-slate-900 py-0.5 px-2 text-sm rounded-full"
                  >
                    {subject}
                  </button>
                ))
              : null}
          </div>

          {singleBookState.book.translators.length ? (
            <div className="flex flex-col justify-center items-center gap-2 mt-5">
              <h1 className="text-muted text-lg font-bold">Translators: </h1>
              {singleBookState.book.translators.map((tr) => (
                <p
                  key={tr.name}
                  className="text-muted flex flex-col items-center"
                >
                  <span>{tr.name}</span>
                  <span>
                    {tr.birth_year}-{tr.death_year}
                  </span>
                </p>
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
