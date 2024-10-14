import { Book } from "./api.types";

// interface AppContextState {
//   books: Book[];
//   error: string | null;
// }

export type AppContextValue = {
  books: Book[];
  loading: boolean;
  error: string | null;
  updateBooks: (books: Book[]) => void;
};

// export type InitialStateType = { books: Book[]; error: string | null };

// export type AppAction =
//   | { type: "SET_BOOKS"; payload: Book[] }
//   | { type: "UPDATE_BOOKS"; payload: Book[] }
//   | { type: "FETCH_ERROR"; payload: string | null };
