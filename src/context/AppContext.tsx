import React, { createContext, ReactNode, useCallback, useState } from "react";
import encodeURI from "../lib/encodeURI";
import { Book } from "../types/api.types";
import { AppContextValue, BookState } from "../types/appContext.types";

export const AppContext = createContext<AppContextValue | undefined>(undefined);

// Create a provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [bookState, setBookState] = useState<BookState>({
    count: 0,
    books: [],
    next: null,
    previous: null,
  });
  const [cache, setCache] = useState<Record<string, BookState>>({});

  const fetchBooks = useCallback(
    async (
      page: number,
      searchTerm: string,
      genre: string,
      signal: AbortSignal
    ) => {
      searchTerm = encodeURI(searchTerm);
      genre = encodeURI(genre);

      const cacheKey = `${page}-${searchTerm}-${genre}`;

      if (cache[cacheKey]) {
        setBookState(cache[cacheKey]);
        return;
      }

      try {
        const response = await fetch(
          `https://gutendex.com/books?page=${page}&search=${searchTerm}&topic=${genre}`,
          {
            signal,
          }
        );

        const data = await response.json();
        if (response.status === 200) {
          const newBookState = {
            count: data.count,
            next: data.next,
            previous: data.previous,
            books: data.results,
          };

          setBookState(newBookState);

          setCache((prev) => ({
            ...prev,
            [cacheKey]: newBookState,
          }));
        } else {
          return "Something went wrong";
        }
      } catch (error: any) {
        if ("detail" in error) {
          return error.detail;
        }
      }
    },
    [cache]
  );

  const updateBooks = (books: Book[]) => {
    setBookState((prev) => ({
      ...prev,
      books,
    }));
  };

  const value: AppContextValue = {
    ...bookState,
    cache,
    setBookState,
    fetchBooks,
    updateBooks,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
