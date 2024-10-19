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

      if (searchQuery) {
        setQueryParams((prev) => ({
          ...Object.fromEntries(prev),
          search: searchQuery,
        }));
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, setQueryParams]);

  return debouncedValue;
}
