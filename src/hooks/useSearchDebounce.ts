/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import useQueryParams from "./useQueryParams";

export default function useSearchDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [_queryParams, setQueryParams] = useQueryParams();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);

      const searchQuery = value.replace(/ /g, "%20");

      setQueryParams((prev) => ({
        ...Object.fromEntries(prev),
        search: searchQuery,
      }));
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
