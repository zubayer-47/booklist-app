import React, { createContext, ReactNode, useEffect, useState } from "react";
import { Book } from "../types/api.types";
import { AppContextValue, BookState } from "../types/appContext.types";

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
    setBooks: setBookState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
