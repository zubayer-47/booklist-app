import React, { createContext, ReactNode, useEffect, useState } from "react";
import { Book } from "../types/api.types";
import { AppContextValue } from "../types/appContext.types";

// const initialState: InitialStateType = {
//   books: [],
//   error: null,
// };

// function appReducer(state: InitialStateType, action: AppAction) {
//   switch (action.type) {
//     case "SET_BOOKS":
//       return { ...state, books: action.payload };
//     case "UPDATE_BOOKS":
//       return {
//         ...state,
//         books: action.payload,
//       };
//     default:
//       return state;
//   }
// }

type BookState = {
  books: Book[];
  loading: boolean;
  error: string | null;
};

export const AppContext = createContext<AppContextValue | undefined>(undefined);

// Create a provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [bookState, setBookState] = useState<BookState>({
    books: [],
    loading: true,
    error: null,
  });
  //   const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const controller = new AbortController();

    const fetchBooks = async () => {
      try {
        const response = await fetch("https://gutendex.com/books", {
          signal: controller.signal,
        });
        const data = await response.json();

        setBookState((prev) => ({
          ...prev,
          loading: false,
          books: data.results,
        }));
      } catch (error: any) {
        if ("detail" in error) {
          setBookState((prev) => ({
            ...prev,
            loading: false,
            error: error.detail,
          }));
        }

        console.error("Error fetching books data:", error);
      }
    };

    fetchBooks();

    return () => {
      controller.abort();
    };
  }, []);

  const updateBooks = (books: Book[]) => {
    setBookState((prev) => ({
      ...prev,
      books,
    }));
  };

  const value: AppContextValue = {
    ...bookState,
    updateBooks,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
