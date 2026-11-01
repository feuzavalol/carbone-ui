import { useCallback, useState } from "react";
import { API_URL } from "../../constants/url";
import { useApi } from "./useApi";

function useMutation<TBody, TResult>(path: string, method: "POST" | "PUT" | "DELETE" = "POST") {
  const apiFetch = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (body?: TBody): Promise<TResult> => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiFetch(`${API_URL}${path}`, {
          method,
          body: body === undefined ? undefined : JSON.stringify(body),
        });
          if (!res.ok) {
            const body = await res.json().catch(() => null);
            throw new Error(body?.message ?? `HTTP ${res.status}`);
          }
        return await res.json();
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFetch, path, method]
  );

  return { mutate, loading, error };
}

export { useMutation }