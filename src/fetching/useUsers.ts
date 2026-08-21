import { useState, useEffect, useCallback } from "react";
import { API_URL } from "../constants/url";
import { useApi } from "./useApi";

function useUserList() {
  const apiFetch = useApi();
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchUsers = useCallback(async () => {
    try {
    setLoading(true);
    const response = await apiFetch(`${API_URL}/users`);
    const data = await response.json();
    setUserList(data);
    } catch (err) {
    console.error("Error fetching committee:", err);
    setError(err as Error);
    } finally {
    setLoading(false);
    }
  }, [apiFetch]);
    
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  return { userList, loading, error };
};


export { useUserList }