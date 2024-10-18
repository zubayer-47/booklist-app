import { Dispatch } from "react";
import { Book } from "./api.types";

// interface AppContextState {
//   books: Book[];
//   error: string | null;
// }

export type BookState = {
  books: Book[];
  next: string | null;
  previous: string | null;
  url: string | null;
};

export type AppContextValue = {
  books: Book[];
  next: string | null;
  previous: string | null;
  url: string | null;
  reqOnNewUrl: (url: string) => void;
  updateBooks: (books: Book[]) => void;
  setBookState: Dispatch<React.SetStateAction<BookState>>;
};

// export type InitialStateType = { books: Book[]; error: string | null };

// export type AppAction =
//   | { type: "SET_BOOKS"; payload: Book[] }
//   | { type: "UPDATE_BOOKS"; payload: Book[] }
//   | { type: "FETCH_ERROR"; payload: string | null };
