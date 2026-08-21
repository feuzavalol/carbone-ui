import { useEffect, useState, useCallback } from "react";
import type { Committee } from "../types/committeeTypes";
import { useApi } from "./useApi";
import { API_URL } from "../constants/url";

function useCommittee(id: string) {
  const apiFetch = useApi();
  const [committee, setCommittee] = useState<Committee>({
    id: "",
    category: "",
    number: 0,
    year: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCommittee = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/committee?id=${id}`);
      const data = await response.json();
      setCommittee(data);
    } catch (err) {
      console.error("Error fetching committee:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [apiFetch, id]);

  useEffect(() => {
    fetchCommittee();
  }, [fetchCommittee]);

  return { committee, loading, error };
}

function useCommittees(year: number) {
    const apiFetch = useApi();
    const [committees, setCommittees] = useState<Committee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    

    const fetchCommitteeList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/committees?year=${year}`);
      const data = await response.json();
      setCommittees(data[`${year}`]);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching committee:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [apiFetch, year]);

  useEffect(() => {
    fetchCommitteeList();
  }, [fetchCommitteeList]);
    
  return { committees, loading, error };
};

export { useCommittee, useCommittees }