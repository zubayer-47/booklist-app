import Heart from "../../../assets/Heart";
import { Book } from "../../../types/api.types";

type Props = {
  currentBooks: Book[];
  addWishList(id: number): void;
};

export default function BookList({ currentBooks, addWishList }: Props) {
  return (
    <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-7">
      {currentBooks.map((book) => (
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
            onClick={() => addWishList(book.id)}
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
              book.bookshelves.slice(0, 4).map((subject) => (
                <button
                  key={subject}
                  className="bg-slate-200 group-hover:bg-slate-300 hover:!bg-slate-300/50 transition-colors text-slate-900 py-0.5 px-2 text-sm rounded-full"
                >
                  {subject}
                </button>
              ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
