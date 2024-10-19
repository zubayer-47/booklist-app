import { Dispatch } from "react";
import { Book } from "./api.types";

// interface AppContextState {
//   books: Book[];
//   error: string | null;
// }

export type BookState = {
  count: number;
  books: Book[];
  next: string | null;
  previous: string | null;
};

export type AppContextValue = {
  count: number;
  books: Book[];
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: string | null;
  updateBooks: (books: Book[]) => void;
  setBookState: Dispatch<React.SetStateAction<BookState>>;
};

// export type InitialStateType = { books: Book[]; error: string | null };

// export type AppAction =
//   | { type: "SET_BOOKS"; payload: Book[] }
//   | { type: "UPDATE_BOOKS"; payload: Book[] }
//   | { type: "FETCH_ERROR"; payload: string | null };
