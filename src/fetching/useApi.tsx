import { useCallback } from "react";
import { useAuth } from "../auth/AuthContext";

export function useApi() {
  const { token, logout } = useAuth();

  const apiFetch = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      const res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        logout();
        throw new Error("Session expired");
      }

      return res;
    },
    [token, logout] // only changes identity when token actually changes
  );

  return apiFetch;
}