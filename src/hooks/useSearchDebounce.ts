import { useEffect, useState } from "react";

export default function useSearchDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);

      let persist_searchTerm = localStorage.getItem("persist_search");

      if (
        persist_searchTerm &&
        persist_searchTerm != "null" &&
        persist_searchTerm != "undefined"
      ) {
        persist_searchTerm = decodeURI(persist_searchTerm);

        if (value !== persist_searchTerm) {
          localStorage.setItem("persist_page", "1");
          // setCurrentPage(1);
        }
      }

      localStorage.setItem("persist_search", value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
