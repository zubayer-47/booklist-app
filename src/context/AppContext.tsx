import React, { createContext, ReactNode, useEffect, useState } from "react";
import useQueryParams from "../hooks/useQueryParams";
import decodeURI from "../lib/decodeURI";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [queryParams] = useQueryParams();

  const pageNumber = parseInt(queryParams.get("page") || "1", 10);
  const page = pageNumber > 0 ? pageNumber : 1;
  const search = queryParams.get("search");
  const topic = queryParams.get("topic");

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchBooks = async () => {
      const encodedSearch = search?.replace(/%3A|\+|\s|&/g, function (match) {
        if (match === "%3A") return ":";
        if (match === "&") return "%26";
        return "%20"; // Replace both + and whitespace with %20
      });
      const encodedTopic = topic?.replace(/%3A|\+|\s|&/g, function (match) {
        if (match === "%3A") return ":";
        if (match === "&") return "%26";
        return "%20"; // Replace both + and whitespace with %20
      });

      try {
        setLoading(true);
        const response = await fetch(
          `https://gutendex.com/books?page=${page ?? 1}&search=${
            encodedSearch ?? ""
          }&topic=${encodedTopic ?? ""}`,
          {
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (response.status === 200) {
          setBookState({
            count: data.count,
            next: data.next,
            previous: data.previous,
            books: data.results,
          });

          localStorage.setItem("persist_page", JSON.stringify(page));
          localStorage.setItem("persist_genre", decodeURI(topic || "null"));
          localStorage.setItem("persist_search", decodeURI(search || "null"));
        } else {
          console.log({ response }, "try block but error");
        }
      } catch (error: any) {
        console.log("error block", error);
        if ("detail" in error) {
          setError(error.detail);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBooks();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [search, topic, page]);

  const updateBooks = (books: Book[]) => {
    setBookState((prev) => ({
      ...prev,
      books,
    }));
  };

  const value: AppContextValue = {
    ...bookState,
    loading,
    error,
    updateBooks,
    setBookState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
