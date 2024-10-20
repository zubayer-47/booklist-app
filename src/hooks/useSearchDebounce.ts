/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import useQueryParams from "./useQueryParams";

export default function useSearchDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [_queryParams, setQueryParams] = useQueryParams();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);

      if (value) {
        localStorage.setItem("persist_search", value);
      }

      const searchQuery = value.replace(/ /g, "%20");

      // if (searchQuery) {
      setQueryParams((prev) => {
        const prevSearchQuery = prev.get("search");

        const notSameFromPrev = prevSearchQuery !== searchQuery;

        return {
          ...Object.fromEntries(prev),
          search:
            prevSearchQuery !== searchQuery ? searchQuery : prevSearchQuery,
          page: notSameFromPrev ? "1" : prev.get("page") || "1",
        };
      });
      // }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, setQueryParams]);

  return debouncedValue;
}
