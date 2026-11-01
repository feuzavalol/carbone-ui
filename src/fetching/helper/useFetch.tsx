import { useCallback, useEffect, useRef, useState } from "react";
import { API_URL } from "../../constants/url";
import { useApi } from "./useApi";

function useFetch<T>(path: string | null, initialData: T, select?: (json: any) => T) {
  const apiFetch = useApi();
  const selectRef = useRef(select);
  selectRef.current = select;
  const initialRef = useRef(initialData);   // keeps `[]` from retriggering effects
  const requestId = useRef(0);

  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(path !== null);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    const id = ++requestId.current;

    // Early return: nothing to fetch, reset to a clean state
    if (path === null) {
      setData(initialRef.current);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiFetch(`${API_URL}${path}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      if (id !== requestId.current) return;      // a newer request replaced this one
      setData(selectRef.current ? selectRef.current(json) : json);
    } catch (err) {
      if (id !== requestId.current) return;
      console.error(`Error fetching ${path}:`, err);
      setError(err as Error);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [apiFetch, path]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

export { useFetch }