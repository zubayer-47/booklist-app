import { useParams } from "react-router-dom";
import EllipsisIndicator from "../../components/EllipsisIndicator";
import Error from "../../components/Error";
import useAppContext from "../../hooks/useAppContext";

export default function BookOverview() {
  const { books, loading, error } = useAppContext();
  const { id } = useParams();

  const book = books.find((book) => book.id === parseInt(id!, 10));

  return (
    <div className="mx-2 lg:mx-40 flex flex-col justify-center items-center gap-3 my-10">
      {!book && loading ? (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-indigo-500">
            Books loading. Please wait...
          </h1>
          <EllipsisIndicator />
        </div>
      ) : !book ? (
        <Error error={error ?? "Book not found"} />
      ) : (
        <>
          <h1 className="text-2xl font-bold text-indigo-500">{book?.title}</h1>
          <img
            src={book.formats["image/jpeg"]}
            alt={book.title}
            className="w-1/3"
          />

          <div className="text-center relative">
            <p className="text-muted">
              {book.authors.length
                ? book.authors[0]?.name +
                  " (" +
                  book.authors[0].birth_year +
                  "-" +
                  book.authors[0]?.death_year +
                  ")"
                : "Unknown"}
            </p>
          </div>

          <div className="flex justify-center items-center flex-wrap gap-1">
            <h3 className="text-muted">Languages:</h3>
            {book.languages.length
              ? book.languages.map((subject) => (
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
            {book.bookshelves.length
              ? book.bookshelves.map((subject) => (
                  <button
                    key={subject}
                    className="bg-slate-200 hover:bg-slate-300 transition-colors text-slate-900 py-0.5 px-2 text-sm rounded-full"
                  >
                    {subject}
                  </button>
                ))
              : null}
          </div>

          {book.translators.length ? (
            <div className="flex flex-col justify-center items-center gap-2 mt-5">
              <h1 className="text-muted text-lg font-bold">Translators: </h1>
              {book.translators.map((tr) => (
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
