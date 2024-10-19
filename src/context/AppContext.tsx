import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import useQueryParams from "../hooks/useQueryParams";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchNewDataFlag, setFetchNewDataFlag] = useState(true);
  const [queryParams] = useQueryParams();

  const pageNumber = parseInt(queryParams.get("page") || "1", 10);
  const page = pageNumber > 0 ? pageNumber : 1;
  const search = queryParams.get("search");
  const topic = queryParams.get("topic");

  const fetchBooks = useCallback(
    async (
      signal: AbortSignal,
      isMounted: boolean,
      page: number,
      encodedSearch?: string,
      encodedTopic?: string
    ) => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://gutendex.com/books?page=${page ?? 1}&search=${
            encodedSearch ?? ""
          }&topic=${encodedTopic ?? ""}`,
          {
            signal,
          }
        );
        const data = await response.json();
        setBookState({
          count: data.count,
          next: data.next,
          previous: data.previous,
          books: data.results,
        });

        localStorage.setItem("persist_count", JSON.stringify(data.count));
        localStorage.setItem("persist_next", JSON.stringify(data.next));
        localStorage.setItem("persist_previous", JSON.stringify(data.previous));
        localStorage.setItem("persist_books", JSON.stringify(data.results));

        setFetchNewDataFlag(true);
      } catch (error: any) {
        if ("detail" in error) {
          setError(error.detail);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    setFetchNewDataFlag(false);

    const controller = new AbortController();
    let isMounted = true;

    const count = parseInt(localStorage.getItem("persist_count") || "0", 10);
    const next = localStorage.getItem("persist_next");
    const previous = localStorage.getItem("persist_previous");
    const books = JSON.parse(localStorage.getItem("persist_books") || "[]");
    const search = localStorage.getItem("persist_search") || "";
    const topic = localStorage.getItem("persist_genre") || "";
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

    if (!next && !previous && !books.length && !count) {
      console.log("rendering else");
      fetchBooks(controller.signal, isMounted, 1, encodedSearch, encodedTopic);
    } else {
      console.log("rendering");
      setBookState({
        count,
        next: next == "null" ? null : next,
        previous: previous == "null" ? null : previous,
        books,
      });
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    console.log({ fetchNewDataFlag });

    if ((!fetchNewDataFlag && page) || search || topic) {
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

      fetchBooks(
        controller.signal,
        isMounted,
        page,
        encodedSearch,
        encodedTopic
      );
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [page, search, topic, fetchNewDataFlag, fetchBooks]);

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
