import { Dispatch } from "react";
import { Book } from "./api.types";

// interface AppContextState {
//   books: Book[];
//   error: string | null;
// }

export type BookState = {
  books: Book[];
  loading: boolean;
  error: string | null;
};

export type AppContextValue = {
  books: Book[];
  updateBooks: (books: Book[]) => void;
  setBooks: Dispatch<React.SetStateAction<Book[]>>;
};

// export type InitialStateType = { books: Book[]; error: string | null };

// export type AppAction =
//   | { type: "SET_BOOKS"; payload: Book[] }
//   | { type: "UPDATE_BOOKS"; payload: Book[] }
//   | { type: "FETCH_ERROR"; payload: string | null };
