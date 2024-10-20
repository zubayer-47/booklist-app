// import { Dispatch } from "react";
import { Book } from "./api.types";

// interface AppContextState {
//   books: Book[];
//   error: string | null;
// }

export interface BookState {
  count: number;
  books: Book[];
  next: string | null;
  previous: string | null;
}

export interface AppContextValue extends BookState {
  cache: Record<string, BookState>;
  setBookState: React.Dispatch<React.SetStateAction<BookState>>;
  fetchBooks: (
    page: number,
    searchTerm: string,
    genre: string,
    signal: AbortSignal
  ) => Promise<string | null>;
  updateBooks: (books: Book[]) => void;
}

// export type InitialStateType = { books: Book[]; error: string | null };

// export type AppAction =
//   | { type: "SET_BOOKS"; payload: Book[] }
//   | { type: "UPDATE_BOOKS"; payload: Book[] }
//   | { type: "FETCH_ERROR"; payload: string | null };
