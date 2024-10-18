import React, { createContext, ReactNode, useState } from "react";
import { Book } from "../types/api.types";
import { AppContextValue } from "../types/appContext.types";

export const AppContext = createContext<AppContextValue | undefined>(undefined);

// Create a provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [books, setBooks] = useState<Book[]>([]);

  const updateBooks = (books: Book[]) => {
    setBooks(books);
  };

  const value: AppContextValue = {
    books,
    updateBooks,
    setBooks,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
