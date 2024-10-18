import React, { createContext, ReactNode, useState } from "react";
import { Book } from "../types/api.types";
import { AppContextValue, BookState } from "../types/appContext.types";

export const AppContext = createContext<AppContextValue | undefined>(undefined);

// Create a provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [bookState, setBookState] = useState<BookState>({
    books: [],
    next: null,
    previous: null,
    url: null,
  });
  // const [url, setUrl] = useState<string | null>(null);

  const reqOnNewUrl = (url: string) => {
    setBookState((prev) => ({
      ...prev,
      url,
    }));
  };

  const updateBooks = (books: Book[]) => {
    setBookState((prev) => ({
      ...prev,
      books,
    }));
  };

  const value: AppContextValue = {
    ...bookState,
    reqOnNewUrl,
    updateBooks,
    setBookState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
