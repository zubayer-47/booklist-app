import { SetURLSearchParams, useSearchParams } from "react-router-dom";

const useQueryParams = (): [URLSearchParams, SetURLSearchParams] => {
  const [queryParams, setQueryParams] = useSearchParams();

  return [queryParams, setQueryParams];
};

export default useQueryParams;
