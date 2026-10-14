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

function useCommittees(year: string | number | null) {
    const apiFetch = useApi();
    const [committees, setCommittees] = useState<Committee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    

    const fetchCommitteeList = useCallback(async () => {
    try {
      if (year == null){
        return;
      }
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

function useYear(){
  const apiFetch = useApi();
    const [years, setYears] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    

    const fetchYears = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/years`);
      const data = await response.json();
      setYears(data.success);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching years:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchYears();
  }, [fetchYears]);
    
  return { years, loading, error };
}

function useRoles(year: string | number | null){
  const apiFetch = useApi();
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  

  const fetchYears = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/roles?year=${year}`);
      const data = await response.json();
      setRoles(data.success);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching roles:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchYears();
  }, [fetchYears]);
    
  return { roles, loadingRoles: loading, errorRoles: error };
}

function useCommitteeCategories(year: string | number | null){
  const apiFetch = useApi();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/categories?year=${year}`);
      const data = await response.json();
      setCategories(data.success);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching roles:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
    
  return { categories, loadingCategories: loading, errorCategories: error };
}

export { useCommittee, useCommittees, useYear, useRoles, useCommitteeCategories }